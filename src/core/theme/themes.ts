import { tokens, type Tokens } from './tokens';

type SemanticTheme = {
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  accent: string;
  border: string;
};

export type AppTheme = Tokens & {
  semantic: SemanticTheme;
};

export const lightTheme: AppTheme = {
  ...tokens,
  semantic: {
    background: tokens.colors.parchment,
    surface: tokens.colors.white,
    card: '#f0ede6',
    text: tokens.colors.ink,
    mutedText: tokens.colors.mist,
    accent: tokens.colors.sage,
    border: '#e2ddd4',
  },
};

export const darkTheme: AppTheme = {
  ...tokens,
  semantic: {
    background: '#111214',
    surface: '#1a1b1d',
    card: '#232427',
    text: tokens.colors.parchment,
    mutedText: '#b1b1b6',
    accent: '#8db28a',
    border: '#303236',
  },
};
