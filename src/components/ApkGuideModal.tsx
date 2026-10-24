import React from 'react';
import { X, Smartphone, Download, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { promptInstall } from '../utils/pwa';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  canInstallDirectly: boolean;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
  canInstallDirectly,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const handleDirectInstall = async () => {
    const success = await promptInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-lg bg-[#1f242d] border-2 border-neutral-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#282f3c] border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                {t.installApk}
              </h2>
              <p className="text-[11px] font-bold text-neutral-400">
                HIUKALI CALCULATOR · Android APK & PWA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-sm text-neutral-300">
          {/* Method 1: Instant 1-Click Install */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-600/50 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-black text-white text-sm">
                  {lang === 'id' ? 'Metode 1: Pasang Langsung (WebAPK Android)' : 'Method 1: Direct Android WebAPK Install'}
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Rekomendasi
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {lang === 'id'
                ? 'Di Android (Chrome/Edge/Samsung Internet), sistem akan secara otomatis mengompilasi aplikasi ini menjadi WebAPK mandiri dengan ikon aplikasi di beranda & drawer aplikasi Anda.'
                : 'On Android browsers (Chrome/Edge/Samsung Internet), the system automatically compiles this app into a standalone WebAPK with its own launcher icon on your home screen.'}
            </p>

            {canInstallDirectly ? (
              <button
                onClick={handleDirectInstall}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'id' ? 'Pasang Sekarang ke HP / Komputer' : 'Install Now to Device'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/40 px-3 py-2 rounded-xl border border-emerald-700/40">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>
                  {lang === 'id'
                    ? 'Buka menu browser Anda (titik 3 di kanan atas) lalu pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi".'
                    : 'Open browser menu (3 dots) and select "Add to Home Screen" or "Install App".'}
                </span>
              </div>
            )}
          </div>

          {/* Method 2: Package to Offline .APK */}
          <div className="p-4 rounded-2xl bg-[#282d37] border border-neutral-700 space-y-2.5">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-400" />
              <h3 className="font-black text-white text-sm">
                {lang === 'id' ? 'Metode 2: Unduh File Mentah .APK (Google Play / Sideload)' : 'Method 2: Standalone .APK Package (Play Store / Sideload)'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'id'
                ? 'Jika Anda ingin file fisik .apk untuk dipasang secara offline (sideload) atau diterbitkan ke Google Play Store, Anda bisa mengonversinya secara gratis menggunakan PWABuilder:'
                : 'If you want a physical .apk binary file to sideload offline or publish to the Google Play Store, you can package it with PWABuilder:'}
            </p>

            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sky-400 hover:text-sky-300 border border-neutral-600 text-xs font-bold transition-all"
            >
              <span>Buka PWABuilder (One-Click APK Generator)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Advantages */}
          <div className="space-y-1.5 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bisa dijalankan 100% tanpa koneksi internet (Offline Ready).</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bebas dari bilah navigasi browser saat dibuka dalam mode aplikasi.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mendukung mode melayang bersama aplikasi lain.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#181c22] border-t border-neutral-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
