import { SoundType } from './audio';
import {
  ButtonPaletteKey,
  CategoryColors,
  PRESET_BUTTON_PALETTES,
  getContrastTextColor,
  getDarkerShade
} from './theme';

export interface CalculatorButtonConfig {
  id: string;
  label: string;
  subLabel?: string;
  value: string;
  type: 'number' | 'operator' | 'equals' | 'clear' | 'memory' | 'special';
  soundType: SoundType;
  bgColor: string;
  textColor: string;
  shadowColor: string;
  keyboardKey?: string[];
  description: string;
}

export const ORIGINAL_RAINBOW_BUTTONS: CalculatorButtonConfig[] = [
  // ROW 1: Memory Keys
  {
    id: 'mc',
    label: 'MC',
    subLabel: 'Clear',
    value: 'MC',
    type: 'memory',
    soundType: 'memory',
    bgColor: '#831843',      // Deep Cabernet
    textColor: '#FFFFFF',
    shadowColor: '#4c0519',
    keyboardKey: [],
    description: 'Hapus Memori'
  },
  {
    id: 'mr',
    label: 'MR',
    subLabel: 'Recall',
    value: 'MR',
    type: 'memory',
    soundType: 'memory',
    bgColor: '#581C87',      // Deep Plum
    textColor: '#FFFFFF',
    shadowColor: '#3b0764',
    keyboardKey: ['m', 'M'],
    description: 'Panggil Memori'
  },
  {
    id: 'm-plus',
    label: 'M+',
    subLabel: 'Add',
    value: 'M+',
    type: 'memory',
    soundType: 'memory',
    bgColor: '#065F46',      // Deep Evergreen
    textColor: '#FFFFFF',
    shadowColor: '#022c22',
    keyboardKey: [],
    description: 'Tambah ke Memori'
  },
  {
    id: 'm-minus',
    label: 'M−',
    subLabel: 'Sub',
    value: 'M-',
    type: 'memory',
    soundType: 'memory',
    bgColor: '#1E3A8A',      // Midnight Navy
    textColor: '#FFFFFF',
    shadowColor: '#172554',
    keyboardKey: [],
    description: 'Kurangi dari Memori'
  },

  // ROW 2: Primary Control & Operator
  {
    id: 'ac',
    label: 'AC',
    subLabel: 'Clear All',
    value: 'AC',
    type: 'clear',
    soundType: 'clear',
    bgColor: '#E11D48',      // Vivid Crimson Red
    textColor: '#FFFFFF',
    shadowColor: '#9f1239',
    keyboardKey: ['Escape', 'c', 'C'],
    description: 'Bersihkan Semua (AC)'
  },
  {
    id: 'backspace',
    label: '⌫',
    subLabel: 'Hapus',
    value: 'BACKSPACE',
    type: 'clear',
    soundType: 'clear',
    bgColor: '#F59E0B',      // Bright Amber
    textColor: '#000000',
    shadowColor: '#b45309',
    keyboardKey: ['Backspace'],
    description: 'Hapus Satu Digit'
  },
  {
    id: 'negate',
    label: '+/−',
    subLabel: 'Negasi',
    value: 'NEGATE',
    type: 'special',
    soundType: 'operator',
    bgColor: '#6366F1',      // Electric Indigo
    textColor: '#FFFFFF',
    shadowColor: '#4338ca',
    keyboardKey: ['_'],
    description: 'Positif / Negatif'
  },
  {
    id: 'divide',
    label: '÷',
    subLabel: 'Bagi',
    value: '/',
    type: 'operator',
    soundType: 'operator',
    bgColor: '#06B6D4',      // Bright Cyan
    textColor: '#042F2E',    // Deep Dark Teal Contrast
    shadowColor: '#0e7490',
    keyboardKey: ['/'],
    description: 'Bagi'
  },

  // ROW 3: Numbers 7, 8, 9 & Multiply
  {
    id: 'num-7',
    label: '7',
    value: '7',
    type: 'number',
    soundType: 'number',
    bgColor: '#84CC16',      // Electric Lime
    textColor: '#14532D',    // Deep Forest Green Contrast
    shadowColor: '#4d7c0f',
    keyboardKey: ['7'],
    description: 'Angka Tujuh'
  },
  {
    id: 'num-8',
    label: '8',
    value: '8',
    type: 'number',
    soundType: 'number',
    bgColor: '#0284C7',      // Deep Sky Blue
    textColor: '#FFFFFF',
    shadowColor: '#0369a1',
    keyboardKey: ['8'],
    description: 'Angka Delapan'
  },
  {
    id: 'num-9',
    label: '9',
    value: '9',
    type: 'number',
    soundType: 'number',
    bgColor: '#D946EF',      // Neon Fuchsia
    textColor: '#FFFFFF',
    shadowColor: '#a21caf',
    keyboardKey: ['9'],
    description: 'Angka Sembilan'
  },
  {
    id: 'multiply',
    label: '×',
    subLabel: 'Kali',
    value: '*',
    type: 'operator',
    soundType: 'operator',
    bgColor: '#7C3AED',      // Royal Violet
    textColor: '#FFFFFF',
    shadowColor: '#5b21b6',
    keyboardKey: ['*'],
    description: 'Kali'
  },

  // ROW 4: Numbers 4, 5, 6 & Subtract
  {
    id: 'num-4',
    label: '4',
    value: '4',
    type: 'number',
    soundType: 'number',
    bgColor: '#10B981',      // Emerald Green
    textColor: '#022C22',    // Deep Pine Black Contrast
    shadowColor: '#047857',
    keyboardKey: ['4'],
    description: 'Angka Empat'
  },
  {
    id: 'num-5',
    label: '5',
    value: '5',
    type: 'number',
    soundType: 'number',
    bgColor: '#FACC15',      // Bright Yellow
    textColor: '#000000',    // Pitch Black Contrast
    shadowColor: '#a16207',
    keyboardKey: ['5'],
    description: 'Angka Lima'
  },
  {
    id: 'num-6',
    label: '6',
    value: '6',
    type: 'number',
    soundType: 'number',
    bgColor: '#F97316',      // Coral Orange
    textColor: '#000000',    // Pitch Black Contrast
    shadowColor: '#c2410c',
    keyboardKey: ['6'],
    description: 'Angka Enam'
  },
  {
    id: 'subtract',
    label: '−',
    subLabel: 'Kurang',
    value: '-',
    type: 'operator',
    soundType: 'operator',
    bgColor: '#F43F5E',      // Vivid Rose
    textColor: '#FFFFFF',
    shadowColor: '#be123c',
    keyboardKey: ['-'],
    description: 'Kurang'
  },

  // ROW 5: Numbers 1, 2, 3 & Add
  {
    id: 'num-1',
    label: '1',
    value: '1',
    type: 'number',
    soundType: 'number',
    bgColor: '#14B8A6',      // Bright Turquoise
    textColor: '#042F2E',    // Deep Petrol Teal Contrast
    shadowColor: '#0f766e',
    keyboardKey: ['1'],
    description: 'Angka Satu'
  },
  {
    id: 'num-2',
    label: '2',
    value: '2',
    type: 'number',
    soundType: 'number',
    bgColor: '#2563EB',      // Cobalt Blue
    textColor: '#FFFFFF',
    shadowColor: '#1d4ed8',
    keyboardKey: ['2'],
    description: 'Angka Dua'
  },
  {
    id: 'num-3',
    label: '3',
    value: '3',
    type: 'number',
    soundType: 'number',
    bgColor: '#FB923C',      // Apricot Orange
    textColor: '#000000',    // Pitch Black Contrast
    shadowColor: '#c2410c',
    keyboardKey: ['3'],
    description: 'Angka Tiga'
  },
  {
    id: 'add',
    label: '+',
    subLabel: 'Tambah',
    value: '+',
    type: 'operator',
    soundType: 'operator',
    bgColor: '#059669',      // Deep Jade Green
    textColor: '#FFFFFF',
    shadowColor: '#047857',
    keyboardKey: ['+'],
    description: 'Tambah'
  },

  // ROW 6: Percent, 0, Decimal Point, Equals
  {
    id: 'percent',
    label: '%',
    subLabel: 'Persen',
    value: '%',
    type: 'special',
    soundType: 'operator',
    bgColor: '#A855F7',      // Amethyst Purple
    textColor: '#FFFFFF',
    shadowColor: '#7e22ce',
    keyboardKey: ['%'],
    description: 'Persentase'
  },
  {
    id: 'num-0',
    label: '0',
    value: '0',
    type: 'number',
    soundType: 'number',
    bgColor: '#EA580C',      // Terracotta Flame
    textColor: '#FFFFFF',
    shadowColor: '#9a3412',
    keyboardKey: ['0'],
    description: 'Angka Nol'
  },
  {
    id: 'decimal',
    label: '.',
    subLabel: 'Koma',
    value: '.',
    type: 'special',
    soundType: 'number',
    bgColor: '#A3E635',      // Neon Citron
    textColor: '#1A2E05',    // Deep Olive Black Contrast
    shadowColor: '#4d7c0f',
    keyboardKey: ['.', ','],
    description: 'Titik Desimal'
  },
  {
    id: 'equals',
    label: '=',
    subLabel: 'Hasil',
    value: '=',
    type: 'equals',
    soundType: 'equals',
    bgColor: '#3B82F6',      // Radiant Blue
    textColor: '#FFFFFF',
    shadowColor: '#1d4ed8',
    keyboardKey: ['Enter', '='],
    description: 'Hitung Hasil Sama Dengan'
  }
];

// Helper to get dynamically styled buttons according to theme & customizations
export function getStyledButtons(
  palette: ButtonPaletteKey,
  customColors: CategoryColors
): CalculatorButtonConfig[] {
  return ORIGINAL_RAINBOW_BUTTONS.map((btn) => {
    let bgColor = btn.bgColor;

    if (palette === 'rainbow') {
      bgColor = btn.bgColor;
    } else if (palette === 'custom') {
      if (btn.type === 'number') bgColor = customColors.numbers;
      else if (btn.type === 'operator') bgColor = customColors.operators;
      else if (btn.type === 'clear') bgColor = customColors.actions;
      else if (btn.type === 'memory') bgColor = customColors.memory;
      else if (btn.type === 'equals') bgColor = customColors.equals;
      else if (btn.type === 'special') bgColor = customColors.special;
    } else {
      const preset = PRESET_BUTTON_PALETTES[palette];
      if (preset && preset[btn.id]) {
        bgColor = preset[btn.id];
      }
    }

    const textColor = getContrastTextColor(bgColor);
    const shadowColor = getDarkerShade(bgColor);

    return {
      ...btn,
      bgColor,
      textColor,
      shadowColor,
    };
  });
}
