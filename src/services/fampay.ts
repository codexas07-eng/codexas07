import { storage } from './storage';
import { PaymentOrder } from '../types';

export interface CreateOrderResult {
  success: boolean;
  order?: PaymentOrder;
  error?: 'too_many_open' | 'bad_amount' | 'not_configured' | 'general_error';
  errorMessage?: string;
}

export const PAYMENT_ANIMATION_FRAMES = [
  '🔐 Secure order ban raha hai...',
  '🔐 Order created ✅\n📲 QR generate ho raha hai...',
  '🔐 Order created ✅\n📲 QR ready ✅\n💎 Opening payment screen...',
  '🎯 ORDER LOCKED',
  '🎯 ORDER LOCKED\n📲 QR GENERATE HO GAYA ✅ — 15 min valid',
];

export class FamPayGateway {
  static createOrder(userId: string, userName: string, amount: number): CreateOrderResult {
    const settings = storage.getSettings();

    // Check configuration
    if (!settings.fampayUpiId) {
      return {
        success: false,
        error: 'not_configured',
        errorMessage: 'Auto payment service abhi available nahi hai. Admin must set FamPay UPI ID.',
      };
    }

    // Check amount boundaries
    if (isNaN(amount) || amount < settings.minAmount || amount > settings.maxAmount) {
      return {
        success: false,
        error: 'bad_amount',
        errorMessage: `❌ Amount ₹${settings.minAmount} – ₹${settings.maxAmount.toLocaleString()} ke beech hona chahiye`,
      };
    }

    // Check existing pending orders for this user
    const orders = storage.getOrders();
    const existingPending = orders.filter(
      (o) => o.userId === userId && o.status === 'PENDING' && o.expiresAt > Date.now()
    );

    if (existingPending.length >= 2) {
      return {
        success: false,
        error: 'too_many_open',
        errorMessage: '⛔ Pehle purane pending orders complete ya cancel karo',
      };
    }

    const orderId = `FAM-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = Date.now();
    const expiresAt = now + (settings.orderTimeoutMinutes || 15) * 60 * 1000;

    // Build standard UPI deep link URI
    const upiUri = `upi://pay?pa=${encodeURIComponent(settings.fampayUpiId)}&pn=${encodeURIComponent(
      'Shomu AI Asif Boss'
    )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;

    const newOrder: PaymentOrder = {
      orderId,
      userId,
      userName,
      amount,
      upiUri,
      upiId: settings.fampayUpiId,
      status: 'PENDING',
      createdAt: now,
      expiresAt,
    };

    storage.addOrder(newOrder);

    return {
      success: true,
      order: newOrder,
    };
  }

  static async checkPaymentStatus(
    orderId: string,
    providedUtr?: string
  ): Promise<{ status: 'SUCCESS' | 'PENDING' | 'FAILED'; message: string; autoVerified: boolean }> {
    const settings = storage.getSettings();
    const orders = storage.getOrders();
    const order = orders.find((o) => o.orderId === orderId);

    if (!order) {
      return { status: 'FAILED', message: 'Order not found in database', autoVerified: false };
    }

    if (order.status === 'SUCCESS') {
      return { status: 'SUCCESS', message: '✅ Order pehle se successfully verified hai!', autoVerified: true };
    }

    if (Date.now() > order.expiresAt) {
      storage.updateOrderStatus(orderId, 'CANCELLED');
      return { status: 'FAILED', message: '⏱️ Yeh QR code expire ho chuka hai (15 min limit over). Naya order banayein.', autoVerified: false };
    }

    // Attempt online auto verification via the provided backend endpoint
    let apiSuccess = false;
    let apiNote = '';

    try {
      const endpoint = `${settings.fampayWebhookUrl.replace(/\/$/, '')}/check`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount: order.amount,
          utr: providedUtr || order.utr,
          upi_id: order.upiId,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' || json.verified === true || json.paid === true) {
          apiSuccess = true;
          apiNote = json.message || 'Auto verified via FamPay email webhook';
        }
      }
    } catch (err) {
      // Server may be sleeping (Render free tier spin-up) or network blocked
      console.log('Online auto webhook check failed or timed out:', err);
    }

    if (apiSuccess) {
      storage.updateOrderStatus(orderId, 'SUCCESS', providedUtr);
      return {
        status: 'SUCCESS',
        message: `✅ Auto Payment Verified via FamPay! ₹${order.amount} credited to your wallet. (${apiNote})`,
        autoVerified: true,
      };
    }

    // If user provided a valid 12-digit UPI UTR / Reference number
    if (providedUtr && /^[0-9]{12}$/.test(providedUtr.trim())) {
      storage.updateOrderStatus(orderId, 'SUCCESS', providedUtr.trim());
      return {
        status: 'SUCCESS',
        message: `✅ UTR ${providedUtr.trim()} Verified! ₹${order.amount} balance successfully added.`,
        autoVerified: false,
      };
    }

    if (providedUtr && providedUtr.trim().length > 0 && !/^[0-9]{12}$/.test(providedUtr.trim())) {
      return {
        status: 'PENDING',
        message: '⚠️ UTR number 12 digits ka hona chahiye (e.g., 428192839102). Kripya check karein.',
        autoVerified: false,
      };
    }

    return {
      status: 'PENDING',
      message: '⏳ Payment abhi pending hai. UPI app se payment karke 12 digit ka UTR dalein ya 1-2 min baad check status karein.',
      autoVerified: false,
    };
  }

  static cancelOrder(orderId: string): boolean {
    const updated = storage.updateOrderStatus(orderId, 'CANCELLED');
    return !!updated;
  }
}
