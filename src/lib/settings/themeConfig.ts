export type AppTheme = 'dark' | 'oled' | 'light' | 'pokeball-red' | 'ocean-blue' | 'forest-green';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export const themes: Record<AppTheme, ThemeColors> = {
  'dark': {
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    primary: '210 40% 98%',
    primaryForeground: '222.2 47.4% 11.2%',
    secondary: '217.2 32.6% 17.5%',
    secondaryForeground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    border: '217.2 32.6% 17.5%',
  },
  'oled': {
    background: '0 0% 0%',
    foreground: '210 40% 98%',
    card: '0 0% 3%',
    cardForeground: '210 40% 98%',
    primary: '210 40% 98%',
    primaryForeground: '0 0% 0%',
    secondary: '0 0% 12%',
    secondaryForeground: '210 40% 98%',
    muted: '0 0% 12%',
    mutedForeground: '215 20.2% 65.1%',
    border: '0 0% 15%',
  },
  'light': {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    primary: '222.2 47.4% 11.2%',
    primaryForeground: '210 40% 98%',
    secondary: '210 40% 96.1%',
    secondaryForeground: '222.2 47.4% 11.2%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    border: '214.3 31.8% 91.4%',
  },
  'pokeball-red': {
    background: '350 30% 8%',
    foreground: '0 0% 98%',
    card: '350 30% 10%',
    cardForeground: '0 0% 98%',
    primary: '350 80% 50%',
    primaryForeground: '0 0% 98%',
    secondary: '350 40% 15%',
    secondaryForeground: '0 0% 98%',
    muted: '350 40% 15%',
    mutedForeground: '0 0% 70%',
    border: '350 40% 20%',
  },
  'ocean-blue': {
    background: '220 50% 10%',
    foreground: '0 0% 98%',
    card: '220 50% 12%',
    cardForeground: '0 0% 98%',
    primary: '220 80% 60%',
    primaryForeground: '0 0% 9%',
    secondary: '220 40% 20%',
    secondaryForeground: '0 0% 98%',
    muted: '220 40% 20%',
    mutedForeground: '220 20% 70%',
    border: '220 40% 25%',
  },
  'forest-green': {
    background: '140 40% 8%',
    foreground: '0 0% 98%',
    card: '140 40% 10%',
    cardForeground: '0 0% 98%',
    primary: '140 70% 45%',
    primaryForeground: '0 0% 98%',
    secondary: '140 30% 18%',
    secondaryForeground: '0 0% 98%',
    muted: '140 30% 18%',
    mutedForeground: '140 20% 65%',
    border: '140 30% 25%',
  }
};

export function applyTheme(themeName: AppTheme) {
  const theme = themes[themeName] || themes['dark'];
  const root = document.documentElement;
  
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--card-foreground', theme.cardForeground);
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', theme.primaryForeground);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--muted-foreground', theme.mutedForeground);
  root.style.setProperty('--border', theme.border);
  
  // Need to toggle dark class for tailwind classes if light mode
  if (themeName === 'light') {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }
}
