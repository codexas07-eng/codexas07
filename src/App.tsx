/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Wallet, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  QrCode, 
  PlayCircle, 
  Send, 
  Bell, 
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Smartphone,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { storage } from './services/storage';
import { User, SystemSettings, PaymentOrder } from './types';
import { Header } from './components/Header';
import { FamPayModal } from './components/FamPayModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { MaintenanceOverlay } from './components/MaintenanceOverlay';
import { AppBuilder } from './components/AppBuilder';
import { ExportModal } from './components/ExportModal';
import { AsifBossTribute } from './components/AsifBossTribute';
import { UserSwitcherModal } from './components/UserSwitcherModal';

export default function App() {
  const [settings, setSettings] = useState<SystemSettings>(() => storage.getSettings());
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [orders, setOrders] = useState<PaymentOrder[]>(() => storage.getOrders());

  // Modal open states
  const [isFamPayOpen, setIsFamPayOpen] = useState<boolean>(false);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isTributeOpen, setIsTributeOpen] = useState<boolean>(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState<boolean>(false);

  // Sync state across storage updates & BroadcastChannel
  const refreshAllData = () => {
    setSettings(storage.getSettings());
    setCurrentUser(storage.getCurrentUser());
    setOrders(storage.getOrders());
  };

  useEffect(() => {
    const handleStorageChange = () => {
      refreshAllData();
    };

    window.addEventListener('shomu_storage_change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('shomu_storage_change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#090a12] text-slate-100 flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-200">
      
      {/* 1. Header with dynamic top buttons & brand logo */}
      <Header
        settings={settings}
        currentUser={currentUser}
        onOpenFamPay={() => setIsFamPayOpen(true)}
        onOpenSuperAdmin={() => setIsSuperAdminOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTribute={() => setIsTributeOpen(true)}
        onSwitchUser={() => setIsUserSwitcherOpen(true)}
      />

      {/* 2. Fullscreen Maintenance Overlay when activated (Super Admin is immune) */}
      <MaintenanceOverlay
        settings={settings}
        currentUser={currentUser}
        onOpenSuperAdminLogin={() => setIsSuperAdminOpen(true)}
      />

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-8">
        
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#170e2b] via-[#100b20] to-[#0a0614] border border-pink-500/30 shadow-[0_0_50px_rgba(255,42,133,0.15)]">
          {/* Neon background ambient glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Engineered &amp; Masterminded by <strong>Asif Boss 👑</strong></span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-pink-200 to-cyan-300 bg-clip-text text-transparent">
                  Shomu AI Bot Platform
                </span>
                <span className="block text-xl sm:text-2xl font-bold text-slate-300 mt-1">
                  Automated FamPay Gateway &amp; App Studio
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                The all-in-one cyber platform powered by Asif Boss. Features automated 15-minute FamPay UPI order locking, real-time email verification, live super-admin command center, and instant bot deployment.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFamPayOpen(true)}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>ADD MONEY VIA FAMPAY (₹)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSuperAdminOpen(true)}
                  className="px-5 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(255,42,133,0.3)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>SUPER ADMIN PANEL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>DOWNLOAD APK &amp; PROJECT ZIP</span>
                </button>
              </div>
            </div>

            {/* Logo Mascot Visual with Cyber Ring */}
            <div className="relative shrink-0">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-pink-500 to-purple-600 shadow-[0_0_50px_rgba(255,42,133,0.4)] animate-pulse-subtle">
                <img
                  src="/assets/aistudio/photo_2026-11-11_21-56-49_a8ac478e.jpg"
                  alt="Shomu AI by Asif Boss"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Floating badges */}
              <div 
                onClick={() => setIsTributeOpen(true)}
                className="absolute -bottom-2 -left-2 bg-slate-900/90 border border-amber-400/50 rounded-2xl px-3 py-1.5 text-xs text-amber-300 font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Asif Boss 👑</span>
              </div>

              <div className="absolute -top-2 -right-2 bg-slate-900/90 border border-cyan-400/50 rounded-2xl px-3 py-1.5 text-xs text-cyan-300 font-bold shadow-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>FamPay Auto</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">FamPay UPI Gateway</span>
              <QrCode className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">15 Min Lock</div>
            <span className="text-[10px] text-cyan-400 font-semibold block mt-0.5">
              Auto UTR &amp; Webhook Ready
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">Maintenance Kill-Switch</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {settings.maintenanceMode ? 'ACTIVE (BLOCKING)' : 'ONLINE (ACCESSIBLE)'}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Super Admin Toggle
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">User Ban Security</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">Auto App Kill</div>
            <span className="text-[10px] text-amber-300 font-semibold block mt-0.5">
              Redirects to Telegram
            </span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs">APK &amp; Source Export</span>
              <Smartphone className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">AIDE+ Ready</div>
            <span className="text-[10px] text-pink-400 font-semibold block mt-0.5">
              1-Click Project ZIP
            </span>
          </div>
        </div>

        {/* 4. APP BUILDER & BOT DEPLOYMENT MANAGER */}
        <AppBuilder
          currentUser={currentUser}
          settings={settings}
          onRefreshData={refreshAllData}
          onOpenFamPay={() => setIsFamPayOpen(true)}
        />

        {/* 5. RECENT FAMPAY UPI ORDERS & RECHARGE HISTORY */}
        <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Recent FamPay Orders &amp; UPI Activity</span>
              </h3>
              <p className="text-xs text-slate-400">
                Connected to <strong className="text-cyan-300 font-mono">{settings.fampayWebhookUrl}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFamPayOpen(true)}
              className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Create New Order</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No recent payment orders. Click [Add Money Via FamPay] to test the 5-frame animation and dynamic UPI QR!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {orders.slice(0, 6).map((ord) => (
                <div
                  key={ord.orderId}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-pink-300">{ord.orderId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'SUCCESS'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : ord.status === 'PENDING'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                        : 'bg-red-950/60 text-red-300'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Recharge Amount:</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">
                      ₹{ord.amount}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>User: {ord.userName}</span>
                    <span>{new Date(ord.createdAt).toLocaleTimeString()}</span>
                  </div>

                  {ord.utr && (
                    <div className="text-[10px] text-cyan-300 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                      UTR: {ord.utr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 6. Footer with Praise to Asif Boss & Links */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#070810] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-white font-bold">
              <span>Shomu AI Platform</span>
              <span className="text-pink-400 font-normal">• Engineered by Asif Boss 👑</span>
            </div>
            <p className="text-[11px] text-slate-500">
              All rights, architectures, and features reserved for Asif Boss.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px]">
            <a
              href="https://youtu.be/EB7XEc7sLZo?si=OyNq9Q4d9_qasGx6"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              How to Setup
            </a>
            <span>•</span>
            <a
              href="https://t.me/TheIdMarket"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Contact Owner
            </a>
            <span>•</span>
            <a
              href="https://t.me/learndevlopment"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-pink-400 transition-colors"
            >
              All Updates
            </a>
            <span>•</span>
            <button
              onClick={() => setIsTributeOpen(true)}
              className="text-amber-400 hover:underline font-bold"
            >
              Asif Boss Tribute 👑
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <FamPayModal
        isOpen={isFamPayOpen}
        onClose={() => setIsFamPayOpen(false)}
        currentUser={currentUser}
        settings={settings}
        onBalanceUpdated={refreshAllData}
      />

      <SuperAdminModal
        isOpen={isSuperAdminOpen}
        onClose={() => setIsSuperAdminOpen(false)}
        currentUser={currentUser}
        settings={settings}
        onSettingsChanged={(newSt) => {
          setSettings(newSt);
          refreshAllData();
        }}
        onRefreshData={refreshAllData}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <AsifBossTribute
        isOpen={isTributeOpen}
        onClose={() => setIsTributeOpen(false)}
      />

      <UserSwitcherModal
        isOpen={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          refreshAllData();
        }}
      />
    </div>
  );
}
