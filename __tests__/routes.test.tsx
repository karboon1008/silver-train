import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/core/theme/theme-provider';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

import TripsScreen from '../app/(tabs)/trips';
import ExploreScreen from '../app/(tabs)/explore';
import ProfileScreen from '../app/(tabs)/profile';

function renderWithTheme(element: React.ReactElement) {
  return render(<ThemeProvider>{element}</ThemeProvider>);
}

describe('placeholder routes', () => {
  it('renders the Trips shell heading', () => {
    const screen = renderWithTheme(<TripsScreen />);

    expect(screen.getByText('My Trips')).toBeTruthy();
    expect(screen.getByText('Upcoming')).toBeTruthy();
    expect(screen.getByText('Drafts')).toBeTruthy();
  });

  it('renders the Explore search shell', () => {
    const screen = renderWithTheme(<ExploreScreen />);

    expect(screen.getByPlaceholderText('Search destinations')).toBeTruthy();
  });

  it('renders the Profile summary shell', () => {
    const screen = renderWithTheme(<ProfileScreen />);

    expect(screen.getByText('Ava Traveler')).toBeTruthy();
    expect(screen.getByText('ava@example.com')).toBeTruthy();
  });
});
