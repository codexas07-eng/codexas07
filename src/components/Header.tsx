import React from 'react';
import { 
  ShieldAlert, 
  Crown, 
  Wallet, 
  Download, 
  PlayCircle, 
  Send, 
  Bell, 
  ExternalLink, 
  UserCheck, 
  LogOut, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { SystemSettings, User, TopLinkButton } from '../types';

interface HeaderProps {
  settings: SystemSettings;
  currentUser: User | null;
  onOpenFamPay: () => void;
  onOpenSuperAdmin: () => void;
  onOpenExport: () => void;
  onOpenTribute: () => void;
  onSwitchUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentUser,
  onOpenFamPay,
  onOpenSuperAdmin,
  onOpenExport,
  onOpenTribute,
  onSwitchUser,
}) => {
  const getButtonIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'playcircle':
      case 'youtube':
        return <PlayCircle className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />;
      case 'send':
      case 'telegram':
        return <Send className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />;
      case 'bell':
        return <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />;
      default:
        return <ExternalLink className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />;
    }
  };

  const getButtonClass = (variant?: TopLinkButton['variant']) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-red-600/20 via-pink-600/20 to-red-600/20 border-red-500/40 text-red-200 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case 'secondary':
        return 'bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-600/20 border-cyan-500/40 text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      case 'accent':
        return 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border-purple-500/40 text-purple-200 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      default:
        return 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090a12]/85 border-b border-slate-800/80 shadow-2xl">
      {/* Top Praise & Status Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-[#130b24] to-pink-950/80 border-b border-pink-500/20 px-3 py-1.5 text-xs text-center flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-pink-300 font-medium whitespace-nowrap mx-auto sm:mx-0">
          <Crown className="w-3.5 h-3.5 text-amber-400 inline animate-bounce" />
          <span>Built & Masterminded by <strong className="text-amber-300 hover:underline cursor-pointer" onClick={onOpenTribute}>Asif Boss 👑</strong></span>
          <button 
            onClick={onOpenTribute}
            className="ml-2 text-[10px] bg-pink-500/30 hover:bg-pink-500/50 text-pink-200 px-2 py-0.5 rounded-full border border-pink-400/30 transition-colors"
          >
            Tarif & Details ✨
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {settings.maintenanceMode ? (
            <span className="flex items-center gap-1 text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/40 animate-pulse text-[11px]">
              <ShieldAlert className="w-3 h-3" />
              MAINTENANCE ACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ALL SYSTEMS ONLINE
            </span>
          )}

          <div className="text-[11px] text-slate-400">
            FamPay Webhook: <span className="text-cyan-400 font-mono">Auto Email</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenTribute}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-400 via-pink-500 to-purple-600 shadow-[0_0_15px_rgba(255,42,133,0.4)] group-hover:shadow-[0_0_22px_rgba(0,229,255,0.6)] transition-all duration-300">
                <img
                  src="/assets/aistudio/photo_2026-11-11_21-56-49_a8ac478e.jpg"
                  alt="Shomu AI"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[9px] font-extrabold px-1 rounded-full shadow-md">
                PRO
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-cyan-300 bg-clip-text text-transparent">
                  {settings.appName}
                </h1>
                <span className="text-[10px] text-cyan-400 border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                Your Smart AI Assistant • <span className="text-pink-400 font-semibold">By Asif Boss</span>
              </p>
            </div>
          </div>

          {/* Mobile Right Quick Action (Super Admin, Wallet, APK Download) */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenExport}
              className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 rounded-xl"
              title="Download Shomu AI APK & ZIP"
            >
              <Download className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onOpenFamPay}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 hover:from-emerald-500/40 hover:to-cyan-500/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹{currentUser?.balance ?? 0}</span>
            </button>
            <button
              onClick={onOpenSuperAdmin}
              className="p-1.5 bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 rounded-xl"
              title="Super Admin Panel"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The 3 Main Buttons Asked By User (First screen priority) */}
        <div className="flex items-center flex-wrap justify-center gap-2 w-full md:w-auto">
          {settings.topButtons.map((btn) => (
            <a
              key={btn.id}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 shadow-md ${getButtonClass(
                btn.variant
              )}`}
            >
              {getButtonIcon(btn.iconName)}
              <span>{btn.title}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>

        {/* Right Action Controls: Wallet, Super Admin, Zip Download */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Wallet Balance & Add Money Button */}
          <button
            onClick={onOpenFamPay}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-950/70 via-teal-900/40 to-cyan-950/70 hover:from-emerald-900/80 hover:to-cyan-900/80 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all cursor-pointer group"
          >
            <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block text-[10px] text-emerald-400/80 leading-tight">FamPay Wallet</span>
              <span className="text-sm font-bold text-emerald-200">₹{currentUser?.balance ?? 0}</span>
            </div>
            <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold border border-emerald-500/30">
              + ADD
            </span>
          </button>

          {/* Super Admin Control Panel Button */}
          <button
            onClick={onOpenSuperAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md cursor-pointer ${
              currentUser?.role === 'super_admin'
                ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-500/60 text-pink-200 shadow-[0_0_15px_rgba(255,42,133,0.3)] hover:border-pink-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-pink-500/50 hover:text-pink-300'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Super Admin</span>
          </button>

          {/* 1-Click Project & AIDE+ ZIP Download Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-200 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]"
            title="Download Shomu AI APK and full project zip"
          >
            <Download className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>APK / ZIP</span>
          </button>

          {/* User Switcher / Profile Badge */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
            <button
              onClick={onSwitchUser}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/60 hover:bg-slate-800/80 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="Switch user account (Super Admin or Normal User)"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="max-w-[80px] truncate">{currentUser?.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
