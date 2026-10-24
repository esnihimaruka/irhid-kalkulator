import React, { useState } from 'react';
import { Copy, Check, Hash, CornerDownLeft } from 'lucide-react';
import { formatDisplayNumber } from '../utils/calculatorEngine';
import { Language, translations } from '../utils/i18n';

interface DisplayScreenProps {
  expression: string;
  currentInput: string;
  memoryValue: number;
  lang: Language;
  isCompact?: boolean;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  expression,
  currentInput,
  memoryValue,
  lang,
  isCompact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const formattedValue = formatDisplayNumber(currentInput);

  // Dynamic text size calculation to prevent overflowing
  const getTextSizeClass = (str: string) => {
    const len = str.length;
    if (isCompact) {
      if (len <= 7) return 'text-3xl';
      if (len <= 11) return 'text-2xl';
      return 'text-xl';
    }
    if (len <= 8) return 'text-4xl md:text-5xl';
    if (len <= 12) return 'text-3xl md:text-4xl';
    if (len <= 16) return 'text-2xl md:text-3xl';
    return 'text-xl md:text-2xl';
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(currentInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-[#0b0e14] border-2 border-white/10 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden select-none ${
        isCompact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      {/* Top row of display: Metadata, memory flag & expression */}
      <div className="flex items-center justify-between text-xs tracking-wider font-semibold text-neutral-400 mb-1 border-b border-white/5 pb-1.5">
        <div className="flex items-center gap-1.5">
          {memoryValue !== 0 && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-black text-[10px] tracking-widest animate-pulse">
              M: {formatDisplayNumber(memoryValue.toString())}
            </span>
          )}
          <span className="text-neutral-500 font-mono text-[11px] flex items-center gap-1">
            <Hash className="w-3 h-3 text-neutral-500" />
            HIUKALI
          </span>
        </div>

        {/* Expression line */}
        <div className="text-right text-neutral-400 font-mono font-bold text-xs sm:text-sm tracking-wide truncate max-w-[60%]">
          {expression ? (
            <span className="flex items-center justify-end gap-1">
              <span>{expression}</span>
              <CornerDownLeft className="w-3 h-3 inline text-neutral-500" />
            </span>
          ) : (
            <span className="text-neutral-600">{t.readyToCalculate}</span>
          )}
        </div>
      </div>

      {/* Main Number Display Area */}
      <div className="relative flex items-baseline justify-between mt-0.5 pt-1">
        {/* Quick copy button */}
        <button
          onClick={handleCopy}
          title={t.copy}
          aria-label={t.copy}
          className="group flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-[11px]">{t.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
              <span className="text-neutral-400 group-hover:text-white text-[11px]">{t.copy}</span>
            </>
          )}
        </button>

        {/* Large bold number */}
        <div className="w-full text-right overflow-x-auto whitespace-nowrap pl-2">
          <span
            className={`font-black font-mono tracking-tight text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)] ${getTextSizeClass(
              formattedValue
            )}`}
          >
            {formattedValue}
          </span>
        </div>
      </div>
    </div>
  );
};
