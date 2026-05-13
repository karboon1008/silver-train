export const tokens = {
  colors: {
    ink: '#1c1c1e',
    parchment: '#f5f5f0',
    sage: '#a8c5a0',
    slate: '#b8ccd8',
    stone: '#d4c4a8',
    mist: '#8e8e93',
    white: '#ffffff',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 10,
    md: 16,
    lg: 24,
    pill: 999,
  },
  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
  },
  typography: {
    display: 28,
    title: 20,
    body: 15,
    label: 11,
    caption: 9,
  },
  motion: {
    quick: 180,
    standard: 300,
  },
} as const;

export type Tokens = typeof tokens;
