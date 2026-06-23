import { applyTheme, type AppTheme } from './themeConfig';

export interface AppSettings {
  theme: AppTheme;
  autoSuggestMoves: boolean;
  showDamageEstimates: boolean;
  showOpponentPredictions: boolean;
  defaultFormat: 'vgc' | 'singles';
  animationSpeed: 'fast' | 'normal' | 'slow';
  confirmBeforeKO: boolean;
  spriteStyle: '3d' | '2d' | 'pixel';
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  autoSuggestMoves: true,
  showDamageEstimates: true,
  showOpponentPredictions: true,
  defaultFormat: 'vgc',
  animationSpeed: 'normal',
  confirmBeforeKO: false,
  spriteStyle: '3d',
};

const SETTINGS_KEY = 'pokemon-champions-settings';

export function getSettings(): AppSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<AppSettings>) {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  
  // Instantly apply theme if it changed
  if (settings.theme && settings.theme !== current.theme) {
    applyTheme(settings.theme);
  }
}

export function initSettings() {
  const settings = getSettings();
  applyTheme(settings.theme);
}
