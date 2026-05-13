# Smart Travel Planner

A React Native travel planning app built with Expo Router. Plan trips, browse day-by-day itineraries, and view stop details — all with a clean, theme-aware UI.

## Features

- **Trip List** — browse upcoming, past, and draft trips with cover emoji, status badge, and stop count
- **Trip Detail** — map hero placeholder, scrollable day strip, and a timeline of stop cards with transport segments
- **Place Detail** — place info (rating, hours, admission), category badge, and an editable personal note
- **Dark mode** — full light/dark theme support via system setting

## Tech Stack

- [Expo](https://expo.dev) ~53 / [Expo Router](https://expo.github.io/router) v5 (file-based routing)
- React Native 0.79 · React 19 · TypeScript
- [Zustand](https://zustand-demo.pmnd.rs) for state management
- Jest + React Testing Library for unit tests

## Project Structure

```
app/                        # Expo Router file-based routes
  (auth)/                   # Welcome, sign-in, sign-up screens
  (tabs)/                   # Bottom tab navigator
    trips/                  # Nested Stack: list → detail → place detail
src/
  core/components/          # Shared UI primitives (AppText, AppCard, etc.)
  core/theme/               # Token system + light/dark semantic colours
  features/trips/           # Trip-specific components and screens
  mocks/                    # Static mock data (no backend required)
  types/trips.ts            # Shared TypeScript types
  services/                 # Stub service clients (Supabase, OpenAI, Maps)
__tests__/                  # Jest test suites
```

## Getting Started

**Prerequisites:** Node 18+, [Expo Go](https://expo.dev/go) on your device or a simulator.

```bash
npm install
npm start          # starts Metro bundler
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

## Running Tests

```bash
npm test
```

29 tests across 5 suites — all passing.
