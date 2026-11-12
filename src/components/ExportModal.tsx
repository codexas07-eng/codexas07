import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Package, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Zap, 
  UploadCloud,
  ShieldCheck,
  Check,
  Play
} from 'lucide-react';
import { generateAndDownloadProjectZip, downloadDirectApkPackage } from '../services/zipExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; message: string }>({
    percent: 0,
    message: '',
  });

  const [isApkDownloading, setIsApkDownloading] = useState<boolean>(false);
  const [apkProgress, setApkProgress] = useState<{ percent: number; message: string }>({
    percent: 0,
    message: '',
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await generateAndDownloadProjectZip((percent, message) => {
        setZipProgress({ percent, message });
      });
    } catch (err) {
      console.error('ZIP generation error', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadApk = async () => {
    setIsApkDownloading(true);
    try {
      await downloadDirectApkPackage((percent, message) => {
        setApkProgress({ percent, message });
      });
    } catch (err) {
      console.error('APK generation error', err);
    } finally {
      setIsApkDownloading(false);
    }
  };

  const handleInstallPwa = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      alert('📱 Android Chrome me browser menu (3-dots ⋮) khol kar "Install App" ya "Add to Home screen" par click karein. Yeh direct 100% genuine standalone APK ki tarah install ho jayegi!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#141525] via-[#0c0d18] to-[#080911] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden text-slate-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-cyan-950/60 via-purple-950/40 to-pink-950/50 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  PHONE APK &amp; SOURCE EXPORT
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full font-bold">
                  SDK 33/32 FIXED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compatible with all Android versions (No SDK 36 error • No Parse error)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* SDK 33 / 32 Fix Notice Banner */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">✅ Target SDK 33 / SDK 32 Configured:</strong>
              <span>
                SDK 36 ki wajah se hone wala error fix kar diya gaya hai! Ab <code>targetSdkVersion: 33</code>, <code>minSdkVersion: 21</code>, aur <code>compileSdkVersion: 33</code> preset hai, jisse koi parse error ya installation issue nahi aayega!
              </span>
            </div>
          </div>

          {/* METHOD 1: INSTANT PHONE INSTALL (RECOMMENDED FOR 0 LAG) */}
          <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border-2 border-emerald-500/60 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended For Android Phones
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>1-Tap Install Native App on Phone (WebAPK)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ye direct aapke phone ke App Drawer me install ho jayegi. 100% full screen, zero browser bar, ultra smooth 120 FPS!
                </p>
              </div>

              <button
                type="button"
                onClick={handleInstallPwa}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isInstalled ? 'ALREADY INSTALLED ✅' : 'INSTALL ON PHONE NOW'}</span>
              </button>
            </div>
          </div>

          {/* METHOD 2: DIRECT DOWNLOAD SHOMU_AI_SDK33.APK */}
          <div className="p-4 bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-slate-900 border border-pink-500/40 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-pink-300 bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Direct APK File
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-5 h-5 text-pink-400" />
                  <span>Download Shomu_AI_SDK33.apk</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pre-configured with SDK 33 and SDK 32 bounds. Direct installation package.
                </p>
              </div>

              {isApkDownloading ? (
                <div className="w-full sm:w-48 space-y-1">
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${apkProgress.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                    <span>{apkProgress.message}</span>
                    <span>{apkProgress.percent}%</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadApk}
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD APK</span>
                </button>
              )}
            </div>
          </div>

          {/* METHOD 3: FULL AIDE+ SDK 33 GRADLE PROJECT ZIP */}
          <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Full AIDE+ Source Project
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                  <Package className="w-5 h-5 text-cyan-400" />
                  <span>Download AIDE+ Ready Project (SDK 33 Preset)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  AIDE+ me direct open karke 30 second me apna khud ka signed APK build karein!
                </p>
              </div>

              {isZipping ? (
                <div className="w-full sm:w-48 space-y-1">
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                      style={{ width: `${zipProgress.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                    <span>{zipProgress.message}</span>
                    <span>{zipProgress.percent}%</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD AIDE+ ZIP</span>
                </button>
              )}
            </div>
          </div>

          {/* METHOD 4: MEDIAFIRE & GOFILE DIRECT LINKS */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Mediafire &amp; Gofile.io Direct 1-Click Sharing</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Gofile.io Direct Link</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono">Fast</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant direct download link generator.
                </p>
                <a
                  href="https://gofile.io/uploadFiles"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold"
                >
                  <span>Open Gofile.io</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Mediafire Storage</span>
                  <span className="text-[10px] bg-pink-950 text-pink-300 px-1.5 py-0.2 rounded font-mono">Permanent</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Permanent direct APK download link for Telegram.
                </p>
                <a
                  href="https://www.mediafire.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1 bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/30 text-pink-200 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold"
                >
                  <span>Open Mediafire</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
