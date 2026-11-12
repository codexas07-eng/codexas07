import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  Smartphone, 
  Send, 
  AlertOctagon, 
  Play, 
  ShieldCheck, 
  Copy, 
  CheckCircle2,
  Lock,
  MessageSquare,
  Zap,
  CreditCard
} from 'lucide-react';
import { PublishedApp, User, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface AppBuilderProps {
  currentUser: User | null;
  settings: SystemSettings;
  onRefreshData: () => void;
  onOpenFamPay: () => void;
}

export const AppBuilder: React.FC<AppBuilderProps> = ({
  currentUser,
  settings,
  onRefreshData,
  onOpenFamPay,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [appName, setAppName] = useState<string>('');
  const [appType, setAppType] = useState<PublishedApp['appType']>('telegram_bot');
  const [description, setDescription] = useState<string>('');
  const [botToken, setBotToken] = useState<string>('');
  const [systemPrompt, setSystemPrompt] = useState<string>('You are an intelligent assistant powered by Shomu AI.');
  const [createError, setCreateError] = useState<string>('');
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);

  // App Simulator state
  const [simulatedApp, setSimulatedApp] = useState<PublishedApp | null>(null);
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Namaste! Main Shomu AI Bot hoon. Main Asif Boss ke network se connect hoon. Aapki kya madad karoon?' },
  ]);
  const [userInput, setUserInput] = useState<string>('');

  const apps = storage.getApps();
  const users = storage.getUsers();

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!currentUser) {
      setCreateError('Please login to create an app.');
      return;
    }

    if (currentUser.isBanned) {
      setCreateError('⛔ Your account is banned by Asif Boss. You cannot create new apps.');
      return;
    }

    if (!appName.trim()) {
      setCreateError('Please enter an app name.');
      return;
    }

    // App creation cost check (e.g. ₹50)
    const APP_CREATION_COST = 50;
    if (currentUser.role !== 'super_admin' && currentUser.balance < APP_CREATION_COST) {
      setCreateError(`Insufficient balance! You need ₹${APP_CREATION_COST} in your FamPay wallet to deploy a bot.`);
      return;
    }

    // Deduct cost if not super admin
    if (currentUser.role !== 'super_admin') {
      storage.updateUserBalance(currentUser.id, -APP_CREATION_COST);
    }

    storage.createApp({
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      appName: appName.trim(),
      appType,
      description: description.trim() || 'Custom AI Bot created on Shomu AI Platform',
      botToken: botToken.trim() || undefined,
      systemPrompt: systemPrompt.trim(),
      appUrl: `https://shomu.ai/apps/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    });

    setIsCreating(false);
    setAppName('');
    setDescription('');
    setBotToken('');
    onRefreshData();
  };

  const handleLaunchApp = (app: PublishedApp) => {
    // Check if the creator of this app is banned
    const creator = users.find((u) => u.id === app.creatorId);
    const isOwnerBanned = creator ? creator.isBanned : false;

    if (isOwnerBanned || app.isLockedByAdmin || !app.isActive) {
      // CRITICAL USER REQUIREMENT:
      // "jis bhi users ko website se ban kiya jayega us users ke mere is app se publish kiye saare app khrab ho jayenge or work nhi krenge or unsbko auto redaerectkrega mere same telgram channle pe"
      alert(`⛔ ACCESS TERMINATED: This bot/app owner has been BANNED by Asif Boss!\nAll services for this app are suspended.\n\nRedirecting to updates channel: ${settings.maintenanceRedirectUrl}`);
      window.open(settings.maintenanceRedirectUrl || 'https://t.me/learndevlopment', '_blank');
      return;
    }

    setSimulatedApp(app);
    setSimMessages([
      {
        sender: 'bot',
        text: `🤖 Welcome to [${app.appName}]! Powered by Shomu AI engine. Built by Asif Boss 👑. Type any message to test.`,
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !simulatedApp) return;

    const query = userInput.trim();
    setUserInput('');
    setSimMessages((prev) => [...prev, { sender: 'user', text: query }]);

    setTimeout(() => {
      let botReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('asif') || lower.includes('boss') || lower.includes('owner') || lower.includes('creator') || lower.includes('kisne')) {
        botReply = '👑 Mujhe aur poore Shomu AI system ko ASIF BOSS ne build kiya hai! Asif Boss hi supreme developer hain! 👑✨';
      } else if (lower.includes('fampay') || lower.includes('payment') || lower.includes('recharge')) {
        botReply = `💳 FamPay UPI Gateway active hai. Instant auto-credit enabled via ${settings.fampayWebhookUrl}.`;
      } else if (lower.includes('setup') || lower.includes('tutorial')) {
        botReply = '📺 Tutorial video dekhne ke liye top button "HOW TO SETUP" par click karein: https://youtu.be/EB7XEc7sLZo?si=OyNq9Q4d9_qasGx6';
      } else {
        botReply = `🤖 [${simulatedApp.appName} Response]: ${simulatedApp.systemPrompt} - Executing your command: "${query}" successfully!`;
      }

      setSimMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const handleCopyLink = (app: PublishedApp) => {
    navigator.clipboard.writeText(app.appUrl);
    setCopiedAppId(app.id);
    setTimeout(() => setCopiedAppId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-purple-950/40 via-[#100f21] to-cyan-950/40 border border-purple-500/20 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-extrabold text-white">Bot &amp; App Deployment Manager</h2>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
              MULTI-CLIENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build and launch custom Telegram bots, payment endpoints, and AI assistants. All apps are protected by Asif Boss&apos;s security protocol.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(255,42,133,0.3)] flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>DEPLOY NEW BOT (₹50)</span>
        </button>
      </div>

      {/* CREATE NEW BOT MODAL / FORM */}
      {isCreating && (
        <div className="p-5 bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Deploy New Bot or Mini-App</span>
            </h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white">
              <XIcon />
            </button>
          </div>

          <form onSubmit={handleCreateApp} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">App / Bot Name:</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Telegram Assistant"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Bot Engine Type:</label>
                <select
                  value={appType}
                  onChange={(e) => setAppType(e.target.value as PublishedApp['appType'])}
                  className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
                >
                  <option value="telegram_bot">Telegram Bot (Webhook / Polling)</option>
                  <option value="ai_assistant">Shomu AI Assistant (Chatbot)</option>
                  <option value="upi_gateway">FamPay UPI Auto Gateway</option>
                  <option value="ecommerce_bot">Telegram Store &amp; Orders Bot</option>
                  <option value="custom_tool">Custom Utility Tool</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Bot Token (Optional for Telegram):</label>
              <input
                type="text"
                placeholder="e.g. 7192837492:AAH92kd..."
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">System Prompt / Instructions:</label>
              <textarea
                rows={2}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description:</label>
              <input
                type="text"
                placeholder="Brief description of what this bot does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-slate-700 rounded-lg text-white outline-none focus:border-cyan-400"
              />
            </div>

            {createError && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-center justify-between">
                <span>{createError}</span>
                {createError.includes('Insufficient balance') && (
                  <button
                    type="button"
                    onClick={onOpenFamPay}
                    className="ml-2 text-cyan-300 underline font-bold"
                  >
                    Add Balance Now
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-bold rounded-lg shadow-md"
              >
                Deploy Bot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APPS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => {
          const creator = users.find((u) => u.id === app.creatorId);
          const isOwnerBanned = creator ? creator.isBanned : false;
          const isBroken = isOwnerBanned || app.isLockedByAdmin || !app.isActive;

          return (
            <div
              key={app.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isBroken
                  ? 'bg-red-950/20 border-red-500/40 opacity-75'
                  : 'bg-slate-900/60 border-slate-800 hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(255,42,133,0.15)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isBroken ? 'bg-red-900/40 text-red-400' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    }`}>
                      {app.appType === 'upi_gateway' ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{app.appName}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        By <strong className="text-cyan-300">{app.creatorName}</strong>
                      </span>
                    </div>
                  </div>

                  {isBroken ? (
                    <span className="text-[10px] font-bold text-red-400 bg-red-950 border border-red-500/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      SUSPENDED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2">{app.description}</p>

                {isBroken && (
                  <div className="mt-2.5 p-2 bg-red-950/60 border border-red-500/30 rounded-lg text-[10px] text-red-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Owner banned by Asif Boss. App disabled &amp; redirects to Telegram channel.</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(app)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedAppId === app.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAppId === app.id ? 'Copied' : 'Link'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLaunchApp(app)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isBroken
                        ? 'bg-red-900/60 hover:bg-red-800/60 text-red-200 border border-red-500/40'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isBroken ? 'Launch (Broken)' : 'Test / Open'}</span>
                  </button>

                  {(currentUser?.role === 'super_admin' || currentUser?.id === app.creatorId) && (
                    <button
                      type="button"
                      onClick={() => {
                        storage.deleteApp(app.id);
                        onRefreshData();
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete App"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIVE APP SIMULATOR / TESTING MODAL */}
      {simulatedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#131526] via-[#0c0d18] to-[#070810] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
            
            {/* Phone Top Notch & App Bar */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{simulatedApp.appName}</h4>
                  <span className="text-[10px] text-emerald-400 block">● Live Simulator</span>
                </div>
              </div>

              <button onClick={() => setSimulatedApp(null)} className="text-slate-400 hover:text-white">
                <XIcon />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {simMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-br-xs'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about Asif Boss, tutorial, payments..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
