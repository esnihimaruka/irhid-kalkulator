import React from 'react';
import { CalculatorButtonConfig } from '../utils/buttons';

interface KeypadProps {
  buttons: CalculatorButtonConfig[];
  onButtonClick: (button: CalculatorButtonConfig) => void;
  activeOperator: string | null;
  activeKeyId: string | null;
  isCompact?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  buttons,
  onButtonClick,
  activeOperator,
  activeKeyId,
  isCompact = false,
}) => {
  return (
    <div
      className={`grid grid-cols-4 select-none ${
        isCompact ? 'gap-1.5 p-2.5' : 'gap-2 sm:gap-2.5 p-3 sm:p-4'
      } flex-1`}
    >
      {buttons.map((btn) => {
        const isOperatorActive =
          btn.type === 'operator' && activeOperator === btn.value;
        const isKeyPressed = activeKeyId === btn.id;

        return (
          <button
            key={btn.id}
            id={btn.id}
            onClick={() => onButtonClick(btn)}
            title={`${btn.description} ${
              btn.keyboardKey?.length ? `(Shortcut: ${btn.keyboardKey.join(', ')})` : ''
            }`}
            aria-label={btn.description}
            style={{
              backgroundColor: btn.bgColor,
              color: btn.textColor,
              boxShadow: isKeyPressed
                ? `0 1px 0 ${btn.shadowColor}`
                : isCompact
                ? `0 3px 0 ${btn.shadowColor}`
                : `0 5px 0 ${btn.shadowColor}`,
              transform: isKeyPressed
                ? isCompact
                  ? 'translateY(2px)'
                  : 'translateY(4px)'
                : 'none',
            }}
            className={`
              relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-75 cursor-pointer
              outline-none focus-visible:ring-4 focus-visible:ring-white/50
              hover:brightness-110 active:brightness-95
              ${isCompact ? 'h-[42px] sm:h-[48px]' : 'h-[50px] sm:h-[60px]'}
              ${
                isOperatorActive
                  ? 'ring-4 ring-white ring-offset-2 ring-offset-[#1b1e24]'
                  : ''
              }
            `}
          >
            {/* Primary Bold Label */}
            <span
              className={`font-black tracking-wide drop-shadow-sm leading-none ${
                isCompact ? 'text-lg' : 'text-xl sm:text-2xl'
              }`}
            >
              {btn.label}
            </span>

            {/* Small helper sub-label */}
            {btn.subLabel && !isCompact && (
              <span
                style={{ color: btn.textColor }}
                className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider opacity-85 mt-0.5 leading-none"
              >
                {btn.subLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
