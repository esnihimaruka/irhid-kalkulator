/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { DisplayScreen } from './components/DisplayScreen';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { SettingsModal } from './components/SettingsModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { CalculatorButtonConfig, getStyledButtons } from './utils/buttons';
import {
  CalculatorState,
  initialCalculatorState,
  performCalculation,
  getOperatorSymbol,
  HistoryItem,
} from './utils/calculatorEngine';
import { playTactileSound } from './utils/audio';
import {
  AppSettings,
  defaultSettings,
  getChassisStyle,
} from './utils/theme';
import { subscribeToInstallPrompt } from './utils/pwa';
import { translations } from './utils/i18n';
import {
  Maximize2,
  Minimize2,
  Move,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('hiukali_calculator_settings');
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return defaultSettings;
  });

  const [calcState, setCalcState] = useState<CalculatorState>(initialCalculatorState);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showApkGuide, setShowApkGuide] = useState<boolean>(false);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Floating window position state
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 40,
    initialY: 40,
  });

  const isPipSupported =
    typeof window !== 'undefined' && 'documentPictureInPicture' in window;

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('hiukali_calculator_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Subscribe to PWA installation capability
  useEffect(() => {
    const unsubscribe = subscribeToInstallPrompt((canInstall) => {
      setCanInstallPwa(canInstall);
    });
    return unsubscribe;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Compute buttons according to current theme/palette
  const styledButtons = getStyledButtons(
    settings.buttonPalette,
    settings.customCategoryColors
  );

  const t = translations[settings.language];

  // Button Click Handler
  const handleButtonClick = useCallback(
    (btn: CalculatorButtonConfig) => {
      playTactileSound(btn.soundType, settings.soundEnabled);

      setActiveKeyId(btn.id);
      setTimeout(() => setActiveKeyId(null), 120);

      setCalcState((prev) => {
        let {
          currentInput,
          previousValue,
          operator,
          waitingForSecondOperand,
          expression,
          memory,
          history,
        } = prev;

        if (currentInput === 'Error' || currentInput === t.calcError || currentInput === t.divByZeroError) {
          currentInput = '0';
          expression = '';
          previousValue = null;
          operator = null;
          waitingForSecondOperand = false;
        }

        switch (btn.value) {
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9': {
            if (waitingForSecondOperand) {
              return {
                ...prev,
                currentInput: btn.value,
                waitingForSecondOperand: false,
              };
            }
            const nextInput =
              currentInput === '0' ? btn.value : currentInput + btn.value;
            if (nextInput.replace(/[^0-9]/g, '').length > 16) {
              return prev;
            }
            return {
              ...prev,
              currentInput: nextInput,
            };
          }

          case '.': {
            if (waitingForSecondOperand) {
              return {
                ...prev,
                currentInput: '0.',
                waitingForSecondOperand: false,
              };
            }
            if (!currentInput.includes('.')) {
              return {
                ...prev,
                currentInput: currentInput + '.',
              };
            }
            return prev;
          }

          case 'AC': {
            return {
              ...prev,
              currentInput: '0',
              previousValue: null,
              operator: null,
              waitingForSecondOperand: false,
              expression: '',
            };
          }

          case 'BACKSPACE': {
            if (waitingForSecondOperand) return prev;
            if (
              currentInput.length <= 1 ||
              (currentInput.length === 2 && currentInput.startsWith('-'))
            ) {
              return {
                ...prev,
                currentInput: '0',
              };
            }
            return {
              ...prev,
              currentInput: currentInput.slice(0, -1),
            };
          }

          case 'NEGATE': {
            if (currentInput === '0') return prev;
            const negated = currentInput.startsWith('-')
              ? currentInput.slice(1)
              : '-' + currentInput;
            return {
              ...prev,
              currentInput: negated,
            };
          }

          case '%': {
            const num = parseFloat(currentInput);
            if (isNaN(num)) return prev;
            let result: number;
            if (previousValue !== null && operator) {
              result = (previousValue * num) / 100;
            } else {
              result = num / 100;
            }
            const formatted = result.toString();
            return {
              ...prev,
              currentInput: formatted,
              expression: `${currentInput}%`,
            };
          }

          case '+':
          case '-':
          case '*':
          case '/': {
            const currentNum = parseFloat(currentInput);

            if (previousValue === null) {
              return {
                ...prev,
                previousValue: currentNum,
                operator: btn.value,
                waitingForSecondOperand: true,
                expression: `${currentInput} ${getOperatorSymbol(btn.value)}`,
              };
            }

            if (waitingForSecondOperand) {
              return {
                ...prev,
                operator: btn.value,
                expression: `${previousValue} ${getOperatorSymbol(btn.value)}`,
              };
            }

            try {
              const result = performCalculation(previousValue, currentNum, operator!);
              const resStr = result.toString();

              return {
                ...prev,
                previousValue: result,
                currentInput: resStr,
                operator: btn.value,
                waitingForSecondOperand: true,
                expression: `${resStr} ${getOperatorSymbol(btn.value)}`,
              };
            } catch {
              return {
                ...prev,
                currentInput: t.calcError,
                previousValue: null,
                operator: null,
                waitingForSecondOperand: false,
                expression: t.calcError,
              };
            }
          }

          case '=': {
            if (previousValue === null || operator === null) {
              return prev;
            }

            const currentNum = parseFloat(currentInput);
            const opSymbol = getOperatorSymbol(operator);
            const fullExpr = `${previousValue} ${opSymbol} ${currentNum}`;

            try {
              const result = performCalculation(previousValue, currentNum, operator);
              const resultStr = result.toString();

              const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                expression: fullExpr,
                result: resultStr,
                timestamp: new Date(),
              };

              return {
                ...prev,
                currentInput: resultStr,
                previousValue: null,
                operator: null,
                waitingForSecondOperand: true,
                expression: `${fullExpr} =`,
                history: [newHistoryItem, ...history.slice(0, 49)],
              };
            } catch {
              return {
                ...prev,
                currentInput: t.divByZeroError,
                previousValue: null,
                operator: null,
                waitingForSecondOperand: false,
                expression: t.divByZeroError,
              };
            }
          }

          case 'MC': {
            return {
              ...prev,
              memory: 0,
            };
          }
          case 'MR': {
            return {
              ...prev,
              currentInput: memory.toString(),
              waitingForSecondOperand: false,
            };
          }
          case 'M+': {
            const val = parseFloat(currentInput) || 0;
            return {
              ...prev,
              memory: memory + val,
            };
          }
          case 'M-': {
            const val = parseFloat(currentInput) || 0;
            return {
              ...prev,
              memory: memory - val,
            };
          }

          default:
            return prev;
        }
      });
    },
    [settings.soundEnabled, t]
  );

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;
      const matchedBtn = styledButtons.find((btn) =>
        btn.keyboardKey?.includes(key)
      );

      if (matchedBtn) {
        e.preventDefault();
        handleButtonClick(matchedBtn);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButtonClick, styledButtons]);

  // Pointer drag events for floating window
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!settings.isFloating) return;
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: floatingPos.x,
      initialY: floatingPos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(10, Math.min(window.innerHeight - 200, dragStartRef.current.initialY + deltaY));
    setFloatingPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Trigger Document Picture-in-Picture if supported
  const handleTriggerPip = async () => {
    if (!isPipSupported) return;
    try {
      // Cast to any for experimental browser API
      const pip = (window as unknown as {
        documentPictureInPicture: {
          requestWindow: (opt: { width: number; height: number }) => Promise<Window>;
        };
      }).documentPictureInPicture;

      const pipWin = await pip.requestWindow({
        width: 380,
        height: 580,
      });

      // Copy stylesheets to PiP window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join('');
          const style = pipWin.document.createElement('style');
          style.textContent = cssRules;
          pipWin.document.head.appendChild(style);
        } catch {
          const link = pipWin.document.createElement('link');
          if (styleSheet.href) {
            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
          }
        }
      });

      // Notice in parent window
      updateSettings({ isFloating: true });
    } catch {
      // fallback to in-app floating mode
      updateSettings({ isFloating: true });
    }
  };

  // Calculate dimensions based on settings
  const getContainerDimensions = () => {
    if (settings.windowSize === 'classic') {
      return { width: '800px', height: '800px', isCompact: false };
    }
    if (settings.windowSize === 'compact') {
      return { width: '400px', height: '600px', isCompact: true };
    }
    if (settings.windowSize === 'mini') {
      return { width: '320px', height: '480px', isCompact: true };
    }
    if (settings.windowSize === 'custom') {
      const isCompact = settings.customWidth < 500 || settings.customHeight < 620;
      return {
        width: `${settings.customWidth}px`,
        height: `${settings.customHeight}px`,
        isCompact,
      };
    }
    // responsive
    return { width: '100%', height: '100%', isCompact: window.innerWidth < 500 };
  };

  const { width: containerWidth, height: containerHeight, isCompact } = getContainerDimensions();
  const chassisStyle = getChassisStyle(settings);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#101318] p-2 sm:p-4 text-white overflow-hidden relative select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(0,0,0,0))] pointer-events-none" />

      {/* Top Bar for Desktop View: Quick status & controls */}
      {!settings.isFloating && (
        <div className="w-full max-w-[800px] flex items-center justify-between px-3 py-1.5 mb-2 text-xs font-bold text-neutral-400 select-none z-10 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-black tracking-wide">HIUKALI CALCULATOR</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300 font-mono">
              {settings.windowSize === 'custom'
                ? `${settings.customWidth}×${settings.customHeight} px`
                : settings.windowSize === 'compact'
                ? '400 × 600 px'
                : settings.windowSize === 'mini'
                ? '320 × 480 px'
                : '800 × 800 px'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick floating toggle */}
            <button
              onClick={() => updateSettings({ isFloating: true })}
              title={t.floatingModeDesc}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all cursor-pointer text-xs"
            >
              <Move className="w-3.5 h-3.5" />
              <span>{t.floatingMode}</span>
            </button>

            {/* Quick Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-200 transition-all cursor-pointer text-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.settings}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Mode Overlay Controls (if floating enabled) */}
      {settings.isFloating && (
        <div
          style={{ left: `${floatingPos.x}px`, top: `${Math.max(10, floatingPos.y - 42)}px` }}
          className="fixed z-40 flex items-center gap-2 bg-[#1a1f29]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-2xl text-xs"
        >
          <span className="flex items-center gap-1 font-bold text-amber-300">
            <Move className="w-3.5 h-3.5" />
            <span>Melayang</span>
          </span>

          <div className="flex items-center gap-1 pl-2 border-l border-white/15">
            <Eye className="w-3 h-3 text-neutral-400" />
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={settings.opacity}
              onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
              className="w-16 accent-amber-500 cursor-pointer h-1.5"
              title={`${t.opacity}: ${Math.round(settings.opacity * 100)}%`}
            />
          </div>

          <button
            onClick={() => setIsMinimized((v) => !v)}
            title={isMinimized ? 'Perbesar' : 'Kecilkan'}
            className="p-1 rounded hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => updateSettings({ isFloating: false })}
            title={t.exitFloating}
            className="px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-[11px] cursor-pointer"
          >
            Keluar
          </button>
        </div>
      )}

      {/* CALCULATOR HOUSING CONTAINER */}
      <div
        style={{
          width: containerWidth,
          height: isMinimized ? 'auto' : containerHeight,
          maxWidth: '100vw',
          maxHeight: '100vh',
          background: chassisStyle.background,
          borderColor: chassisStyle.borderColor,
          opacity: settings.opacity,
          position: settings.isFloating ? 'fixed' : 'relative',
          left: settings.isFloating ? `${floatingPos.x}px` : 'auto',
          top: settings.isFloating ? `${floatingPos.y}px` : 'auto',
          zIndex: settings.isFloating ? 40 : 10,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex flex-col rounded-3xl border-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-100 ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Subtle decorative screws */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-black/40 border border-white/20 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-black/40 border border-white/20 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-black/40 border border-white/20 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-black/40 border border-white/20 pointer-events-none" />

        {/* 1. Header Bar */}
        <HeaderBar
          settings={settings}
          onUpdateSettings={updateSettings}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory((v) => !v)}
          historyCount={calcState.history.length}
          onOpenSettings={() => setShowSettings(true)}
          onOpenApkGuide={() => setShowApkGuide(true)}
          isFloating={settings.isFloating}
          onToggleFloating={() => updateSettings({ isFloating: !settings.isFloating })}
          isDragHandle={settings.isFloating}
        />

        {/* 2. Display Section */}
        <div className={`px-3 sm:px-5 ${isCompact ? 'pt-2 pb-1' : 'pt-3 pb-2'}`}>
          <DisplayScreen
            expression={calcState.expression}
            currentInput={calcState.currentInput}
            memoryValue={calcState.memory}
            lang={settings.language}
            isCompact={isCompact}
          />
        </div>

        {/* 3. Keyboard Grid (Only shown when not minimized) */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col justify-center">
            <Keypad
              buttons={styledButtons}
              onButtonClick={handleButtonClick}
              activeOperator={calcState.operator}
              activeKeyId={activeKeyId}
              isCompact={isCompact}
            />
          </div>
        )}

        {/* 4. Bottom Chassis Status Bar */}
        {!isMinimized && (
          <footer className="px-4 py-2 bg-black/35 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-neutral-400 select-none flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-neutral-300">HIUKALI CALCULATOR</span>
              <span className="hidden sm:inline text-neutral-500">|</span>
              <span className="hidden sm:inline text-neutral-400">
                {settings.buttonPalette.toUpperCase()} PALETTE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShortcuts(true)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Pintasan Keyboard
              </button>
            </div>
          </footer>
        )}

        {/* History Drawer */}
        <HistoryDrawer
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={calcState.history}
          onSelectResult={(res) => {
            setCalcState((prev) => ({
              ...prev,
              currentInput: res,
              waitingForSecondOperand: false,
            }));
            setShowHistory(false);
          }}
          onClearHistory={() =>
            setCalcState((prev) => ({
              ...prev,
              history: [],
            }))
          }
          lang={settings.language}
        />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
          lang={settings.language}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
          onTriggerPip={handleTriggerPip}
          isPipSupported={isPipSupported}
        />

        {/* APK / PWA Guide Modal */}
        <ApkGuideModal
          isOpen={showApkGuide}
          onClose={() => setShowApkGuide(false)}
          lang={settings.language}
          canInstallDirectly={canInstallPwa}
        />
      </div>
    </main>
  );
}
