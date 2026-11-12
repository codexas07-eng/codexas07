import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  RotateCw,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { User, PaymentOrder, SystemSettings } from '../types';
import { FamPayGateway, PAYMENT_ANIMATION_FRAMES } from '../services/fampay';

interface FamPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  settings: SystemSettings;
  onBalanceUpdated: () => void;
}

export const FamPayModal: React.FC<FamPayModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  settings,
  onBalanceUpdated,
}) => {
  const [step, setStep] = useState<'input' | 'animating' | 'qr_active' | 'success'>('input');
  const [amount, setAmount] = useState<string>('100');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [animationIndex, setAnimationIndex] = useState<number>(0);
  const [activeOrder, setActiveOrder] = useState<PaymentOrder | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [utrInput, setUtrInput] = useState<string>('');
  const [showUtrField, setShowUtrField] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset state when opening modal
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setErrorMessage('');
      setShowUtrField(false);
      setUtrInput('');
      setStatusMessage(null);
    }
  }, [isOpen]);

  // Handle 15 min countdown timer
  useEffect(() => {
    if (step !== 'qr_active' || !activeOrder) return;

    const interval = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.floor((activeOrder.expiresAt - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        setStatusMessage({
          text: '⏱️ Yeh QR code expire ho chuka hai (15 min window over). Kripya naya order banayein.',
          type: 'error',
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, activeOrder]);

  // Render QR Code onto canvas
  useEffect(() => {
    if (step === 'qr_active' && activeOrder && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        activeOrder.upiUri,
        {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('QR rendering error', err);
        }
      );
    }
  }, [step, activeOrder]);

  const animationTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleCreateOrder = () => {
    setErrorMessage('');
    const numAmount = parseInt(amount, 10);

    if (!currentUser) {
      setErrorMessage('User session invalid. Please log in.');
      return;
    }

    const result = FamPayGateway.createOrder(currentUser.id, currentUser.name, numAmount);

    if (!result.success || !result.order) {
      setErrorMessage(result.errorMessage || 'Order creation failed');
      return;
    }

    const order = result.order;
    setActiveOrder(order);
    setStep('animating');
    setAnimationIndex(0);

    // Play Telegram bot frames animation as specified by user
    let currentFrame = 0;
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    animationTimerRef.current = setInterval(() => {
      currentFrame++;
      if (currentFrame < PAYMENT_ANIMATION_FRAMES.length) {
        setAnimationIndex(currentFrame);
      } else {
        clearInterval(animationTimerRef.current);
        setStep('qr_active');
      }
    }, 450);
  };

  const handleCopy = (text: string, fieldName: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.log('Copy fallback error', e);
    }
  };

  const handleCheckStatus = async () => {
    if (!activeOrder) return;
    setIsVerifying(true);
    setStatusMessage({ text: '🔄 Checking auto payment status with FamPay webhook...', type: 'info' });

    try {
      const res = await FamPayGateway.checkPaymentStatus(activeOrder.orderId, utrInput);
      if (res.status === 'SUCCESS') {
        setStatusMessage({ text: res.message, type: 'success' });
        setStep('success');
        onBalanceUpdated();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#ff2a85', '#ffd700'],
        });
      } else if (res.status === 'PENDING') {
        setStatusMessage({ text: res.message, type: 'info' });
      } else {
        setStatusMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setStatusMessage({ text: 'Error communicating with FamPay payment service.', type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelOrder = () => {
    if (activeOrder) {
      FamPayGateway.cancelOrder(activeOrder.orderId);
    }
    setStep('input');
    setActiveOrder(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#131526] via-[#0c0d18] to-[#090a12] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.2)] overflow-hidden text-slate-100">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>FamPay Auto UPI Gateway</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30 font-mono">
                  LIVE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Official Auto Email & UPI System</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {/* STEP 1: AMOUNT INPUT */}
          {step === 'input' && (
            <div className="space-y-4">
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Instant auto credit via FamPay UPI. 100% automated with zero manual waiting.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Amount to Recharge (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={settings.minAmount}
                    max={settings.maxAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-white font-bold text-lg outline-none transition-all font-mono"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Min: ₹{settings.minAmount}</span>
                  <span>Max: ₹{settings.maxAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Amount Quick Presets */}
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Quick Presets:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        amount === preset.toString()
                          ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-[0_0_10px_rgba(255,42,133,0.3)]'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Information Footnote */}
              <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>FamPay UPI ID:</span>
                  <span className="text-cyan-300 font-mono">{settings.fampayUpiId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto Verification:</span>
                  <span className="text-emerald-400">codex-as07.onrender.com</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateOrder}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-extrabold rounded-xl shadow-[0_0_20px_rgba(255,42,133,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>GENERATE FAM-PAY QR</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: ANIMATING TELEGRAM BOT FRAMES */}
          {step === 'animating' && (
            <div className="py-8 text-center space-y-5">
              <div className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-cyan-950/40 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                <RotateCw className="w-10 h-10 text-cyan-400 animate-spin" />
                <span className="absolute text-xs font-bold text-pink-400">
                  {animationIndex + 1}/{PAYMENT_ANIMATION_FRAMES.length}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-sm whitespace-pre-line text-cyan-300 min-h-[90px] flex items-center justify-center">
                {PAYMENT_ANIMATION_FRAMES[animationIndex]}
              </div>

              <p className="text-xs text-slate-400">
                Connecting to FamPay UPI Server & locking order...
              </p>
            </div>
          )}

          {/* STEP 3: QR CODE ACTIVE SCREEN */}
          {step === 'qr_active' && activeOrder && (
            <div className="space-y-4">
              {/* Order Lock Banner */}
              <div className="flex items-center justify-between bg-slate-900/80 border border-pink-500/30 rounded-xl px-3 py-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">ORDER ID</span>
                  <span className="font-mono font-bold text-pink-300">{activeOrder.orderId}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-lg font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-[0_0_25px_rgba(255,42,133,0.25)] border-2 border-pink-500/60 mx-auto max-w-[270px]">
                <canvas ref={qrCanvasRef} className="rounded-lg shadow-sm" />
                <div className="mt-2 text-center text-slate-900">
                  <div className="text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                    <span>Scan with Any UPI App</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block">
                    PhonePe / Paytm / GPay / FamPay
                  </span>
                </div>
              </div>

              {/* Amount to pay */}
              <div className="text-center">
                <span className="text-xs text-slate-400">Exact Amount to Pay</span>
                <div className="text-2xl font-black text-white font-mono flex items-center justify-center gap-1">
                  <span className="text-emerald-400">₹{activeOrder.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Copy FamPay UPI ID button */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">FamPay UPI ID</span>
                  <span className="font-mono text-cyan-300 font-semibold">{activeOrder.upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeOrder.upiId, 'upi')}
                  className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs transition-colors"
                >
                  {copiedField === 'upi' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct UPI Intent Link for mobile phones */}
              <a
                href={activeOrder.upiUri}
                className="w-full py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open in UPI App Directly (Mobile)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* UTR Submission Field (Toggleable) */}
              {showUtrField ? (
                <div className="space-y-2 p-3 bg-slate-900/90 border border-purple-500/30 rounded-xl">
                  <label className="block text-xs font-semibold text-purple-300">
                    Enter 12-Digit UTR / UPI Reference No:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 428192839102"
                    className="w-full px-3 py-2 bg-black border border-slate-700 focus:border-purple-400 rounded-lg text-white font-mono text-sm outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    UPI app ke receipt screen me UTR / Ref ID dekhein.
                  </p>
                </div>
              ) : null}

              {/* Status Message Notification */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-200'
                      : statusMessage.type === 'error'
                      ? 'bg-red-950/50 border border-red-500/50 text-red-200'
                      : 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="flex-1">{statusMessage.text}</span>
                </div>
              )}

              {/* 3 Main Action Buttons from Telegram Bot */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* btn_done */}
                <button
                  type="button"
                  onClick={() => {
                    if (!showUtrField) {
                      setShowUtrField(true);
                    } else {
                      handleCheckStatus();
                    }
                  }}
                  className="py-2.5 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{showUtrField ? 'Verify UTR' : 'Done (UTR)'}</span>
                </button>

                {/* btn_status */}
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={isVerifying}
                  className="py-2.5 px-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Auto Check</span>
                </button>

                {/* btn_cancel */}
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="py-2.5 px-2 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS SCREEN */}
          {step === 'success' && activeOrder && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Payment Successful!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  ₹{activeOrder.amount} has been added to your FamPay Wallet.
                </p>
                <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                  Order: {activeOrder.orderId}
                </span>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                🎉 Your balance has been updated in real-time. You can now publish and manage apps!
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl text-sm shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
