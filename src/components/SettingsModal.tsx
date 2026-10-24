import React, { useState } from 'react';
import {
  X,
  Palette,
  Maximize,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import {
  AppSettings,
  ChassisThemeKey,
  ButtonPaletteKey,
  WindowSizeKey,
  defaultSettings,
  defaultCategoryColors,
} from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onTriggerPip?: () => void;
  isPipSupported?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerPip,
  isPipSupported,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'colors' | 'size' | 'floating'>('colors');
  if (!isOpen) return null;

  const t = translations[settings.language];

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  ];

  const chassisOptions: Array<{ key: ChassisThemeKey; label: string; hex: string }> = [
    { key: 'grey', label: t.chassisGrey, hex: '#2b303c' },
    { key: 'dark', label: t.chassisDark, hex: '#18181b' },
    { key: 'slate', label: t.chassisSlate, hex: '#1e293b' },
    { key: 'titanium', label: t.chassisTitanium, hex: '#475569' },
    { key: 'light', label: t.chassisLight, hex: '#e2e8f0' },
  ];

  const buttonPalettes: Array<{ key: ButtonPaletteKey; label: string; preview: string[] }> = [
    { key: 'rainbow', label: t.paletteRainbow, preview: ['#e11d48', '#84cc16', '#2563eb', '#f59e0b', '#a855f7'] },
    { key: 'neon', label: t.paletteNeon, preview: ['#00f2fe', '#a3e635', '#f472b6', '#a855f7', '#38bdf8'] },
    { key: 'pastel', label: t.palettePastel, preview: ['#fda4af', '#d9f99d', '#bfdbfe', '#fef08a', '#e9d5ff'] },
    { key: 'retro', label: t.paletteRetro, preview: ['#e5e5e5', '#ea580c', '#166534', '#b91c1c', '#713f12'] },
    { key: 'monochrome', label: t.paletteMonochrome, preview: ['#18181b', '#27272a', '#52525b', '#eab308', '#ef4444'] },
    { key: 'custom', label: t.customButtonColors, preview: [settings.customCategoryColors.numbers, settings.customCategoryColors.operators, settings.customCategoryColors.actions] },
  ];

  const sizePresets: Array<{ key: WindowSizeKey; label: string; desc: string; w: number; h: number }> = [
    { key: 'classic', label: t.classicSize, desc: '800 × 800 px (Standar Utama)', w: 800, h: 800 },
    { key: 'compact', label: t.compactSize, desc: '400 × 600 px (Mudah untuk multitasking)', w: 400, h: 600 },
    { key: 'mini', label: t.miniSize, desc: '320 × 480 px (Sangat ringkas melayang)', w: 320, h: 480 },
    { key: 'responsive', label: t.fullResponsive, desc: 'Mengisi layar secara otomatis', w: 800, h: 800 },
    { key: 'custom', label: t.custom, desc: 'Tentukan lebar & tinggi bebas', w: settings.customWidth, h: settings.customHeight },
  ];

  const handleResetDefaults = () => {
    onUpdateSettings({
      chassisTheme: defaultSettings.chassisTheme,
      customChassisColor: defaultSettings.customChassisColor,
      buttonPalette: defaultSettings.buttonPalette,
      customCategoryColors: defaultCategoryColors,
      windowSize: defaultSettings.windowSize,
      customWidth: defaultSettings.customWidth,
      customHeight: defaultSettings.customHeight,
      opacity: 1.0,
      soundEnabled: true,
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-xl bg-[#1e232b] border-2 border-neutral-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#262c37] border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                {t.settingsTitle}
              </h2>
              <p className="text-[11px] font-bold text-neutral-400">
                Warna Kustom · Mode Melayang · Multi-Bahasa
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

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-700/80 bg-[#191d24] px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'colors'
                ? 'bg-[#1e232b] text-white border-t-2 border-x border-neutral-700 border-b-transparent'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>{t.themes}</span>
          </button>

          <button
            onClick={() => setActiveTab('floating')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'floating'
                ? 'bg-[#1e232b] text-white border-t-2 border-x border-neutral-700 border-b-transparent'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.floatingMode}</span>
          </button>

          <button
            onClick={() => setActiveTab('size')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'size'
                ? 'bg-[#1e232b] text-white border-t-2 border-x border-neutral-700 border-b-transparent'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Maximize className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.windowSize}</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[#1e232b] text-white border-t-2 border-x border-neutral-700 border-b-transparent'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.language}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: COLOR CUSTOMIZATION */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Chassis Theme */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-neutral-300 flex items-center justify-between">
                  <span>{t.chassisColor}</span>
                  <span className="text-[10px] text-neutral-400 lowercase font-normal">
                    (bodi kalkulator utama)
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {chassisOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => onUpdateSettings({ chassisTheme: opt.key })}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.chassisTheme === opt.key
                          ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/40 text-white'
                          : 'border-neutral-700/80 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-lg border border-neutral-500 flex-shrink-0 shadow-inner"
                        style={{ backgroundColor: opt.hex }}
                      />
                      <span className="text-xs font-bold truncate">{opt.label}</span>
                    </button>
                  ))}

                  {/* Custom Hex Color for Chassis */}
                  <div
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                      settings.chassisTheme === 'custom'
                        ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/40 text-white'
                        : 'border-neutral-700/80 bg-neutral-900/60 text-neutral-300'
                    }`}
                  >
                    <input
                      type="color"
                      value={settings.customChassisColor}
                      onChange={(e) =>
                        onUpdateSettings({
                          chassisTheme: 'custom',
                          customChassisColor: e.target.value,
                        })
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[11px] font-bold">{t.chassisCustom}</div>
                      <input
                        type="text"
                        value={settings.customChassisColor}
                        onChange={(e) =>
                          onUpdateSettings({
                            chassisTheme: 'custom',
                            customChassisColor: e.target.value,
                          })
                        }
                        className="w-full text-[10px] font-mono bg-neutral-950 px-1 py-0.5 rounded border border-neutral-700 text-neutral-300 uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Color Palette */}
              <div className="space-y-3 pt-3 border-t border-neutral-700/80">
                <label className="text-xs font-black uppercase text-neutral-300 flex items-center justify-between">
                  <span>{t.buttonPalette}</span>
                  <span className="text-[10px] text-neutral-400 lowercase font-normal">
                    (kontras tinggi otomatis)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {buttonPalettes.map((pal) => (
                    <button
                      key={pal.key}
                      onClick={() => onUpdateSettings({ buttonPalette: pal.key })}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.buttonPalette === pal.key
                          ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/40 text-white'
                          : 'border-neutral-700/80 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-xs font-bold">{pal.label}</span>
                      <div className="flex items-center gap-1">
                        {pal.preview.map((hex, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Category Colors (if custom chosen or to edit) */}
              {settings.buttonPalette === 'custom' && (
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white uppercase">
                      {t.customButtonColors}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateSettings({ customCategoryColors: defaultCategoryColors })
                      }
                      className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                    >
                      Reset Warna Tombol
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Numbers */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-800">
                      <span>{t.numbersColor}</span>
                      <input
                        type="color"
                        value={settings.customCategoryColors.numbers}
                        onChange={(e) =>
                          onUpdateSettings({
                            customCategoryColors: {
                              ...settings.customCategoryColors,
                              numbers: e.target.value,
                            },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    {/* Operators */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-800">
                      <span>{t.operatorsColor}</span>
                      <input
                        type="color"
                        value={settings.customCategoryColors.operators}
                        onChange={(e) =>
                          onUpdateSettings({
                            customCategoryColors: {
                              ...settings.customCategoryColors,
                              operators: e.target.value,
                            },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-800">
                      <span>{t.actionsColor}</span>
                      <input
                        type="color"
                        value={settings.customCategoryColors.actions}
                        onChange={(e) =>
                          onUpdateSettings({
                            customCategoryColors: {
                              ...settings.customCategoryColors,
                              actions: e.target.value,
                            },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    {/* Memory */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-800">
                      <span>{t.memoryColor}</span>
                      <input
                        type="color"
                        value={settings.customCategoryColors.memory}
                        onChange={(e) =>
                          onUpdateSettings({
                            customCategoryColors: {
                              ...settings.customCategoryColors,
                              memory: e.target.value,
                            },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>

                    {/* Equals */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-800 col-span-2">
                      <span>{t.equalsColor}</span>
                      <input
                        type="color"
                        value={settings.customCategoryColors.equals}
                        onChange={(e) =>
                          onUpdateSettings({
                            customCategoryColors: {
                              ...settings.customCategoryColors,
                              equals: e.target.value,
                            },
                          })
                        }
                        className="w-6 h-6 rounded cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FLOATING MODE & OPACITY */}
          {activeTab === 'floating' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">
                    {t.floatingMode}
                  </h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {t.floatingModeDesc}. Anda dapat menggeser (drag) kalkulator, mengecilkan ukurannya, dan mengatur transparansi agar tulisan di bawahnya tetap terlihat.
                </p>
              </div>

              {/* Floating Mode Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <div>
                  <div className="text-sm font-bold text-white">
                    Aktifkan Mode Melayang (Draggable Widget)
                  </div>
                  <div className="text-xs text-neutral-400">
                    Bisa digeser ke mana saja di layar
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ isFloating: !settings.isFloating })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.isFloating ? 'bg-amber-500' : 'bg-neutral-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.isFloating ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-neutral-800/80 border border-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.opacity}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {Math.round(settings.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={settings.opacity}
                  onChange={(e) => onUpdateSettings({ opacity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Transparan (40%)</span>
                  <span>Solid Penuh (100%)</span>
                </div>
              </div>

              {/* Real OS PiP (Picture in Picture) if supported */}
              {isPipSupported && onTriggerPip && (
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-600/40 space-y-2">
                  <div className="text-xs font-bold text-blue-300">
                    Buka Sebagai Jendela Mandiri OS (Document PiP)
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Membuka kalkulator di jendela terpisah yang melayang di atas SEMUA aplikasi komputer Anda (termasuk Word, Excel, PowerPoint, dll).
                  </p>
                  <button
                    onClick={onTriggerPip}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                  >
                    {t.pipMode}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WINDOW SIZE */}
          {activeTab === 'size' && (
            <div className="space-y-5">
              <label className="text-xs font-black uppercase text-neutral-300">
                {t.presetSizes}
              </label>

              <div className="space-y-2">
                {sizePresets.map((preset) => (
                  <div
                    key={preset.key}
                    onClick={() => {
                      onUpdateSettings({
                        windowSize: preset.key,
                        customWidth: preset.w,
                        customHeight: preset.h,
                      });
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      settings.windowSize === preset.key
                        ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/40 text-white'
                        : 'border-neutral-700/80 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[11px] text-neutral-400">{preset.desc}</div>
                    </div>
                    {preset.key !== 'responsive' && (
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-neutral-950 border border-neutral-700 text-sky-400">
                        {preset.w} × {preset.h}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Size inputs */}
              {settings.windowSize === 'custom' && (
                <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-700 space-y-3">
                  <span className="text-xs font-black text-white uppercase">
                    {t.customSize}
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        {t.width} (px)
                      </label>
                      <input
                        type="number"
                        min="280"
                        max="1200"
                        value={settings.customWidth}
                        onChange={(e) =>
                          onUpdateSettings({ customWidth: parseInt(e.target.value) || 400 })
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-400 block mb-1">
                        {t.height} (px)
                      </label>
                      <input
                        type="number"
                        min="400"
                        max="1200"
                        value={settings.customHeight}
                        onChange={(e) =>
                          onUpdateSettings({ customHeight: parseInt(e.target.value) || 600 })
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LANGUAGE & SOUND */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-neutral-300">
                  {t.language}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => onUpdateSettings({ language: item.code })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.language === item.code
                          ? 'border-emerald-500 bg-neutral-800 ring-2 ring-emerald-500/40 text-white'
                          : 'border-neutral-700/80 bg-neutral-900/60 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-xl">{item.flag}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="space-y-3 pt-3 border-t border-neutral-700/80">
                <label className="text-xs font-black uppercase text-neutral-300">
                  {t.sound}
                </label>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-neutral-500" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {settings.soundEnabled ? t.soundOn : t.soundOff}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Web Audio Synthesis
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#181c22] border-t border-neutral-700 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetAll}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-md"
          >
            {t.save} / {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
