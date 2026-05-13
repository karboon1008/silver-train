import { type PropsWithChildren, createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '@/store/app-store';
import { darkTheme, lightTheme, type AppTheme } from './themes';

const ThemeContext = createContext<AppTheme>(lightTheme);

function resolveTheme(
  preference: 'system' | 'light' | 'dark',
  systemScheme: ReturnType<typeof useColorScheme>,
): AppTheme {
  if (preference === 'light') {
    return lightTheme;
  }

  if (preference === 'dark') {
    return darkTheme;
  }

  return systemScheme === 'dark' ? darkTheme : lightTheme;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const preference = useAppStore((state) => state.themePreference);

  return (
    <ThemeContext.Provider value={resolveTheme(preference, systemScheme)}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
