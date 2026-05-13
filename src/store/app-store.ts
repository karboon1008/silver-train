import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

export type AppUser = {
  name: string;
  email: string;
};

export type AppState = {
  isAuthenticated: boolean;
  themePreference: ThemePreference;
  user: AppUser | null;
  signIn: () => void;
  signOut: () => void;
  setThemePreference: (value: ThemePreference) => void;
};

const defaultUser: AppUser = {
  name: 'Ava Traveler',
  email: 'ava@example.com',
};

export const defaultAppState: Pick<
  AppState,
  'isAuthenticated' | 'themePreference' | 'user'
> = {
  isAuthenticated: false,
  themePreference: 'system',
  user: defaultUser,
};

export const useAppStore = create<AppState>((set) => ({
  ...defaultAppState,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
  setThemePreference: (value) => set({ themePreference: value }),
}));
