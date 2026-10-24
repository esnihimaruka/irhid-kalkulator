import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const shortcuts = [
    { key: '0 – 9', desc: lang === 'id' ? 'Memasukkan angka' : 'Number input' },
    { key: '+  −  *  /', desc: lang === 'id' ? 'Operasi Aritmatika' : 'Arithmetic Operations' },
    { key: 'Enter / =', desc: lang === 'id' ? 'Hitung Hasil (=)' : 'Calculate Result (=)' },
    { key: 'Backspace', desc: lang === 'id' ? 'Hapus satu digit terakhir' : 'Delete last digit' },
    { key: 'Esc / C', desc: lang === 'id' ? 'Reset / Bersihkan Semua (AC)' : 'All Clear (AC)' },
    { key: '.  ,', desc: lang === 'id' ? 'Titik desimal' : 'Decimal point' },
    { key: '%', desc: lang === 'id' ? 'Persentase' : 'Percentage' },
    { key: 'M', desc: lang === 'id' ? 'Panggil nilai memori (MR)' : 'Memory recall (MR)' },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 rounded-3xl select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#222731] border-2 border-neutral-600 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#2b313d] border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {t.shortcutsTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-5 space-y-2.5">
          <p className="text-xs text-neutral-300 mb-2">
            {t.shortcutsDesc}
          </p>
          <div className="space-y-1.5">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-xs"
              >
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-600 text-amber-300 font-mono font-black text-xs shadow-sm">
                  {item.key}
                </kbd>
                <span className="font-medium text-neutral-300 text-right">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1b2029] border-t border-neutral-700/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all"
          >
            {t.understand}
          </button>
        </div>
      </div>
    </div>
  );
};
