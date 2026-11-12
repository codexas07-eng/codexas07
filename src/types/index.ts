export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'user';
  balance: number;
  isBanned: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface TopLinkButton {
  id: string;
  title: string;
  url: string;
  iconName: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export interface PaymentOrder {
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  upiUri: string;
  upiId: string;
  utr?: string;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'FAILED';
  createdAt: number;
  expiresAt: number;
  verifiedAt?: number;
}

export interface PublishedApp {
  id: string;
  creatorId: string;
  creatorName: string;
  appName: string;
  appType: 'telegram_bot' | 'ai_assistant' | 'upi_gateway' | 'ecommerce_bot' | 'custom_tool';
  description: string;
  botToken?: string;
  systemPrompt: string;
  appUrl: string;
  isActive: boolean;
  isLockedByAdmin: boolean;
  createdAt: string;
  totalCalls: number;
}

export interface SystemSettings {
  appName: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceRedirectUrl: string;
  fampayUpiId: string;
  fampayWebhookUrl: string;
  minAmount: number;
  maxAmount: number;
  orderTimeoutMinutes: number;
  accentColor: 'cyan' | 'pink' | 'purple' | 'emerald';
  topButtons: TopLinkButton[];
  superAdminUsername: string;
  superAdminDisplayName: string;
}
