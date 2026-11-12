import React, { useEffect, useState } from 'react';
import { ShieldAlert, ExternalLink, Key, Crown } from 'lucide-react';
import { SystemSettings, User } from '../types';

interface MaintenanceOverlayProps {
  settings: SystemSettings;
  currentUser: User | null;
  onOpenSuperAdminLogin: () => void;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({
  settings,
  currentUser,
  onOpenSuperAdminLogin,
}) => {
  const [countdown, setCountdown] = useState<number>(10);

  // If maintenance is OFF, or user is Super Admin, DO NOT SHOW
  if (!settings.maintenanceMode || currentUser?.role === 'super_admin') {
    return null;
  }

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = settings.maintenanceRedirectUrl || 'https://t.me/learndevlopment';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.maintenanceRedirectUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0d1b] via-[#100713] to-[#0a050d] border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(239,68,68,0.4)] space-y-6">
        
        {/* Animated Warning Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 animate-ping"></span>
        </div>

        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase bg-red-950/70 border border-red-500/40 px-3 py-1 rounded-full">
            Online Expiry &amp; Maintenance Mode Active
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
            SERVER UNDER MAINTENANCE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
            {settings.maintenanceMessage}
          </p>
        </div>

        {/* Asif Boss badge */}
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-center justify-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Notice issued by <strong>Asif Boss 👑</strong> (Supreme Admin)</span>
        </div>

        {/* Countdown notice */}
        <div className="text-xs text-slate-400">
          Auto redirecting to official Telegram channel in{' '}
          <span className="text-xl font-bold font-mono text-cyan-400 mx-1">{countdown}s</span>
        </div>

        {/* Main Redirect Button */}
        <a
          href={settings.maintenanceRedirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
        >
          <span>JOIN TELEGRAM CHANNEL NOW</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Super Admin Override Link */}
        <div className="pt-2 border-t border-red-900/40 flex justify-center">
          <button
            onClick={onOpenSuperAdminLogin}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer opacity-80 hover:opacity-100"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Super Admin (Asif Boss) Login Override</span>
          </button>
        </div>
      </div>
    </div>
  );
};
