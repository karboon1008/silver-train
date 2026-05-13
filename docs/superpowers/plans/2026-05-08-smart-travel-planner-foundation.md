# Smart Travel Planner Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Expo Router foundation for the Smart Travel Planner with auth and tab shells, shared theming, mock-backed placeholder screens, and stubbed service/config wiring.

**Architecture:** Bootstrap an Expo Router TypeScript app in place, keep route files thin under `app/`, and place product code under `src/` with clear boundaries for `core`, `features`, `config`, `services`, `store`, and `mocks`. Use mocked session and content data so the app renders end to end without any live backend integrations.

**Tech Stack:** Expo · Expo Router · React Native · TypeScript · Zustand · Jest · Testing Library

---

## File Structure

- Create: `app/_layout.tsx` - root provider composition and stack shell
- Create: `app/index.tsx` - initial route redirect based on placeholder auth state
- Create: `app/(auth)/_layout.tsx` - auth stack layout
- Create: `app/(auth)/welcome.tsx` - onboarding entry screen
- Create: `app/(auth)/sign-in.tsx` - sign-in placeholder route
- Create: `app/(auth)/sign-up.tsx` - sign-up placeholder route
- Create: `app/(tabs)/_layout.tsx` - bottom tab shell
- Create: `app/(tabs)/trips.tsx` - Trips tab route
- Create: `app/(tabs)/explore.tsx` - Explore tab route
- Create: `app/(tabs)/profile.tsx` - Profile tab route
- Create: `src/config/env.ts` - typed environment accessors
- Create: `src/config/app-config.ts` - derived config helpers
- Create: `src/core/theme/tokens.ts` - colors, spacing, radii, shadows, typography, motion
- Create: `src/core/theme/themes.ts` - light and dark theme objects
- Create: `src/core/theme/theme-provider.tsx` - theme provider and hooks
- Create: `src/core/components/screen.tsx` - safe screen wrapper
- Create: `src/core/components/app-text.tsx` - shared text primitive
- Create: `src/core/components/app-button.tsx` - button primitive
- Create: `src/core/components/app-card.tsx` - card primitive
- Create: `src/core/components/section-header.tsx` - section title row
- Create: `src/core/components/segmented-control.tsx` - Trips segment switcher
- Create: `src/core/components/floating-action-button.tsx` - shell-level FAB
- Create: `src/core/components/empty-state.tsx` - reusable empty block
- Create: `src/core/components/search-field.tsx` - Explore search shell
- Create: `src/core/components/list-row.tsx` - Profile settings row
- Create: `src/core/constants/routes.ts` - route constants
- Create: `src/features/auth/components/auth-form-shell.tsx` - shared auth shell layout
- Create: `src/features/trips/components/trip-card.tsx` - trip preview placeholder
- Create: `src/features/explore/components/destination-card.tsx` - explore card placeholder
- Create: `src/features/profile/components/profile-summary.tsx` - profile header placeholder
- Create: `src/mocks/session.ts` - placeholder user/session data
- Create: `src/mocks/trips.ts` - placeholder trip data
- Create: `src/mocks/explore.ts` - placeholder explore data
- Create: `src/services/supabase.ts` - stub service surface
- Create: `src/services/openai.ts` - stub AI service surface
- Create: `src/services/maps.ts` - stub maps service surface
- Create: `src/services/notifications.ts` - stub notifications surface
- Create: `src/store/app-store.ts` - Zustand app/session store
- Create: `.env.example` - documented environment keys
- Create: `babel.config.js` - Expo Router babel config
- Create: `tsconfig.json` - TypeScript configuration
- Create: `jest.config.js` - Jest config
- Create: `jest.setup.ts` - test setup
- Create: `__tests__/app-store.test.ts` - shell state test
- Create: `__tests__/config.test.ts` - config behavior test
- Create: `__tests__/services.test.ts` - stub service contract test
- Modify: `package.json` - add Expo app scripts and dependencies
- Modify: `package-lock.json` - dependency lockfile after install

---

### Task 1: Bootstrap Expo Router Project

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`

- [ ] **Step 1: Write the failing config test**

Create `__tests__/config.test.ts`:

```ts
import { describe, expect, it } from '@jest/globals';
import { getPublicEnv } from '../src/config/env';

describe('getPublicEnv', () => {
  it('returns safe fallbacks when environment variables are missing', () => {
    expect(getPublicEnv()).toEqual({
      expoPublicSupabaseUrl: '',
      expoPublicSupabaseAnonKey: '',
      expoPublicOpenAiBaseUrl: '',
      expoPublicGoogleMapsApiKey: '',
      expoPublicGooglePlacesApiKey: '',
      expoPublicGoogleDirectionsApiKey: '',
      expoPublicNotificationsProjectId: '',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/config.test.ts`
Expected: FAIL because Jest and `src/config/env.ts` do not exist yet.

- [ ] **Step 3: Install and configure the Expo Router toolchain**

Update `package.json`:

```json
{
  "name": "smart-travel-planner",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest"
  },
  "dependencies": {
    "expo": "~53.0.0",
    "expo-router": "~5.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "19.0.0",
    "react-native": "0.79.0",
    "react-native-safe-area-context": "^5.4.0",
    "react-native-screens": "^4.10.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@testing-library/jest-native": "^5.4.3",
    "@testing-library/react-native": "^13.2.0",
    "@types/jest": "^29.5.14",
    "@types/react": "~19.0.10",
    "jest": "^29.7.0",
    "jest-expo": "~53.0.0",
    "typescript": "~5.8.3"
  }
}
```

Create `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
  };
};
```

Create `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

Run: `npm install`

- [ ] **Step 4: Add Jest scaffolding**

Create `jest.config.js`:

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
```

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-native/extend-expect';
```

- [ ] **Step 5: Run test to verify the toolchain is ready**

Run: `npm test -- --runTestsByPath __tests__/config.test.ts`
Expected: FAIL because `src/config/env.ts` still does not exist, proving the test harness is working.

---

### Task 2: Add Config and Environment Wiring

**Files:**
- Create: `.env.example`
- Create: `src/config/env.ts`
- Create: `src/config/app-config.ts`
- Modify: `__tests__/config.test.ts`

- [ ] **Step 1: Expand the failing config test to cover derived config**

Update `__tests__/config.test.ts`:

```ts
import { describe, expect, it } from '@jest/globals';
import { getAppConfig } from '../src/config/app-config';
import { getPublicEnv } from '../src/config/env';

describe('config', () => {
  it('returns safe empty-string defaults for public env keys', () => {
    expect(getPublicEnv()).toEqual({
      expoPublicSupabaseUrl: '',
      expoPublicSupabaseAnonKey: '',
      expoPublicOpenAiBaseUrl: '',
      expoPublicGoogleMapsApiKey: '',
      expoPublicGooglePlacesApiKey: '',
      expoPublicGoogleDirectionsApiKey: '',
      expoPublicNotificationsProjectId: '',
    });
  });

  it('reports integration readiness without throwing', () => {
    expect(getAppConfig().integrations).toEqual({
      mapsReady: false,
      notificationsReady: false,
      openAiReady: false,
      supabaseReady: false,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/config.test.ts`
Expected: FAIL with module not found errors for `src/config/env.ts` and `src/config/app-config.ts`.

- [ ] **Step 3: Implement the config layer**

Create `.env.example`:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_OPENAI_BASE_URL=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=
EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY=
EXPO_PUBLIC_NOTIFICATIONS_PROJECT_ID=
```

Create `src/config/env.ts`:

```ts
export type PublicEnv = {
  expoPublicSupabaseUrl: string;
  expoPublicSupabaseAnonKey: string;
  expoPublicOpenAiBaseUrl: string;
  expoPublicGoogleMapsApiKey: string;
  expoPublicGooglePlacesApiKey: string;
  expoPublicGoogleDirectionsApiKey: string;
  expoPublicNotificationsProjectId: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    expoPublicSupabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    expoPublicSupabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    expoPublicOpenAiBaseUrl: process.env.EXPO_PUBLIC_OPENAI_BASE_URL ?? '',
    expoPublicGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    expoPublicGooglePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? '',
    expoPublicGoogleDirectionsApiKey: process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY ?? '',
    expoPublicNotificationsProjectId: process.env.EXPO_PUBLIC_NOTIFICATIONS_PROJECT_ID ?? '',
  };
}
```

Create `src/config/app-config.ts`:

```ts
import { getPublicEnv } from './env';

export function getAppConfig() {
  const env = getPublicEnv();

  return {
    env,
    integrations: {
      supabaseReady: Boolean(env.expoPublicSupabaseUrl && env.expoPublicSupabaseAnonKey),
      openAiReady: Boolean(env.expoPublicOpenAiBaseUrl),
      mapsReady: Boolean(
        env.expoPublicGoogleMapsApiKey &&
          env.expoPublicGooglePlacesApiKey &&
          env.expoPublicGoogleDirectionsApiKey,
      ),
      notificationsReady: Boolean(env.expoPublicNotificationsProjectId),
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/config.test.ts`
Expected: PASS

---

### Task 3: Create Theme and App Store Foundations

**Files:**
- Create: `src/core/theme/tokens.ts`
- Create: `src/core/theme/themes.ts`
- Create: `src/core/theme/theme-provider.tsx`
- Create: `src/store/app-store.ts`
- Create: `__tests__/app-store.test.ts`

- [ ] **Step 1: Write the failing store test**

Create `__tests__/app-store.test.ts`:

```ts
import { describe, expect, it } from '@jest/globals';
import { useAppStore } from '../src/store/app-store';

describe('useAppStore', () => {
  it('toggles the placeholder auth state', () => {
    useAppStore.getState().signOut();
    expect(useAppStore.getState().isAuthenticated).toBe(false);

    useAppStore.getState().signIn();
    expect(useAppStore.getState().isAuthenticated).toBe(true);
  });

  it('stores theme preference', () => {
    useAppStore.getState().setThemePreference('dark');
    expect(useAppStore.getState().themePreference).toBe('dark');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/app-store.test.ts`
Expected: FAIL because `src/store/app-store.ts` does not exist yet.

- [ ] **Step 3: Implement the store and theme primitives**

Create `src/store/app-store.ts`:

```ts
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

type AppState = {
  isAuthenticated: boolean;
  themePreference: ThemePreference;
  user: { name: string; email: string } | null;
  signIn: () => void;
  signOut: () => void;
  setThemePreference: (value: ThemePreference) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  themePreference: 'system',
  user: { name: 'Ava Traveler', email: 'ava@example.com' },
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
  setThemePreference: (value) => set({ themePreference: value }),
}));
```

Create `src/core/theme/tokens.ts`:

```ts
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
};
```

Create `src/core/theme/themes.ts`:

```ts
import { tokens } from './tokens';

export const lightTheme = {
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

export const darkTheme = {
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

export type AppTheme = typeof lightTheme;
```

Create `src/core/theme/theme-provider.tsx`:

```tsx
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type AppTheme } from './themes';
import { useAppStore } from '../../store/app-store';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const preference = useAppStore((state) => state.themePreference);

  const value = useMemo(() => {
    if (preference === 'light') return lightTheme;
    if (preference === 'dark') return darkTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [preference, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --runTestsByPath __tests__/app-store.test.ts __tests__/config.test.ts`
Expected: PASS

---

### Task 4: Build the Shared UI Primitives

**Files:**
- Create: `src/core/components/screen.tsx`
- Create: `src/core/components/app-text.tsx`
- Create: `src/core/components/app-button.tsx`
- Create: `src/core/components/app-card.tsx`
- Create: `src/core/components/section-header.tsx`
- Create: `src/core/components/segmented-control.tsx`
- Create: `src/core/components/floating-action-button.tsx`
- Create: `src/core/components/empty-state.tsx`
- Create: `src/core/components/search-field.tsx`
- Create: `src/core/components/list-row.tsx`

- [ ] **Step 1: Write a failing component smoke test**

Create `__tests__/services.test.ts` temporarily as a component smoke test:

```ts
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppButton } from '../src/core/components/app-button';
import { ThemeProvider } from '../src/core/theme/theme-provider';

describe('AppButton', () => {
  it('renders its label', () => {
    const screen = render(
      <ThemeProvider>
        <AppButton label="Continue" onPress={() => undefined} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Continue')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/services.test.ts`
Expected: FAIL because the UI component modules do not exist yet.

- [ ] **Step 3: Implement the UI primitives**

Create `src/core/components/app-text.tsx`:

```tsx
import { Text, TextProps } from 'react-native';
import { useAppTheme } from '../theme/theme-provider';

type Props = TextProps & {
  tone?: 'default' | 'muted' | 'accent';
};

export function AppText({ style, tone = 'default', ...props }: Props) {
  const theme = useAppTheme();
  const color =
    tone === 'muted'
      ? theme.semantic.mutedText
      : tone === 'accent'
        ? theme.semantic.accent
        : theme.semantic.text;

  return <Text {...props} style={[{ color }, style]} />;
}
```

Create `src/core/components/screen.tsx`:

```tsx
import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-provider';

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
}>;

export function Screen({ children, scroll = false, style }: Props) {
  const theme = useAppTheme();
  const content = scroll ? (
    <ScrollView contentContainerStyle={[{ padding: theme.spacing.lg }, style]}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return <SafeAreaView style={[{ flex: 1, backgroundColor: theme.semantic.background }, style]}>{content}</SafeAreaView>;
}
```

Create `src/core/components/app-button.tsx`:

```tsx
import { Pressable } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ label, onPress, variant = 'primary' }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radii.pill,
        backgroundColor: variant === 'primary' ? theme.semantic.text : theme.semantic.surface,
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: theme.semantic.border,
      }}
    >
      <AppText style={{ textAlign: 'center' }} tone={variant === 'primary' ? 'accent' : 'default'}>
        {label}
      </AppText>
    </Pressable>
  );
}
```

Create `src/core/components/app-card.tsx`, `section-header.tsx`, `segmented-control.tsx`, `floating-action-button.tsx`, `empty-state.tsx`, `search-field.tsx`, and `list-row.tsx` with the same pattern: prop-only components styled from `useAppTheme()` with no domain logic.

- [ ] **Step 4: Run the component test**

Run: `npm test -- --runTestsByPath __tests__/services.test.ts`
Expected: PASS

---

### Task 5: Add Service Stubs and Mock Data

**Files:**
- Create: `src/mocks/session.ts`
- Create: `src/mocks/trips.ts`
- Create: `src/mocks/explore.ts`
- Create: `src/services/supabase.ts`
- Create: `src/services/openai.ts`
- Create: `src/services/maps.ts`
- Create: `src/services/notifications.ts`
- Modify: `__tests__/services.test.ts`

- [ ] **Step 1: Replace the smoke test with service contract tests**

Update `__tests__/services.test.ts`:

```ts
import { describe, expect, it } from '@jest/globals';
import { suggestStops, generateTrip } from '../src/services/openai';
import { registerForNotifications } from '../src/services/notifications';
import { searchPlaces } from '../src/services/maps';

describe('service stubs', () => {
  it('returns deterministic not-connected AI responses', async () => {
    await expect(generateTrip()).resolves.toEqual({ ok: false, reason: 'not-connected' });
    await expect(suggestStops()).resolves.toEqual({ ok: false, reason: 'not-connected' });
  });

  it('returns empty maps results', async () => {
    await expect(searchPlaces('Paris')).resolves.toEqual([]);
  });

  it('returns a disabled notification registration result', async () => {
    await expect(registerForNotifications()).resolves.toEqual({
      ok: false,
      reason: 'not-connected',
      token: null,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/services.test.ts`
Expected: FAIL because the service files do not exist.

- [ ] **Step 3: Implement stubs and mock content**

Create `src/mocks/session.ts`:

```ts
export const mockUser = {
  name: 'Ava Traveler',
  email: 'ava@example.com',
};
```

Create `src/mocks/trips.ts`:

```ts
export const mockTrips = {
  Upcoming: [
    { id: '1', name: 'Paris Weekend', destination: 'Paris', dateRange: 'May 20 - May 23', status: 'In 12 days' },
  ],
  Past: [],
  Drafts: [{ id: '2', name: 'Kyoto Draft', destination: 'Kyoto', dateRange: 'Unscheduled', status: 'Draft' }],
} as const;
```

Create `src/mocks/explore.ts`:

```ts
export const mockDestinations = [
  { id: '1', name: 'Lisbon', tag: 'Coastal city breaks', category: 'City' },
  { id: '2', name: 'Bali', tag: 'Nature and calm escapes', category: 'Nature' },
];
```

Create `src/services/openai.ts`:

```ts
export async function generateTrip() {
  return { ok: false as const, reason: 'not-connected' as const };
}

export async function suggestStops() {
  return { ok: false as const, reason: 'not-connected' as const };
}
```

Create `src/services/maps.ts`:

```ts
export async function searchPlaces(_query: string) {
  return [];
}
```

Create `src/services/notifications.ts`:

```ts
export async function registerForNotifications() {
  return { ok: false as const, reason: 'not-connected' as const, token: null };
}
```

Create `src/services/supabase.ts`:

```ts
export function getSupabaseClient() {
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/services.test.ts`
Expected: PASS

---

### Task 6: Build the Expo Router Shell and Placeholder Screens

**Files:**
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/welcome.tsx`
- Create: `app/(auth)/sign-in.tsx`
- Create: `app/(auth)/sign-up.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/trips.tsx`
- Create: `app/(tabs)/explore.tsx`
- Create: `app/(tabs)/profile.tsx`
- Create: `src/core/constants/routes.ts`
- Create: `src/features/auth/components/auth-form-shell.tsx`
- Create: `src/features/trips/components/trip-card.tsx`
- Create: `src/features/explore/components/destination-card.tsx`
- Create: `src/features/profile/components/profile-summary.tsx`

- [ ] **Step 1: Write the failing route behavior test**

Create `__tests__/routes.test.tsx`:

```tsx
import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import TripsScreen from '../app/(tabs)/trips';

describe('Trips screen', () => {
  it('renders the My Trips heading', () => {
    const screen = render(<TripsScreen />);
    expect(screen.getByText('My Trips')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/routes.test.tsx`
Expected: FAIL because the route files do not exist yet.

- [ ] **Step 3: Implement routing and placeholder screens**

Create `src/core/constants/routes.ts`:

```ts
export const routes = {
  welcome: '/(auth)/welcome',
  signIn: '/(auth)/sign-in',
  signUp: '/(auth)/sign-up',
  trips: '/(tabs)/trips',
  explore: '/(tabs)/explore',
  profile: '/(tabs)/profile',
} as const;
```

Create `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/core/theme/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
```

Create `app/index.tsx`:

```tsx
import { Redirect } from 'expo-router';
import { routes } from '../src/core/constants/routes';
import { useAppStore } from '../src/store/app-store';

export default function Index() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return <Redirect href={isAuthenticated ? routes.trips : routes.welcome} />;
}
```

Create the auth and tab layout files using `Stack` and `Tabs`. Implement `welcome.tsx`, `sign-in.tsx`, `sign-up.tsx`, `trips.tsx`, `explore.tsx`, and `profile.tsx` as thin route files that compose `Screen`, shared primitives, mock data, and feature-level placeholder components.

Trips screen content must include:

```tsx
<SectionHeader title="My Trips" subtitle="Good morning" />
<SegmentedControl options={['Upcoming', 'Past', 'Drafts']} value={segment} onChange={setSegment} />
```

Explore screen content must include:

```tsx
<SearchField value="" onChangeText={() => undefined} placeholder="Search destinations" />
```

Profile screen content must include:

```tsx
<ProfileSummary name="Ava Traveler" email="ava@example.com" />
```

- [ ] **Step 4: Run the route test**

Run: `npm test -- --runTestsByPath __tests__/routes.test.tsx`
Expected: PASS

---

### Task 7: Verify the Foundation End to End

**Files:**
- Modify: any files needed from Tasks 1-6 after verification

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS across `config`, `app-store`, `services`, and `routes` tests.

- [ ] **Step 2: Run the Expo app locally**

Run: `npm run start`
Expected: Expo starts successfully and exposes the project as an Expo Router app.

- [ ] **Step 3: Manual verification checklist**

Check these behaviors in Expo Go or a simulator:

- Welcome screen loads first when `isAuthenticated` is false
- Sign-in button enters the tab shell
- Trips tab shows heading, segments, and placeholder cards
- Explore tab shows search field, AI banner shell, and destination cards
- Profile tab shows summary and settings rows
- Theme preference changes do not crash the app

- [ ] **Step 4: Tighten any rough edges revealed by manual verification**

Only patch issues discovered during Step 3. Keep fixes narrow and aligned with the approved foundation scope.

---

## Self-Review

- Spec coverage: the plan covers routing, shell screens, theming, Zustand state, config/env wiring, mock data, service stubs, and verification. Live integrations, maps rendering, auth providers, and offline persistence remain intentionally out of scope.
- Placeholder scan: no `TBD`, `TODO`, or deferred-code placeholders remain in the plan steps.
- Type consistency: `getPublicEnv`, `getAppConfig`, `useAppStore`, `generateTrip`, `suggestStops`, `searchPlaces`, and `registerForNotifications` are named consistently across tasks and tests.
