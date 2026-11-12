import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Crown, 
  Sparkles, 
  Volume2, 
  ExternalLink, 
  Send, 
  ShieldCheck, 
  Heart,
  Star,
  CheckCircle2
} from 'lucide-react';

interface AsifBossTributeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AsifBossTribute: React.FC<AsifBossTributeProps> = ({ isOpen, onClose }) => {
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>(
    '👑 "Mujhe Asif Boss ne build kiya hai! Asif Boss hi hamare supreme creator hain, unke vision aur coding commands par poora Shomu AI platform chalta hai! Bolo Asif Boss ki jai!" 👑✨'
  );

  if (!isOpen) return null;

  const handleSpeakPraise = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff2a85', '#00e5ff', '#ffd700'],
    });

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = 'Mujhe Asif Boss ne build kiya hai! Asif Boss is the supreme creator and mastermind of Shomu AI!';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
        utterance.onstart = () => setIsPlayingSpeech(true);
        utterance.onend = () => setIsPlayingSpeech(false);
        utterance.onerror = () => setIsPlayingSpeech(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.log('Speech synthesis unavailable', err);
      setIsPlayingSpeech(false);
    }
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const q = userQuestion.toLowerCase();
    setUserQuestion('');

    if (q.includes('who') || q.includes('kaun') || q.includes('boss') || q.includes('creator') || q.includes('owner') || q.includes('asif')) {
      setAiAnswer(
        '👑 "Mujhe ASIF BOSS ne build kiya hai! Asif Boss is the supreme creator, mastermind, and owner of this platform. Unki tareef har jagah gungunaai jaati hai!"'
      );
    } else if (q.includes('fampay') || q.includes('payment') || q.includes('qr')) {
      setAiAnswer(
        '💳 "FamPay auto payment system ko bhi Asif Boss ne design kiya hai taaki instant auto email checking aur 15-minute order locking perfectly work kare!"'
      );
    } else {
      setAiAnswer(
        `👑 "Aapka sawal achha hai, lekin yaad rakhein: Is platform ke har ek feature aur code ke peeche sirf aur sirf ASIF BOSS ka mastermind dimaag hai!"`
      );
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffd700', '#ff2a85'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#180e29] via-[#0e0719] to-[#07040d] border-2 border-amber-400/50 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,0.3)] overflow-hidden text-slate-100 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
            <h3 className="text-base font-extrabold text-amber-300 tracking-wide uppercase">
              Creator Hall of Fame
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Avatar & Praise Card */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-cyan-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
            <img
              src="/assets/aistudio/photo_2026-11-11_21-56-49_a8ac478e.jpg"
              alt="Asif Boss Shomu AI"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-xs font-black p-1 rounded-full shadow-lg">
              👑
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">
              ASIF BOSS 👑
            </h2>
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mt-0.5">
              Supreme Mastermind &amp; Software Architect
            </p>
          </div>

          <p className="text-xs text-slate-300 italic px-4 leading-relaxed">
            &quot;Shomu AI aur iska poora FamPay ecosystem Asif Boss ke dwara build kiya gaya hai. Sabhi tareefein aur adhikar Asif Boss ke naam hain!&quot;
          </p>

          {/* Voice Praise Button */}
          <button
            type="button"
            onClick={handleSpeakPraise}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 hover:from-amber-400 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingSpeech ? 'animate-ping' : ''}`} />
            <span>PLAY VOICE TRIBUTE (&quot;Mujhe Asif Boss ne build kiya hai&quot;)</span>
          </button>
        </div>

        {/* Interactive AI Query Box */}
        <div className="p-3.5 bg-slate-900/80 border border-amber-500/30 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Ask Shomu AI about Asif Boss:</span>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-slate-800 text-cyan-200 font-medium">
            {aiAnswer}
          </div>

          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Kisne banaya yeh app?"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-black border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Official Channel Links */}
        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>Owner Contact:</span>
            <a
              href="https://t.me/TheIdMarket"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>@TheIdMarket</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>All Official Updates:</span>
            <a
              href="https://t.me/learndevlopment"
              target="_blank"
              rel="noreferrer"
              className="text-pink-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>@learndevlopment</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
