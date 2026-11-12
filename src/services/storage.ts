import { User, SystemSettings, PublishedApp, PaymentOrder, TopLinkButton } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'shomu_current_user',
  USERS: 'shomu_users_list',
  SETTINGS: 'shomu_system_settings',
  APPS: 'shomu_published_apps',
  ORDERS: 'shomu_payment_orders',
};

export const DEFAULT_SETTINGS: SystemSettings = {
  appName: 'Shomu AI',
  maintenanceMode: false,
  maintenanceMessage: 'Server update in progress under supervision of Asif Boss. Please check our official Telegram updates channel.',
  maintenanceRedirectUrl: 'https://t.me/learndevlopment',
  fampayUpiId: 'fampay.asif@idfcbank',
  fampayWebhookUrl: 'https://codex-as07.onrender.com',
  minAmount: 10,
  maxAmount: 50000,
  orderTimeoutMinutes: 15,
  accentColor: 'pink',
  superAdminUsername: 'asif_boss',
  superAdminDisplayName: 'Asif Boss 👑 (Supreme Owner)',
  topButtons: [
    {
      id: 'btn-setup',
      title: 'HOW TO SETUP',
      url: 'https://youtu.be/EB7XEc7sLZo?si=OyNq9Q4d9_qasGx6',
      iconName: 'PlayCircle',
      variant: 'primary',
    },
    {
      id: 'btn-owner',
      title: 'CONTACT OWNER',
      url: 'https://t.me/TheIdMarket',
      iconName: 'Send',
      variant: 'secondary',
    },
    {
      id: 'btn-updates',
      title: 'ALL UPDATES',
      url: 'https://t.me/learndevlopment',
      iconName: 'Bell',
      variant: 'accent',
    },
  ],
};

export const SUPER_ADMIN_CREDENTIALS = {
  username: 'asif_boss',
  password: 'AsifBoss@786#',
  name: 'Asif Boss 👑',
  email: 'asif.boss@shomu.ai',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_super_admin',
    name: 'Asif Boss 👑',
    email: 'asif.boss@shomu.ai',
    role: 'super_admin',
    balance: 999999,
    isBanned: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr_demo_1',
    name: 'Rohit Sharma',
    email: 'rohit@gmail.com',
    role: 'user',
    balance: 350,
    isBanned: false,
    createdAt: '2026-02-10T10:15:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'usr_demo_2',
    name: 'Vikas Kumar',
    email: 'vikas_bot@yahoo.com',
    role: 'user',
    balance: 120,
    isBanned: false,
    createdAt: '2026-02-14T18:40:00.000Z',
    lastLogin: new Date().toISOString(),
  },
];

export const INITIAL_APPS: PublishedApp[] = [
  {
    id: 'app_tg_101',
    creatorId: 'usr_super_admin',
    creatorName: 'Asif Boss 👑',
    appName: 'Shomu AI Pro Telegram Bot',
    appType: 'telegram_bot',
    description: 'High speed AI assistance, auto moderation, and multi-prompt intelligence.',
    botToken: '7392819283:AAFkL_0192847291',
    systemPrompt: 'You are Shomu AI, designed and engineered by Asif Boss. Answer fast and politely.',
    appUrl: 'https://t.me/shomu_ai_assistant_bot',
    isActive: true,
    isLockedByAdmin: false,
    createdAt: '2026-02-01T12:00:00.000Z',
    totalCalls: 14280,
  },
  {
    id: 'app_fampay_202',
    creatorId: 'usr_super_admin',
    creatorName: 'Asif Boss 👑',
    appName: 'FamPay Auto Webhook Gateway',
    appType: 'upi_gateway',
    description: 'Automatic FamPay UPI transaction confirmation with 15-minute order locking.',
    systemPrompt: 'Validate FamPay UTRs and notify merchant callback immediately.',
    appUrl: 'https://codex-as07.onrender.com/webhook',
    isActive: true,
    isLockedByAdmin: false,
    createdAt: '2026-02-05T09:30:00.000Z',
    totalCalls: 8590,
  },
  {
    id: 'app_demo_303',
    creatorId: 'usr_demo_1',
    creatorName: 'Rohit Sharma',
    appName: 'Rohit Tech Bot',
    appType: 'ai_assistant',
    description: 'Customer support assistant created via Shomu AI platform.',
    botToken: '6829104819:AAH92kd-98124',
    systemPrompt: 'Provide helpful assistance.',
    appUrl: 'https://shomu.ai/bot/rohit-tech',
    isActive: true,
    isLockedByAdmin: false,
    createdAt: '2026-02-18T14:10:00.000Z',
    totalCalls: 450,
  },
];

class StorageService {
  private syncChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.syncChannel = new BroadcastChannel('shomu_state_sync');
    }
  }

  private notifyUpdate(type: string, data?: unknown) {
    if (this.syncChannel) {
      this.syncChannel.postMessage({ type, data, timestamp: Date.now() });
    }
    // Also trigger custom DOM event for current window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shomu_storage_change', { detail: { type, data } }));
    }
  }

  getSettings(): SystemSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  updateSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.notifyUpdate('SETTINGS_UPDATED', updated);
    return updated;
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load users', e);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notifyUpdate('USERS_UPDATED', users);
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        const user: User = JSON.parse(data);
        // Refresh with latest state from users list in case balance or ban status changed
        const users = this.getUsers();
        const latest = users.find((u) => u.id === user.id);
        if (latest) {
          return latest;
        }
        return user;
      }
    } catch (e) {
      console.error('Failed to get current user', e);
    }
    // Default logged in as demo user or super admin
    const defaultUser = this.getUsers()[0]; // Asif Boss
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyUpdate('CURRENT_USER_UPDATED', user);
  }

  updateUserBalance(userId: string, deltaAmount: number): User | null {
    const users = this.getUsers();
    let updatedUser: User | null = null;
    const nextUsers = users.map((u) => {
      if (u.id === userId) {
        const newBal = Math.max(0, u.balance + deltaAmount);
        updatedUser = { ...u, balance: newBal };
        return updatedUser;
      }
      return u;
    });

    this.saveUsers(nextUsers);

    // If current user modified
    const current = this.getCurrentUser();
    if (current && current.id === userId && updatedUser) {
      this.setCurrentUser(updatedUser);
    }
    return updatedUser;
  }

  setUserBanStatus(userId: string, isBanned: boolean) {
    const users = this.getUsers();
    const nextUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, isBanned };
      }
      return u;
    });
    this.saveUsers(nextUsers);

    // CRITICAL USER REQUIREMENT:
    // If a user is banned, ALL apps created by this user become locked/broken and redirect to t.me/learndevlopment
    const apps = this.getApps();
    const updatedApps = apps.map((app) => {
      if (app.creatorId === userId) {
        return {
          ...app,
          isActive: !isBanned,
          isLockedByAdmin: isBanned,
        };
      }
      return app;
    });
    this.saveApps(updatedApps);

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      const updatedCurr = nextUsers.find((u) => u.id === userId) || null;
      this.setCurrentUser(updatedCurr);
    }
    this.notifyUpdate('USER_BAN_CHANGED', { userId, isBanned });
  }

  getApps(): PublishedApp[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load apps', e);
    }
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  }

  saveApps(apps: PublishedApp[]) {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    this.notifyUpdate('APPS_UPDATED', apps);
  }

  createApp(appData: Omit<PublishedApp, 'id' | 'createdAt' | 'totalCalls' | 'isActive' | 'isLockedByAdmin'>): PublishedApp {
    const apps = this.getApps();
    const newApp: PublishedApp = {
      ...appData,
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      totalCalls: 0,
      isActive: true,
      isLockedByAdmin: false,
    };
    const nextApps = [newApp, ...apps];
    this.saveApps(nextApps);
    return newApp;
  }

  deleteApp(appId: string) {
    const apps = this.getApps();
    const nextApps = apps.filter((a) => a.id !== appId);
    this.saveApps(nextApps);
  }

  getOrders(): PaymentOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
    return [];
  }

  saveOrders(orders: PaymentOrder[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyUpdate('ORDERS_UPDATED', orders);
  }

  addOrder(order: PaymentOrder) {
    const orders = this.getOrders();
    const nextOrders = [order, ...orders];
    this.saveOrders(nextOrders);
  }

  updateOrderStatus(orderId: string, status: PaymentOrder['status'], utr?: string): PaymentOrder | null {
    const orders = this.getOrders();
    let updated: PaymentOrder | null = null;
    const nextOrders = orders.map((o) => {
      if (o.orderId === orderId) {
        updated = {
          ...o,
          status,
          utr: utr || o.utr,
          verifiedAt: status === 'SUCCESS' ? Date.now() : o.verifiedAt,
        };
        return updated;
      }
      return o;
    });

    this.saveOrders(nextOrders);

    if (updated && status === 'SUCCESS') {
      // Automatically credit user balance
      const ord: PaymentOrder = updated;
      this.updateUserBalance(ord.userId, ord.amount);
    }

    return updated;
  }
}

export const storage = new StorageService();
