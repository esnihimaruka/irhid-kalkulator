import React from 'react';
import { HistoryItem } from '../utils/calculatorEngine';
import { Trash2, X, ArrowDownRight, Clock } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectResult: (result: string) => void;
  onClearHistory: () => void;
  lang: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="absolute inset-0 z-30 bg-[#161a22]/95 backdrop-blur-md flex flex-col rounded-3xl overflow-hidden border border-white/10 select-none animate-fadeIn">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-black tracking-wider text-white uppercase">
            {t.historyTitle}
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              title={t.clearHistory}
              aria-label={t.clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          )}

          <button
            onClick={onClose}
            title={t.close}
            aria-label={t.close}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 py-16">
            <Clock className="w-10 h-10 mb-2 opacity-40 text-neutral-400" />
            <p className="text-sm font-bold text-neutral-400">{t.noHistory}</p>
            <p className="text-xs text-neutral-500 mt-1 text-center px-4">
              {t.noHistoryDesc}
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/80 hover:bg-white/10 transition-all flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => onSelectResult(item.result)}
              title={t.historyTip}
            >
              <div className="overflow-hidden">
                <div className="text-xs font-mono font-semibold text-neutral-400 group-hover:text-neutral-300 truncate">
                  {item.expression}
                </div>
                <div className="text-xl font-mono font-black text-white group-hover:text-sky-300 tracking-tight mt-0.5">
                  = {item.result}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white/10 text-neutral-300 group-hover:bg-sky-600 group-hover:text-white transition-all flex-shrink-0">
                <span>{t.useResult}</span>
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-black/30 border-t border-white/10 text-center text-xs text-neutral-400 font-medium">
        {t.historyTip}
      </div>
    </div>
  );
};
