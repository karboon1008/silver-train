import { beforeEach, describe, expect, it } from '@jest/globals';
import { defaultAppState, useAppStore } from '../src/store/app-store';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState(defaultAppState);
  });

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
