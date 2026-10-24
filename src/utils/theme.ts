export type ChassisThemeKey = 'grey' | 'dark' | 'slate' | 'titanium' | 'light' | 'custom';
export type ButtonPaletteKey = 'rainbow' | 'neon' | 'pastel' | 'retro' | 'monochrome' | 'custom';
export type WindowSizeKey = 'classic' | 'compact' | 'mini' | 'responsive' | 'custom';

export interface CategoryColors {
  numbers: string;
  operators: string;
  actions: string;
  memory: string;
  equals: string;
  special: string;
}

export interface AppSettings {
  language: 'id' | 'en' | 'zh' | 'ja' | 'ko';
  soundEnabled: boolean;
  chassisTheme: ChassisThemeKey;
  customChassisColor: string;
  buttonPalette: ButtonPaletteKey;
  customCategoryColors: CategoryColors;
  windowSize: WindowSizeKey;
  customWidth: number;
  customHeight: number;
  opacity: number;
  isFloating: boolean;
}

export const defaultCategoryColors: CategoryColors = {
  numbers: '#0284C7',
  operators: '#7C3AED',
  actions: '#E11D48',
  memory: '#065F46',
  equals: '#3B82F6',
  special: '#F59E0B',
};

export const defaultSettings: AppSettings = {
  language: 'id',
  soundEnabled: true,
  chassisTheme: 'grey',
  customChassisColor: '#2b303c',
  buttonPalette: 'rainbow',
  customCategoryColors: defaultCategoryColors,
  windowSize: 'classic',
  customWidth: 800,
  customHeight: 800,
  opacity: 1.0,
  isFloating: false,
};

// Calculate luminance and return highest contrast text color (#ffffff or #000000)
export function getContrastTextColor(hexColor: string): string {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#FFFFFF';

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#000000' : '#FFFFFF';
}

// Generate darker shade for 3D bevel shadow
export function getDarkerShade(hexColor: string, factor = 0.4): string {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#1a1a1a';

  const r = Math.max(0, Math.floor(parseInt(cleanHex.substring(0, 2), 16) * (1 - factor)));
  const g = Math.max(0, Math.floor(parseInt(cleanHex.substring(2, 4), 16) * (1 - factor)));
  const b = Math.max(0, Math.floor(parseInt(cleanHex.substring(4, 6), 16) * (1 - factor)));

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getChassisStyle(settings: AppSettings): { background: string; borderColor: string } {
  switch (settings.chassisTheme) {
    case 'grey':
      return {
        background: 'linear-gradient(180deg, #383e48 0%, #2a2e36 50%, #1f232a 100%)',
        borderColor: '#4f5664',
      };
    case 'dark':
      return {
        background: 'linear-gradient(180deg, #27272a 0%, #18181b 50%, #09090b 100%)',
        borderColor: '#3f3f46',
      };
    case 'slate':
      return {
        background: 'linear-gradient(180deg, #334155 0%, #1e293b 50%, #0f172a 100%)',
        borderColor: '#475569',
      };
    case 'titanium':
      return {
        background: 'linear-gradient(180deg, #64748b 0%, #475569 50%, #334155 100%)',
        borderColor: '#94a3b8',
      };
    case 'light':
      return {
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        borderColor: '#94a3b8',
      };
    case 'custom': {
      const hex = settings.customChassisColor || '#2b303c';
      const darker = getDarkerShade(hex, 0.3);
      return {
        background: `linear-gradient(180deg, ${hex} 0%, ${darker} 100%)`,
        borderColor: hex,
      };
    }
    default:
      return {
        background: 'linear-gradient(180deg, #383e48 0%, #2a2e36 50%, #1f232a 100%)',
        borderColor: '#4f5664',
      };
  }
}

// Predefined palette colors for each key in special themes
export const PRESET_BUTTON_PALETTES: Record<Exclude<ButtonPaletteKey, 'rainbow' | 'custom'>, Record<string, string>> = {
  neon: {
    // Cyberpunk electric neon
    mc: '#9d174d', mr: '#86198f', 'm-plus': '#047857', 'm-minus': '#1d4ed8',
    ac: '#f43f5e', backspace: '#f59e0b', negate: '#818cf8', divide: '#06b6d4',
    'num-7': '#a3e635', 'num-8': '#38bdf8', 'num-9': '#f472b6', multiply: '#a855f7',
    'num-4': '#34d399', 'num-5': '#facc15', 'num-6': '#fb923c', subtract: '#fb7185',
    'num-1': '#2dd4bf', 'num-2': '#60a5fa', 'num-3': '#fde047', add: '#10b981',
    percent: '#c084fc', 'num-0': '#f87171', decimal: '#bef264', equals: '#00f2fe'
  },
  pastel: {
    // Aesthetic soft pastel
    mc: '#be185d', mr: '#7e22ce', 'm-plus': '#0f766e', 'm-minus': '#3730a3',
    ac: '#fda4af', backspace: '#fde68a', negate: '#c7d2fe', divide: '#a5f3fc',
    'num-7': '#d9f99d', 'num-8': '#bae6fd', 'num-9': '#fbcfe8', multiply: '#e9d5ff',
    'num-4': '#a7f3d0', 'num-5': '#fef08a', 'num-6': '#fed7aa', subtract: '#fecdd3',
    'num-1': '#99f6e4', 'num-2': '#bfdbfe', 'num-3': '#fef9c3', add: '#6ee7b7',
    percent: '#ddd6fe', 'num-0': '#fca5a5', decimal: '#ecfccb', equals: '#93c5fd'
  },
  retro: {
    // Vintage mechanical calculator
    mc: '#78350f', mr: '#713f12', 'm-plus': '#14532d', 'm-minus': '#1e3a8a',
    ac: '#b91c1c', backspace: '#c2410c', negate: '#4b5563', divide: '#0f766e',
    'num-7': '#e5e5e5', 'num-8': '#e5e5e5', 'num-9': '#e5e5e5', multiply: '#1e40af',
    'num-4': '#d4d4d4', 'num-5': '#d4d4d4', 'num-6': '#d4d4d4', subtract: '#991b1b',
    'num-1': '#e5e5e5', 'num-2': '#e5e5e5', 'num-3': '#e5e5e5', add: '#166534',
    percent: '#475569', 'num-0': '#d4d4d4', decimal: '#737373', equals: '#ea580c'
  },
  monochrome: {
    // Sleek monochrome with gold accents
    mc: '#27272a', mr: '#27272a', 'm-plus': '#27272a', 'm-minus': '#27272a',
    ac: '#ef4444', backspace: '#f59e0b', negate: '#3f3f46', divide: '#52525b',
    'num-7': '#18181b', 'num-8': '#18181b', 'num-9': '#18181b', multiply: '#52525b',
    'num-4': '#18181b', 'num-5': '#18181b', 'num-6': '#18181b', subtract: '#52525b',
    'num-1': '#18181b', 'num-2': '#18181b', 'num-3': '#18181b', add: '#52525b',
    percent: '#3f3f46', 'num-0': '#18181b', decimal: '#3f3f46', equals: '#eab308'
  }
};
