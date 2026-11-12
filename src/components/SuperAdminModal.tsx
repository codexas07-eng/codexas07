import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  Users,
  Wallet,
  Settings,
  Link as LinkIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Ban,
  UserCheck,
  TrendingUp,
  CreditCard,
  Crown,
  Key,
  ExternalLink,
  Save,
  Lock,
  Unlock,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { User, SystemSettings, PublishedApp, PaymentOrder, TopLinkButton } from '../types';
import { storage, SUPER_ADMIN_CREDENTIALS } from '../services/storage';

interface SuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  settings: SystemSettings;
  onSettingsChanged: (newSettings: SystemSettings) => void;
  onRefreshData: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  settings,
  onSettingsChanged,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    currentUser?.role === 'super_admin'
  );
  const [usernameInput, setUsernameInput] = useState<string>('asif_boss');
  const [passwordInput, setPasswordInput] = useState<string>('AsifBoss@786#');
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'maintenance' | 'users' | 'buttons' | 'fampay' | 'orders' | 'apps'
  >('analytics');

  // Form states for settings
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Balance adjustment modal
  const [balanceModalUser, setBalanceModalUser] = useState<User | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<string>('100');

  // New button modal
  const [newBtnTitle, setNewBtnTitle] = useState<string>('');
  const [newBtnUrl, setNewBtnUrl] = useState<string>('');

  // New user modal
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserBalance, setNewUserBalance] = useState<string>('200');

  if (!isOpen) return null;

  const users = storage.getUsers();
  const apps = storage.getApps();
  const orders = storage.getOrders();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput === SUPER_ADMIN_CREDENTIALS.username &&
      passwordInput === SUPER_ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      // Set current user as Super Admin if not already
      const adminUser = users.find((u) => u.role === 'super_admin') || {
        id: 'usr_super_admin',
        name: SUPER_ADMIN_CREDENTIALS.name,
        email: SUPER_ADMIN_CREDENTIALS.email,
        role: 'super_admin' as const,
        balance: 999999,
        isBanned: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString(),
      };
      storage.setCurrentUser(adminUser);
      onRefreshData();
    } else {
      setLoginError('❌ Galat ID ya Password! Asif Boss ki secret credentials use karein.');
    }
  };

  const handleSaveSettings = (updated: Partial<SystemSettings>) => {
    const next = storage.updateSettings(updated);
    setLocalSettings(next);
    onSettingsChanged(next);
    setSaveSuccessMsg('✅ Changes saved and broadcasted live!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleToggleMaintenance = () => {
    const nextState = !localSettings.maintenanceMode;
    handleSaveSettings({ maintenanceMode: nextState });
  };

  const handleBanToggle = (user: User) => {
    const nextBan = !user.isBanned;
    storage.setUserBanStatus(user.id, nextBan);
    onRefreshData();
  };

  const handleAdjustBalance = (user: User, isAddition: boolean) => {
    const delta = parseInt(balanceDelta, 10);
    if (isNaN(delta) || delta <= 0) return;
    storage.updateUserBalance(user.id, isAddition ? delta : -delta);
    setBalanceModalUser(null);
    onRefreshData();
  };

  const handleAddTopButton = () => {
    if (!newBtnTitle || !newBtnUrl) return;
    const newBtn: TopLinkButton = {
      id: `btn-${Date.now()}`,
      title: newBtnTitle.toUpperCase(),
      url: newBtnUrl,
      iconName: 'ExternalLink',
      variant: 'accent',
    };
    const nextButtons = [...localSettings.topButtons, newBtn];
    handleSaveSettings({ topButtons: nextButtons });
    setNewBtnTitle('');
    setNewBtnUrl('');
  };

  const handleDeleteTopButton = (btnId: string) => {
    const nextButtons = localSettings.topButtons.filter((b) => b.id !== btnId);
    handleSaveSettings({ topButtons: nextButtons });
  };

  const handleManualApproveOrder = (orderId: string) => {
    storage.updateOrderStatus(orderId, 'SUCCESS');
    onRefreshData();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName) return;
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: newUserName,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: 'user',
      balance: parseInt(newUserBalance, 10) || 0,
      isBanned: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    storage.saveUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    onRefreshData();
  };

  // Calculations for analytics
  const totalRevenue = orders
    .filter((o) => o.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#131525] via-[#0c0d18] to-[#07080f] border border-pink-500/40 rounded-2xl shadow-[0_0_50px_rgba(255,42,133,0.3)] overflow-hidden text-slate-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-pink-950/70 via-purple-950/50 to-cyan-950/70 border-b border-pink-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(255,42,133,0.4)]">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  SUPER ADMIN COMMAND CENTER
                </h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  ASIF BOSS EXCLUSIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Server Control • Maintenance Kill-Switch • Users & FamPay Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-8 max-w-md mx-auto w-full my-auto text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mx-auto text-pink-400 shadow-[0_0_25px_rgba(255,42,133,0.3)]">
              <Key className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Super Admin Authentication</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter Asif Boss credentials to unlock the master control room.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Username:
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl text-white font-mono text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Password:
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-xl text-white font-mono text-sm outline-none"
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-lg">
                  {loginError}
                </div>
              )}

              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                <span className="text-amber-400 font-bold block mb-0.5">Preset Credentials for Asif Boss:</span>
                <div>ID: <code className="text-cyan-300 font-bold">asif_boss</code></div>
                <div>Pass: <code className="text-pink-300 font-bold">AsifBoss@786#</code></div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                UNLOCK ADMIN CONSOLE
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-2 sm:p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-pink-600/30 text-pink-200 border border-pink-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span>Dashboard & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'maintenance'
                    ? 'bg-red-600/30 text-red-200 border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Maintenance Mode</span>
                {localSettings.maintenanceMode && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping ml-auto"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Users & Balances</span>
              </button>

              <button
                onClick={() => setActiveTab('buttons')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'buttons'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-4 h-4 text-purple-400" />
                <span>Edit Top Buttons</span>
              </button>

              <button
                onClick={() => setActiveTab('fampay')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'fampay'
                    ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>FamPay UPI Config</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Orders ({orders.length})</span>
                {pendingOrdersCount > 0 && (
                  <span className="ml-auto text-[10px] bg-amber-500/30 text-amber-300 px-1.5 rounded-full font-bold">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <div className="mt-auto hidden md:block pt-3 border-t border-slate-900 text-[11px] text-slate-500">
                Logged in as <strong className="text-pink-300">Asif Boss</strong>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: ANALYTICS & DASHBOARD */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Real-Time Platform Overview</h3>
                    <p className="text-xs text-slate-400">Live operational stats for Shomu AI portal.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[11px] text-slate-400 block">Total Users</span>
                      <span className="text-2xl font-extrabold text-white font-mono">{users.length}</span>
                      <span className="text-[10px] text-cyan-400 block mt-0.5">{bannedUsersCount} Banned</span>
                    </div>

                    <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[11px] text-slate-400 block">Total Revenue</span>
                      <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹{totalRevenue}</span>
                      <span className="text-[10px] text-emerald-500 block mt-0.5">FamPay Auto Verified</span>
                    </div>

                    <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[11px] text-slate-400 block">Published Apps</span>
                      <span className="text-2xl font-extrabold text-purple-400 font-mono">{apps.length}</span>
                      <span className="text-[10px] text-purple-300 block mt-0.5">Active Bots & Tools</span>
                    </div>

                    <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[11px] text-slate-400 block">Maintenance Status</span>
                      <span className={`text-base font-extrabold block mt-1 ${localSettings.maintenanceMode ? 'text-red-400' : 'text-emerald-400'}`}>
                        {localSettings.maintenanceMode ? 'ACTIVE (LOCKED)' : 'ONLINE'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Controlled by Asif</span>
                    </div>
                  </div>

                  {/* Creator Spotlight */}
                  <div className="p-4 bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-slate-900 border border-pink-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                        <img src="/assets/aistudio/photo_2026-11-11_21-56-49_a8ac478e.jpg" alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Architect & Owner: Asif Boss 👑</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          &quot;Shomu AI ki her ek line aur function Asif Boss ke direct instruction par build kiya gaya hai. Sabhi tareefein aur rights Asif Boss ke naam hain.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE MAINTENANCE KILL-SWITCH */}
              {activeTab === 'maintenance' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                      <span>Live Maintenance & Online Expiry Controller</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      As requested: When Maintenance is ON, regular users who log in see an expiry warning and are automatically redirected to your Telegram channel (<strong>https://t.me/learndevlopment</strong>). Only Super Admin (Asif Boss) retains access to fix & update.
                    </p>
                  </div>

                  {/* Big Toggle Switch */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    localSettings.maintenanceMode
                      ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                      : 'bg-emerald-950/30 border-emerald-500/40'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">
                            Status: {localSettings.maintenanceMode ? '🔴 MAINTENANCE IS ON' : '🟢 SERVER IS ONLINE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          {localSettings.maintenanceMode
                            ? 'All regular users are currently blocked & redirected to Telegram.'
                            : 'Normal users can access dashboard, wallet, and bots normally.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleMaintenance}
                        className={`px-6 py-3 rounded-xl font-extrabold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
                          localSettings.maintenanceMode
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                        }`}
                      >
                        {localSettings.maintenanceMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span>{localSettings.maintenanceMode ? 'TURN OFF MAINTENANCE' : 'ACTIVATE MAINTENANCE NOW'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Settings fields for maintenance */}
                  <div className="space-y-3 bg-slate-900/60 p-4 border border-slate-800 rounded-xl">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Telegram Auto-Redirect URL:
                      </label>
                      <input
                        type="url"
                        value={localSettings.maintenanceRedirectUrl}
                        onChange={(e) => setLocalSettings({ ...localSettings, maintenanceRedirectUrl: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Maintenance Alert Notice:
                      </label>
                      <textarea
                        rows={3}
                        value={localSettings.maintenanceMessage}
                        onChange={(e) => setLocalSettings({ ...localSettings, maintenanceMessage: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSettings({
                        maintenanceRedirectUrl: localSettings.maintenanceRedirectUrl,
                        maintenanceMessage: localSettings.maintenanceMessage,
                      })}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Maintenance Configuration</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: USER MANAGEMENT & BAN SYSTEM */}
              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white">Users & Balance Management</h3>
                      <p className="text-xs text-slate-400">
                        Add/deduct money, ban/unban users. Banning a user automatically disables all apps created by them!
                      </p>
                    </div>
                  </div>

                  {/* Quick Add User Form */}
                  <form onSubmit={handleCreateUser} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap gap-2 items-center text-xs">
                    <input
                      type="text"
                      placeholder="User Name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="px-3 py-1.5 bg-black border border-slate-700 rounded-lg text-white text-xs outline-none flex-1 min-w-[130px]"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="px-3 py-1.5 bg-black border border-slate-700 rounded-lg text-white text-xs outline-none flex-1 min-w-[150px]"
                    />
                    <input
                      type="number"
                      placeholder="Initial Balance ₹"
                      value={newUserBalance}
                      onChange={(e) => setNewUserBalance(e.target.value)}
                      className="w-28 px-3 py-1.5 bg-black border border-slate-700 rounded-lg text-white text-xs outline-none font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add User</span>
                    </button>
                  </form>

                  {/* Users Table */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3">User</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Balance</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/30">
                            <td className="p-3">
                              <div className="font-semibold text-white">{u.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                            </td>
                            <td className="p-3">
                              {u.role === 'super_admin' ? (
                                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                  <Crown className="w-3 h-3" />
                                  SUPER ADMIN
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                                  REGULAR USER
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-mono font-bold text-emerald-400">
                              ₹{u.balance}
                            </td>
                            <td className="p-3">
                              {u.isBanned ? (
                                <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                  <Ban className="w-3 h-3" />
                                  BANNED (APPS BROKEN)
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {u.role !== 'super_admin' && (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setBalanceModalUser(u)}
                                    className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 rounded text-[11px] font-semibold"
                                  >
                                    Adjust Bal (±₹)
                                  </button>
                                  <button
                                    onClick={() => handleBanToggle(u)}
                                    className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                                      u.isBanned
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        : 'bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-300'
                                    }`}
                                  >
                                    {u.isBanned ? 'Unban' : 'BAN'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Balance Adjustment Mini-Modal */}
                  {balanceModalUser && (
                    <div className="p-4 bg-slate-900 border border-emerald-500/40 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-emerald-300">
                          Adjust Balance for: <span className="text-white">{balanceModalUser.name}</span> (Current: ₹{balanceModalUser.balance})
                        </h4>
                        <button onClick={() => setBalanceModalUser(null)} className="text-slate-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={balanceDelta}
                          onChange={(e) => setBalanceDelta(e.target.value)}
                          placeholder="Amount"
                          className="px-3 py-1.5 bg-black border border-slate-700 rounded-lg text-white font-mono text-xs w-36"
                        />
                        <button
                          onClick={() => handleAdjustBalance(balanceModalUser, true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add (+₹)</span>
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(balanceModalUser, false)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                        >
                          <span>Minus (-₹)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: HEADER BUTTONS & LINKS MANAGER */}
              {activeTab === 'buttons' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white">Manage Top 3 Header Buttons & Links</h3>
                    <p className="text-xs text-slate-400">
                      As requested: Edit titles, destinations, add new buttons, or remove buttons live in real time.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {localSettings.topButtons.map((btn, index) => (
                      <div
                        key={btn.id}
                        className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block">{btn.title}</span>
                            <a
                              href={btn.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              <span>{btn.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleDeleteTopButton(btn.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
                            title="Delete button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Top Button Form */}
                  <div className="p-3.5 bg-slate-900/90 border border-purple-500/30 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-purple-300">Add New Header Button:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Button Title (e.g., JOIN VIP CHANNEL)"
                        value={newBtnTitle}
                        onChange={(e) => setNewBtnTitle(e.target.value)}
                        className="px-3 py-2 bg-black border border-slate-700 rounded-lg text-white"
                      />
                      <input
                        type="url"
                        placeholder="Link URL (e.g., https://t.me/...)"
                        value={newBtnUrl}
                        onChange={(e) => setNewBtnUrl(e.target.value)}
                        className="px-3 py-2 bg-black border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTopButton}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Button to Header</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: FAMPAY UPI GATEWAY CONFIG */}
              {activeTab === 'fampay' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">FamPay Gateway & Webhook URL Configuration</h3>
                    <p className="text-xs text-slate-400">
                      Configure your FamPay merchant UPI ID, limits, and the automatic email payment check backend link.
                    </p>
                  </div>

                  <div className="space-y-3 bg-slate-900/60 p-4 border border-slate-800 rounded-xl text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        FamPay Official UPI ID:
                      </label>
                      <input
                        type="text"
                        value={localSettings.fampayUpiId}
                        onChange={(e) => setLocalSettings({ ...localSettings, fampayUpiId: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Online Auto Email Payment Check Link (Backend URL):
                      </label>
                      <input
                        type="url"
                        value={localSettings.fampayWebhookUrl}
                        onChange={(e) => setLocalSettings({ ...localSettings, fampayWebhookUrl: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Provided: <code className="text-cyan-400">https://codex-as07.onrender.com</code>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Min Amount (₹):
                        </label>
                        <input
                          type="number"
                          value={localSettings.minAmount}
                          onChange={(e) => setLocalSettings({ ...localSettings, minAmount: parseInt(e.target.value, 10) || 10 })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Max Amount (₹):
                        </label>
                        <input
                          type="number"
                          value={localSettings.maxAmount}
                          onChange={(e) => setLocalSettings({ ...localSettings, maxAmount: parseInt(e.target.value, 10) || 50000 })}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        QR Code Expiry Window (Minutes):
                      </label>
                      <input
                        type="number"
                        value={localSettings.orderTimeoutMinutes}
                        onChange={(e) => setLocalSettings({ ...localSettings, orderTimeoutMinutes: parseInt(e.target.value, 10) || 15 })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveSettings({
                        fampayUpiId: localSettings.fampayUpiId,
                        fampayWebhookUrl: localSettings.fampayWebhookUrl,
                        minAmount: localSettings.minAmount,
                        maxAmount: localSettings.maxAmount,
                        orderTimeoutMinutes: localSettings.orderTimeoutMinutes,
                      })}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update FamPay Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: ORDERS MONITOR */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-white">Payment Orders Monitor</h3>
                      <p className="text-xs text-slate-400">All FamPay orders created in the platform.</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
                      No payment orders yet. Test by clicking [FamPay Wallet] on top!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.map((ord) => (
                        <div
                          key={ord.orderId}
                          className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-pink-300">{ord.orderId}</span>
                              <span className="font-mono font-extrabold text-emerald-400">₹{ord.amount}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                ord.status === 'SUCCESS'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                  : ord.status === 'PENDING'
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                                  : 'bg-red-950/60 text-red-300'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              User: <strong className="text-white">{ord.userName}</strong> • {new Date(ord.createdAt).toLocaleTimeString()}
                              {ord.utr && <span className="ml-2 font-mono text-cyan-300">UTR: {ord.utr}</span>}
                            </div>
                          </div>

                          {ord.status === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => handleManualApproveOrder(ord.orderId)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                            >
                              Approve & Credit Balance
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
