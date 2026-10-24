import React from 'react';
import {
  Volume2,
  VolumeX,
  History,
  Sliders,
  Layers,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { AppSettings } from '../utils/theme';

interface HeaderBarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
  historyCount: number;
  onOpenSettings: () => void;
  onOpenApkGuide: () => void;
  isFloating: boolean;
  onToggleFloating: () => void;
  isDragHandle?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  settings,
  onUpdateSettings,
  showHistory,
  onToggleHistory,
  historyCount,
  onOpenSettings,
  onOpenApkGuide,
  isFloating,
  onToggleFloating,
  isDragHandle = false,
}) => {
  const t = translations[settings.language];

  const languages: Array<{ code: Language; flag: string }> = [
    { code: 'id', flag: '🇮🇩' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'zh', flag: '🇨🇳' },
    { code: 'ja', flag: '🇯🇵' },
    { code: 'ko', flag: '🇰🇷' },
  ];

  return (
    <header
      className={`flex items-center justify-between px-3 sm:px-5 py-2.5 bg-black/25 border-b border-white/10 text-neutral-200 select-none ${
        isDragHandle ? 'cursor-move' : ''
      }`}
    >
      {/* Brand & Specification */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-sm sm:text-base font-black tracking-wider text-white whitespace-nowrap">
              HIUKALI
            </h1>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 border border-white/15 text-amber-300">
              {settings.windowSize === 'custom'
                ? `${settings.customWidth}×${settings.customHeight}`
                : settings.windowSize === 'compact'
                ? '400×600'
                : settings.windowSize === 'mini'
                ? '320×480'
                : '800×800'}
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 tracking-wide uppercase truncate">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language selector chips */}
        <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-black/30 border border-white/10 text-xs">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => onUpdateSettings({ language: item.code })}
              title={`Switch language to ${item.code.toUpperCase()}`}
              className={`px-1.5 py-0.5 rounded text-xs transition-all cursor-pointer ${
                settings.language === item.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.flag}
            </button>
          ))}
        </div>

        {/* Floating Mode Toggle */}
        <button
          onClick={onToggleFloating}
          title={isFloating ? t.exitFloating : t.floatingMode}
          aria-label={t.floatingMode}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
            isFloating
              ? 'bg-amber-500/30 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 hover:bg-white/10 border-white/15 text-neutral-300 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isFloating ? 'Melayang' : 'Float'}</span>
        </button>

        {/* APK / Install Button */}
        <button
          onClick={onOpenApkGuide}
          title={t.installApk}
          aria-label={t.installApk}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">APK</span>
        </button>

        {/* Sound toggle button */}
        <button
          onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          title={settings.soundEnabled ? t.soundOff : t.soundOn}
          aria-label={t.sound}
          className={`p-1.5 sm:px-2 sm:py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
            settings.soundEnabled
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-black/30 border-white/10 text-neutral-500'
          }`}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>

        {/* History drawer toggle */}
        <button
          onClick={onToggleHistory}
          title={t.historyTitle}
          aria-label={t.history}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
            showHistory
              ? 'bg-blue-600 border-blue-400 text-white'
              : 'bg-white/5 hover:bg-white/10 border-white/15 text-neutral-300 hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          {historyCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-black">
              {historyCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title={t.settings}
          aria-label={t.settings}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline text-xs font-bold">{t.settings}</span>
        </button>
      </div>
    </header>
  );
};
