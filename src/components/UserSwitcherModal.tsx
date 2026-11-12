import React from 'react';
import { X, UserCheck, Crown, ShieldAlert, Check } from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const users = storage.getUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#141525] via-[#0c0d18] to-[#070810] border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Switch Active Account</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Switch between Super Admin and normal user accounts to test live maintenance lockout and ban enforcement.
        </p>

        <div className="space-y-2">
          {users.map((u) => {
            const isSelected = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  storage.setCurrentUser(u);
                  onSelectUser(u);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-pink-600/20 border-pink-500/60 shadow-[0_0_15px_rgba(255,42,133,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{u.name}</span>
                    {u.role === 'super_admin' && (
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Balance: <strong className="text-emerald-400 font-mono">₹{u.balance}</strong>
                    {u.isBanned && (
                      <span className="ml-2 text-red-400 font-bold">[BANNED]</span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-pink-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
