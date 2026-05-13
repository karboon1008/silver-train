# Smart Travel Planner — Trips Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Trips feature UI — enhanced Trip List with navigation, Trip Detail screen with map hero / day strip / activity timeline, and Place Detail screen — all backed by rich mock data with no live backend.

**Architecture:** Convert the flat `app/(tabs)/trips.tsx` route into a nested Stack (`trips/index.tsx` → `trips/[id].tsx` → `trips/[id]/place/[placeId].tsx`). Shared types live in `src/types/trips.ts`. Feature screens compose new core components (`TransportPill`, `CategoryBadge`, `MapHero`) and feature components (`DayStrip`, `StopCard`). Route files stay thin; all product logic lives in `src/features/trips/screens/` and `src/features/trips/components/`. Every task is TDD: write the failing test first, implement, verify green.

**Tech Stack:** Expo Router v5 · React Native · TypeScript · Zustand · Jest · React Testing Library

---

## File Structure

**Created:**
- `src/types/trips.ts` — shared TypeScript types (Trip, Day, Stop, Place, TransportSegment, etc.)
- `src/mocks/trip-detail.ts` — rich mock: Paris Weekend trip with 2 days, 5 stops, 5 places
- `src/core/components/transport-pill.tsx` — colour-coded transport mode pill
- `src/core/components/category-badge.tsx` — place category tag with emoji
- `src/core/components/map-hero.tsx` — static map placeholder with expand shell
- `src/features/trips/components/day-strip.tsx` — horizontal scrollable day selector pills
- `src/features/trips/components/stop-card.tsx` — 3-row activity timeline card
- `src/features/trips/screens/trip-detail.tsx` — composable Trip Detail screen (not a route)
- `src/features/trips/screens/place-detail.tsx` — composable Place Detail screen (not a route)
- `app/(tabs)/trips/_layout.tsx` — Stack layout for the trips tab
- `app/(tabs)/trips/index.tsx` — Trip List route (replaces trips.tsx)
- `app/(tabs)/trips/[id].tsx` — Trip Detail route
- `app/(tabs)/trips/[id]/place/[placeId].tsx` — Place Detail route
- `__tests__/trips-feature.test.tsx` — all new component and screen tests

**Modified:**
- `src/mocks/trips.ts` — replace flat mock shape with typed `Trip[]` + named `mockTripList`
- `src/features/trips/components/trip-card.tsx` — new Trip type, cover emoji, stop count, status badge, `onPress`
- `src/core/constants/routes.ts` — add `tripDetail()` and `placeDetail()` helpers
- `app/(tabs)/trips.tsx` — **deleted** (content moves to `app/(tabs)/trips/index.tsx`)

---

### Task 1: Add Shared Trip Types and Rich Mock Data

**Files:**
- Create: `src/types/trips.ts`
- Modify: `src/mocks/trips.ts`
- Create: `src/mocks/trip-detail.ts`
- Create: `__tests__/trips-feature.test.tsx`

- [ ] **Step 1: Write the failing mock-shape test**

Create `__tests__/trips-feature.test.tsx`:

```tsx
import { describe, expect, it } from '@jest/globals';
import { mockTripList } from '../src/mocks/trips';
import { mockTripDetail, mockTripDetails } from '../src/mocks/trip-detail';

describe('mock data shapes', () => {
  it('trip list entries have all required fields', () => {
    const trip = mockTripList[0];
    expect(trip).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      destination: expect.any(String),
      startDate: expect.any(String),
      endDate: expect.any(String),
      status: expect.stringMatching(/^(upcoming|past|draft)$/),
      coverEmoji: expect.any(String),
      stopCount: expect.any(Number),
      statusLabel: expect.any(String),
      aiGenerated: expect.any(Boolean),
    });
  });

  it('trip detail has days with stops and places', () => {
    expect(mockTripDetail.days.length).toBeGreaterThan(0);
    const stop = mockTripDetail.days[0].stops[0];
    expect(stop).toMatchObject({
      id: expect.any(String),
      scheduledTime: expect.any(String),
      orderIndex: expect.any(Number),
      remark: expect.any(String),
      place: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
        thumbnailEmoji: expect.any(String),
      }),
    });
  });

  it('mockTripDetails lookup works by trip id', () => {
    expect(mockTripDetails['1']).toBe(mockTripDetail);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: FAIL — `mockTripList` is not exported from `src/mocks/trips` and `src/mocks/trip-detail` does not exist.

- [ ] **Step 3: Create the shared types**

Create `src/types/trips.ts`:

```ts
export type TripStatus = 'upcoming' | 'past' | 'draft';

export type TransportMode = 'walk' | 'metro' | 'bus' | 'taxi';

export type StopCategory =
  | 'landmark'
  | 'accommodation'
  | 'mall'
  | 'station'
  | 'restaurant'
  | 'nature'
  | 'entertainment';

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  coverEmoji: string;
  stopCount: number;
  statusLabel: string;
  aiGenerated: boolean;
};

export type Place = {
  id: string;
  name: string;
  category: StopCategory;
  thumbnailEmoji: string;
  lat: number;
  lng: number;
  rating: number;
  openingHours: string;
  admissionPrice: string;
};

export type TransportSegment = {
  mode: TransportMode;
  durationMin: number;
  routeLabel: string;
};

export type Stop = {
  id: string;
  scheduledTime: string;
  orderIndex: number;
  remark: string;
  place: Place;
  transport: TransportSegment | null;
};

export type TripDay = {
  id: string;
  date: string;
  dayNumber: number;
  stops: Stop[];
};

export type TripDetail = {
  trip: Trip;
  days: TripDay[];
};
```

- [ ] **Step 4: Update trips mock**

Replace `src/mocks/trips.ts` entirely:

```ts
import type { Trip } from '../types/trips';

export const mockTripList: Trip[] = [
  {
    id: '1',
    name: 'Paris Weekend',
    destination: 'Paris, France',
    startDate: '2026-05-20',
    endDate: '2026-05-23',
    status: 'upcoming',
    coverEmoji: '🗼',
    stopCount: 5,
    statusLabel: 'In 7 days',
    aiGenerated: false,
  },
  {
    id: '2',
    name: 'Kyoto Draft',
    destination: 'Kyoto, Japan',
    startDate: '',
    endDate: '',
    status: 'draft',
    coverEmoji: '⛩️',
    stopCount: 0,
    statusLabel: 'Draft',
    aiGenerated: true,
  },
];

export const mockTrips = {
  Upcoming: mockTripList.filter((t) => t.status === 'upcoming'),
  Past: mockTripList.filter((t) => t.status === 'past'),
  Drafts: mockTripList.filter((t) => t.status === 'draft'),
} as const;
```

- [ ] **Step 5: Create the trip detail mock**

Create `src/mocks/trip-detail.ts`:

```ts
import type { TripDetail } from '../types/trips';

export const mockTripDetail: TripDetail = {
  trip: {
    id: '1',
    name: 'Paris Weekend',
    destination: 'Paris, France',
    startDate: '2026-05-20',
    endDate: '2026-05-23',
    status: 'upcoming',
    coverEmoji: '🗼',
    stopCount: 5,
    statusLabel: 'In 7 days',
    aiGenerated: false,
  },
  days: [
    {
      id: 'd1',
      date: '2026-05-20',
      dayNumber: 1,
      stops: [
        {
          id: 's1',
          scheduledTime: '9:00 AM',
          orderIndex: 0,
          remark: '',
          place: {
            id: 'p1',
            name: 'Eiffel Tower',
            category: 'landmark',
            thumbnailEmoji: '🗼',
            lat: 48.8584,
            lng: 2.2945,
            rating: 4.7,
            openingHours: '9:00 AM – 11:45 PM',
            admissionPrice: '€29.40',
          },
          transport: null,
        },
        {
          id: 's2',
          scheduledTime: '11:30 AM',
          orderIndex: 1,
          remark: 'Book tickets 2 days early',
          place: {
            id: 'p2',
            name: "Musée d'Orsay",
            category: 'landmark',
            thumbnailEmoji: '🏛️',
            lat: 48.8599,
            lng: 2.3266,
            rating: 4.8,
            openingHours: '9:30 AM – 6:00 PM',
            admissionPrice: '€16',
          },
          transport: { mode: 'walk', durationMin: 18, routeLabel: 'from Eiffel Tower' },
        },
        {
          id: 's3',
          scheduledTime: '1:30 PM',
          orderIndex: 2,
          remark: '',
          place: {
            id: 'p3',
            name: 'Café de Flore',
            category: 'restaurant',
            thumbnailEmoji: '☕',
            lat: 48.854,
            lng: 2.333,
            rating: 4.3,
            openingHours: '7:00 AM – 1:30 AM',
            admissionPrice: 'Free entry',
          },
          transport: { mode: 'metro', durationMin: 12, routeLabel: 'Line 4 · Odéon' },
        },
      ],
    },
    {
      id: 'd2',
      date: '2026-05-21',
      dayNumber: 2,
      stops: [
        {
          id: 's4',
          scheduledTime: '10:00 AM',
          orderIndex: 0,
          remark: '',
          place: {
            id: 'p4',
            name: 'Louvre Museum',
            category: 'landmark',
            thumbnailEmoji: '🏺',
            lat: 48.8606,
            lng: 2.3376,
            rating: 4.7,
            openingHours: '9:00 AM – 6:00 PM',
            admissionPrice: '€17',
          },
          transport: null,
        },
        {
          id: 's5',
          scheduledTime: '3:00 PM',
          orderIndex: 1,
          remark: 'Try the rooftop view',
          place: {
            id: 'p5',
            name: 'Centre Pompidou',
            category: 'entertainment',
            thumbnailEmoji: '🎨',
            lat: 48.8606,
            lng: 2.3522,
            rating: 4.5,
            openingHours: '11:00 AM – 9:00 PM',
            admissionPrice: '€14',
          },
          transport: { mode: 'walk', durationMin: 10, routeLabel: 'from Louvre' },
        },
      ],
    },
  ],
};

export const mockTripDetails: Record<string, TripDetail> = {
  '1': mockTripDetail,
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: PASS — 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/types/trips.ts src/mocks/trips.ts src/mocks/trip-detail.ts __tests__/trips-feature.test.tsx
git commit -m "feat: add Trip types and rich Paris Weekend mock data"
```

---

### Task 2: Build TransportPill and CategoryBadge Core Components

**Files:**
- Create: `src/core/components/transport-pill.tsx`
- Create: `src/core/components/category-badge.tsx`
- Modify: `__tests__/trips-feature.test.tsx`

- [ ] **Step 1: Add component tests**

Add to the bottom of `__tests__/trips-feature.test.tsx` (keep all existing `describe` blocks, just append):

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/core/theme/theme-provider';
import { TransportPill } from '../src/core/components/transport-pill';
import { CategoryBadge } from '../src/core/components/category-badge';

describe('TransportPill', () => {
  it('renders walk duration and route label', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TransportPill mode="walk" durationMin={18} routeLabel="from Eiffel Tower" />
      </ThemeProvider>,
    );
    expect(getByText('18 min')).toBeTruthy();
    expect(getByText('from Eiffel Tower')).toBeTruthy();
  });

  it('renders metro duration', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TransportPill mode="metro" durationMin={12} routeLabel="Line 4" />
      </ThemeProvider>,
    );
    expect(getByText('12 min')).toBeTruthy();
  });
});

describe('CategoryBadge', () => {
  it('renders landmark label', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CategoryBadge category="landmark" />
      </ThemeProvider>,
    );
    expect(getByText('Landmark')).toBeTruthy();
  });

  it('renders restaurant label', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CategoryBadge category="restaurant" />
      </ThemeProvider>,
    );
    expect(getByText('Restaurant')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: FAIL — `TransportPill` and `CategoryBadge` modules not found.

- [ ] **Step 3: Create TransportPill**

Create `src/core/components/transport-pill.tsx`:

```tsx
import { View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';
import type { TransportMode } from '../../types/trips';

const TRANSPORT_CONFIG: Record<TransportMode, { emoji: string; color: string }> = {
  walk: { emoji: '🚶', color: '#34C759' },
  metro: { emoji: '🚇', color: '#007AFF' },
  bus: { emoji: '🚌', color: '#007AFF' },
  taxi: { emoji: '🚕', color: '#FF9500' },
};

type Props = {
  mode: TransportMode;
  durationMin: number;
  routeLabel: string;
};

export function TransportPill({ mode, durationMin, routeLabel }: Props) {
  const theme = useAppTheme();
  const config = TRANSPORT_CONFIG[mode];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: 3,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: `${config.color}20`,
        alignSelf: 'flex-start',
      }}
    >
      <AppText variant="caption">{config.emoji}</AppText>
      <AppText
        variant="caption"
        weight="600"
        style={{ color: config.color }}
      >
        {durationMin} min
      </AppText>
      <AppText variant="caption" tone="muted">
        {routeLabel}
      </AppText>
    </View>
  );
}
```

- [ ] **Step 4: Create CategoryBadge**

Create `src/core/components/category-badge.tsx`:

```tsx
import { View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';
import type { StopCategory } from '../../types/trips';

const CATEGORY_CONFIG: Record<StopCategory, { emoji: string; label: string }> = {
  landmark: { emoji: '🏛️', label: 'Landmark' },
  accommodation: { emoji: '🏨', label: 'Accommodation' },
  mall: { emoji: '🛍️', label: 'Mall' },
  station: { emoji: '🚉', label: 'Station' },
  restaurant: { emoji: '🍽️', label: 'Restaurant' },
  nature: { emoji: '🌿', label: 'Nature' },
  entertainment: { emoji: '🎭', label: 'Entertainment' },
};

type Props = {
  category: StopCategory;
};

export function CategoryBadge({ category }: Props) {
  const theme = useAppTheme();
  const config = CATEGORY_CONFIG[category];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: 3,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: theme.semantic.surface,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        alignSelf: 'flex-start',
      }}
    >
      <AppText variant="caption">{config.emoji}</AppText>
      <AppText variant="label" weight="600">
        {config.label}
      </AppText>
    </View>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: PASS — all previous tests still pass, plus 4 new ones.

- [ ] **Step 6: Commit**

```bash
git add src/core/components/transport-pill.tsx src/core/components/category-badge.tsx __tests__/trips-feature.test.tsx
git commit -m "feat: add TransportPill and CategoryBadge core components"
```

---

### Task 3: Enhance TripCard and Build DayStrip

**Files:**
- Modify: `src/features/trips/components/trip-card.tsx`
- Create: `src/features/trips/components/day-strip.tsx`
- Modify: `__tests__/trips-feature.test.tsx`

- [ ] **Step 1: Add TripCard and DayStrip tests**

Append to `__tests__/trips-feature.test.tsx`:

```tsx
import { TripCard } from '../src/features/trips/components/trip-card';
import { DayStrip } from '../src/features/trips/components/day-strip';
import { mockTripList } from '../src/mocks/trips';
import { mockTripDetail } from '../src/mocks/trip-detail';

describe('TripCard', () => {
  it('renders trip name, destination, and status label', () => {
    const trip = mockTripList[0];
    const { getByText } = render(
      <ThemeProvider>
        <TripCard trip={trip} onPress={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('Paris Weekend')).toBeTruthy();
    expect(getByText('Paris, France')).toBeTruthy();
    expect(getByText('In 7 days')).toBeTruthy();
  });

  it('renders cover emoji', () => {
    const trip = mockTripList[0];
    const { getByText } = render(
      <ThemeProvider>
        <TripCard trip={trip} onPress={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('🗼')).toBeTruthy();
  });
});

describe('DayStrip', () => {
  it('renders all day pills with correct labels', () => {
    const { getByText } = render(
      <ThemeProvider>
        <DayStrip days={mockTripDetail.days} activeDay="d1" onDayPress={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('Day 1')).toBeTruthy();
    expect(getByText('Day 2')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: FAIL — `TripCard` `onPress` prop does not exist yet and `DayStrip` module not found.

- [ ] **Step 3: Replace TripCard**

Replace `src/features/trips/components/trip-card.tsx` entirely:

```tsx
import { Pressable, View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Trip } from '@/types/trips';

type Props = {
  trip: Trip;
  onPress: () => void;
};

export function TripCard({ trip, onPress }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: theme.radii.sm,
              backgroundColor: theme.semantic.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="title">{trip.coverEmoji}</AppText>
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText variant="body" weight="600">
              {trip.name}
            </AppText>
            <AppText variant="label" tone="muted">
              {trip.destination}
            </AppText>
          </View>
          <View
            style={{
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              borderRadius: theme.radii.pill,
              backgroundColor: `${theme.semantic.accent}25`,
            }}
          >
            <AppText variant="caption" weight="600" style={{ color: theme.semantic.accent }}>
              {trip.statusLabel}
            </AppText>
          </View>
        </View>
        {trip.stopCount > 0 && (
          <AppText variant="label" tone="muted">
            {trip.stopCount} {trip.stopCount === 1 ? 'stop' : 'stops'} ·{' '}
            {trip.startDate} – {trip.endDate}
          </AppText>
        )}
      </AppCard>
    </Pressable>
  );
}
```

- [ ] **Step 4: Create DayStrip**

Create `src/features/trips/components/day-strip.tsx`:

```tsx
import { ScrollView, Pressable, View } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { TripDay } from '@/types/trips';

type Props = {
  days: TripDay[];
  activeDay: string;
  onDayPress: (dayId: string) => void;
};

export function DayStrip({ days, activeDay, onDayPress }: Props) {
  const theme = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: theme.spacing.sm }}
    >
      {days.map((day) => {
        const isActive = day.id === activeDay;
        return (
          <Pressable
            key={day.id}
            onPress={() => onDayPress(day.id)}
            style={{
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radii.pill,
              backgroundColor: isActive ? theme.semantic.text : theme.semantic.surface,
              borderWidth: 1,
              borderColor: isActive ? theme.semantic.text : theme.semantic.border,
              alignItems: 'center',
            }}
          >
            <AppText
              variant="label"
              weight="600"
              style={{ color: isActive ? theme.semantic.background : theme.semantic.text }}
            >
              {`Day ${day.dayNumber}`}
            </AppText>
            <AppText
              variant="caption"
              style={{ color: isActive ? theme.semantic.background : theme.semantic.mutedText }}
            >
              {day.date.slice(5)}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: PASS — all previous tests still pass, plus 3 new ones.

- [ ] **Step 6: Commit**

```bash
git add src/features/trips/components/trip-card.tsx src/features/trips/components/day-strip.tsx __tests__/trips-feature.test.tsx
git commit -m "feat: enhance TripCard with new shape and add DayStrip"
```

---

### Task 4: Build StopCard and MapHero

**Files:**
- Create: `src/features/trips/components/stop-card.tsx`
- Create: `src/core/components/map-hero.tsx`
- Modify: `__tests__/trips-feature.test.tsx`

- [ ] **Step 1: Add StopCard tests**

Append to `__tests__/trips-feature.test.tsx`:

```tsx
import { StopCard } from '../src/features/trips/components/stop-card';

describe('StopCard', () => {
  it('renders place name and scheduled time', () => {
    const stop = mockTripDetail.days[0].stops[0];
    const { getByText } = render(
      <ThemeProvider>
        <StopCard stop={stop} isFirst isLast={false} />
      </ThemeProvider>,
    );
    expect(getByText('Eiffel Tower')).toBeTruthy();
    expect(getByText('9:00 AM')).toBeTruthy();
  });

  it('renders category badge', () => {
    const stop = mockTripDetail.days[0].stops[0];
    const { getByText } = render(
      <ThemeProvider>
        <StopCard stop={stop} isFirst isLast={false} />
      </ThemeProvider>,
    );
    expect(getByText('Landmark')).toBeTruthy();
  });

  it('renders transport pill when transport is present', () => {
    const stop = mockTripDetail.days[0].stops[1];
    const { getByText } = render(
      <ThemeProvider>
        <StopCard stop={stop} isFirst={false} isLast={false} />
      </ThemeProvider>,
    );
    expect(getByText('18 min')).toBeTruthy();
    expect(getByText('from Eiffel Tower')).toBeTruthy();
  });

  it('renders remark text when remark is set', () => {
    const stop = mockTripDetail.days[0].stops[1];
    const { getByText } = render(
      <ThemeProvider>
        <StopCard stop={stop} isFirst={false} isLast={false} />
      </ThemeProvider>,
    );
    expect(getByText('Book tickets 2 days early')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: FAIL — `StopCard` module not found.

- [ ] **Step 3: Create StopCard**

Create `src/features/trips/components/stop-card.tsx`:

```tsx
import { Pressable, View } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { CategoryBadge } from '@/core/components/category-badge';
import { TransportPill } from '@/core/components/transport-pill';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Stop } from '@/types/trips';

const TIMELINE_DOT_COLORS = ['#34C759', '#007AFF', '#FF9500', '#8E8E93'] as const;

type Props = {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  onPress?: () => void;
};

export function StopCard({ stop, isFirst, isLast, onPress }: Props) {
  const theme = useAppTheme();
  const dotColor = TIMELINE_DOT_COLORS[stop.orderIndex % TIMELINE_DOT_COLORS.length];

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
      {/* Timeline connector column */}
      <View style={{ alignItems: 'center', width: 20, paddingTop: theme.spacing.md }}>
        <View
          style={{
            width: 1,
            height: 12,
            backgroundColor: isFirst ? 'transparent' : theme.semantic.border,
          }}
        />
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
          }}
        />
        <View
          style={{
            width: 1,
            flex: 1,
            backgroundColor: isLast ? 'transparent' : theme.semantic.border,
          }}
        />
      </View>

      {/* Card body */}
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          backgroundColor: theme.semantic.surface,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          marginBottom: theme.spacing.sm,
          gap: theme.spacing.xs,
          ...theme.shadows.card,
        }}
      >
        {/* Row 1: emoji thumbnail + place name + time */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: theme.semantic.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="body">{stop.place.thumbnailEmoji}</AppText>
          </View>
          <AppText variant="body" weight="500" style={{ flex: 1 }} numberOfLines={1}>
            {stop.place.name}
          </AppText>
          <AppText variant="label" tone="muted">
            {stop.scheduledTime}
          </AppText>
        </View>

        {/* Row 2: category badge + remark */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
          <CategoryBadge category={stop.place.category} />
          {stop.remark !== '' && (
            <AppText
              variant="label"
              tone="muted"
              style={{ fontStyle: 'italic', flex: 1 }}
              numberOfLines={1}
            >
              {stop.remark}
            </AppText>
          )}
        </View>

        {/* Row 3: transport pill */}
        {stop.transport !== null && (
          <TransportPill
            mode={stop.transport.mode}
            durationMin={stop.transport.durationMin}
            routeLabel={stop.transport.routeLabel}
          />
        )}
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Create MapHero**

Create `src/core/components/map-hero.tsx`:

```tsx
import { Pressable, View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type Props = {
  destination: string;
  onExpand: () => void;
};

export function MapHero({ destination, onExpand }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onExpand}
      style={{
        height: 90,
        borderRadius: theme.radii.md,
        backgroundColor: theme.semantic.card,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
        <AppText variant="title">🗺️</AppText>
        <AppText variant="label" tone="muted">
          {destination} · Tap to expand
        </AppText>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: PASS — all previous tests still pass, plus 4 new ones.

- [ ] **Step 6: Commit**

```bash
git add src/features/trips/components/stop-card.tsx src/core/components/map-hero.tsx __tests__/trips-feature.test.tsx
git commit -m "feat: add StopCard with timeline connector and MapHero placeholder"
```

---

### Task 5: Build TripDetail and PlaceDetail Screens

**Files:**
- Create: `src/features/trips/screens/trip-detail.tsx`
- Create: `src/features/trips/screens/place-detail.tsx`
- Modify: `__tests__/trips-feature.test.tsx`

- [ ] **Step 1: Add screen tests**

Append to `__tests__/trips-feature.test.tsx`:

```tsx
import TripDetailScreen from '../src/features/trips/screens/trip-detail';
import PlaceDetailScreen from '../src/features/trips/screens/place-detail';

describe('TripDetailScreen', () => {
  it('renders trip name, map hero, and all days', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TripDetailScreen tripDetail={mockTripDetail} onStopPress={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('Paris Weekend')).toBeTruthy();
    expect(getByText('Day 1')).toBeTruthy();
    expect(getByText('Day 2')).toBeTruthy();
  });

  it('renders stops for the default active day', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TripDetailScreen tripDetail={mockTripDetail} onStopPress={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('Eiffel Tower')).toBeTruthy();
  });
});

describe('PlaceDetailScreen', () => {
  it('renders place name, category badge, rating, and hours', () => {
    const place = mockTripDetail.days[0].stops[0].place;
    const { getByText } = render(
      <ThemeProvider>
        <PlaceDetailScreen place={place} remark="" onRemarkChange={() => undefined} />
      </ThemeProvider>,
    );
    expect(getByText('Eiffel Tower')).toBeTruthy();
    expect(getByText('Landmark')).toBeTruthy();
    expect(getByText('4.7')).toBeTruthy();
    expect(getByText('€29.40')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: FAIL — `TripDetailScreen` and `PlaceDetailScreen` modules not found.

- [ ] **Step 3: Create TripDetailScreen**

Create `src/features/trips/screens/trip-detail.tsx`:

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { MapHero } from '@/core/components/map-hero';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import { DayStrip } from '../components/day-strip';
import { StopCard } from '../components/stop-card';
import type { Stop, TripDetail } from '@/types/trips';

type Props = {
  tripDetail: TripDetail;
  onStopPress: (stop: Stop) => void;
};

export default function TripDetailScreen({ tripDetail, onStopPress }: Props) {
  const { trip, days } = tripDetail;
  const theme = useAppTheme();
  const [activeDayId, setActiveDayId] = useState(days[0]?.id ?? '');
  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];

  return (
    <Screen scroll>
      <SectionHeader
        title={trip.name}
        subtitle={trip.startDate !== '' ? `${trip.startDate} – ${trip.endDate}` : 'Unscheduled'}
      />
      <MapHero destination={trip.destination} onExpand={() => undefined} />
      <DayStrip days={days} activeDay={activeDayId} onDayPress={setActiveDayId} />
      {activeDay !== undefined && (
        <View style={{ marginTop: theme.spacing.sm }}>
          {activeDay.stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              isFirst={index === 0}
              isLast={index === activeDay.stops.length - 1}
              onPress={() => onStopPress(stop)}
            />
          ))}

          {/* Add stop row */}
          <View
            style={{
              marginTop: theme.spacing.xs,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              borderWidth: 1,
              borderColor: theme.semantic.border,
              borderStyle: 'dashed',
              alignItems: 'center',
            }}
          >
            <AppText variant="body" tone="muted">
              ＋ Add a stop
            </AppText>
          </View>

          {/* AI suggest button */}
          <View
            style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              backgroundColor: `${theme.semantic.accent}18`,
              alignItems: 'center',
            }}
          >
            <AppText
              variant="body"
              weight="600"
              style={{ color: theme.semantic.accent }}
            >
              {`✦ Suggest more stops for Day ${activeDay.dayNumber}`}
            </AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}
```

- [ ] **Step 4: Create PlaceDetailScreen**

Create `src/features/trips/screens/place-detail.tsx`:

```tsx
import { View, TextInput } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { CategoryBadge } from '@/core/components/category-badge';
import { Screen } from '@/core/components/screen';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Place } from '@/types/trips';

type Props = {
  place: Place;
  remark: string;
  onRemarkChange: (value: string) => void;
};

export default function PlaceDetailScreen({ place, remark, onRemarkChange }: Props) {
  const theme = useAppTheme();

  const infoRows = [
    { label: 'Rating', value: String(place.rating) },
    { label: 'Hours', value: place.openingHours },
    { label: 'Admission', value: place.admissionPrice },
  ];

  return (
    <Screen scroll>
      {/* Hero placeholder */}
      <View
        style={{
          height: 110,
          borderRadius: theme.radii.md,
          backgroundColor: theme.semantic.card,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
        }}
      >
        <AppText style={{ fontSize: 48 }}>{place.thumbnailEmoji}</AppText>
      </View>

      {/* Name row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.md,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.semantic.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="body">{place.thumbnailEmoji}</AppText>
        </View>
        <AppText variant="title" weight="600" style={{ flex: 1 }}>
          {place.name}
        </AppText>
      </View>

      {/* Category badge */}
      <CategoryBadge category={place.category} />

      {/* Editable remark */}
      <View
        style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.semantic.surface,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          gap: theme.spacing.xs,
        }}
      >
        <AppText variant="label" tone="muted">
          ✎ Note
        </AppText>
        <TextInput
          value={remark}
          onChangeText={onRemarkChange}
          placeholder="Add a note about this place…"
          placeholderTextColor={theme.semantic.mutedText}
          multiline
          style={{
            color: theme.semantic.text,
            fontSize: theme.typography.body,
            fontStyle: remark === '' ? 'italic' : 'normal',
          }}
        />
      </View>

      {/* Info rows */}
      <View
        style={{
          marginTop: theme.spacing.lg,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.semantic.surface,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          overflow: 'hidden',
        }}
      >
        {infoRows.map((row, i) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: theme.spacing.md,
              borderBottomWidth: i < infoRows.length - 1 ? 1 : 0,
              borderBottomColor: theme.semantic.border,
            }}
          >
            <AppText variant="body" tone="muted">
              {row.label}
            </AppText>
            <AppText variant="body" weight="500">
              {row.value}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- --runTestsByPath __tests__/trips-feature.test.tsx --forceExit`
Expected: PASS — all previous tests still pass, plus 3 new ones.

- [ ] **Step 6: Commit**

```bash
git add src/features/trips/screens/trip-detail.tsx src/features/trips/screens/place-detail.tsx __tests__/trips-feature.test.tsx
git commit -m "feat: add TripDetailScreen and PlaceDetailScreen"
```

---

### Task 6: Restructure Trips Routes and Wire Navigation

**Files:**
- Create: `app/(tabs)/trips/_layout.tsx`
- Create: `app/(tabs)/trips/index.tsx`
- Create: `app/(tabs)/trips/[id].tsx`
- Create: `app/(tabs)/trips/[id]/place/[placeId].tsx`
- Modify: `src/core/constants/routes.ts`
- Delete: `app/(tabs)/trips.tsx`

> **Note:** After creating `app/(tabs)/trips/index.tsx`, manually delete `app/(tabs)/trips.tsx`. Expo Router cannot have both a file and a same-named directory. Deleting the file is required before running the app or tests.

- [ ] **Step 1: Update routes constants**

Replace `src/core/constants/routes.ts` entirely:

```ts
export const routes = {
  welcome: '/(auth)/welcome' as const,
  signIn: '/(auth)/sign-in' as const,
  signUp: '/(auth)/sign-up' as const,
  trips: '/(tabs)/trips' as const,
  tripDetail: (id: string) => `/(tabs)/trips/${id}` as const,
  placeDetail: (tripId: string, placeId: string) =>
    `/(tabs)/trips/${tripId}/place/${placeId}` as const,
  explore: '/(tabs)/explore' as const,
  profile: '/(tabs)/profile' as const,
};
```

- [ ] **Step 2: Create the trips stack layout**

Create `app/(tabs)/trips/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { useAppTheme } from '@/core/theme/theme-provider';

export default function TripsLayout() {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.semantic.background },
      }}
    />
  );
}
```

- [ ] **Step 3: Create the trips list index route**

Create `app/(tabs)/trips/index.tsx`:

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { FloatingActionButton } from '@/core/components/floating-action-button';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { SegmentedControl } from '@/core/components/segmented-control';
import { TripCard } from '@/features/trips/components/trip-card';
import { mockTrips } from '@/mocks/trips';
import { routes } from '@/core/constants/routes';
import type { Trip } from '@/types/trips';

type TripSegment = 'Upcoming' | 'Past' | 'Drafts';
const SEGMENTS = ['Upcoming', 'Past', 'Drafts'] as const satisfies readonly TripSegment[];

export default function TripsScreen() {
  const [segment, setSegment] = useState<TripSegment>('Upcoming');
  const router = useRouter();
  const trips = mockTrips[segment];

  function handleTripPress(trip: Trip) {
    router.push(routes.tripDetail(trip.id));
  }

  return (
    <Screen scroll>
      <SectionHeader title="My Trips" subtitle="Good morning" />
      <SegmentedControl options={SEGMENTS} value={segment} onChange={setSegment} />
      <View style={{ gap: 16, paddingBottom: 96 }}>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onPress={() => handleTripPress(trip)} />
          ))
        ) : (
          <EmptyState
            title={`No ${segment.toLowerCase()} trips yet`}
            description="Tap + to plan your first trip."
          />
        )}
      </View>
      <FloatingActionButton label="Plan a trip" onPress={() => undefined} />
    </Screen>
  );
}
```

- [ ] **Step 4: Create the trip detail route**

Create `app/(tabs)/trips/[id].tsx`:

```tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { Screen } from '@/core/components/screen';
import TripDetailScreen from '@/features/trips/screens/trip-detail';
import { mockTripDetails } from '@/mocks/trip-detail';
import { routes } from '@/core/constants/routes';
import type { Stop } from '@/types/trips';

export default function TripDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tripDetail = mockTripDetails[id];

  function handleStopPress(stop: Stop) {
    router.push(routes.placeDetail(id, stop.place.id));
  }

  if (tripDetail === undefined) {
    return (
      <Screen>
        <EmptyState title="Trip not found" description="This trip no longer exists." />
      </Screen>
    );
  }

  return <TripDetailScreen tripDetail={tripDetail} onStopPress={handleStopPress} />;
}
```

- [ ] **Step 5: Create the place detail route**

Create `app/(tabs)/trips/[id]/place/[placeId].tsx`:

```tsx
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { Screen } from '@/core/components/screen';
import PlaceDetailScreen from '@/features/trips/screens/place-detail';
import { mockTripDetails } from '@/mocks/trip-detail';

export default function PlaceDetailRoute() {
  const { id, placeId } = useLocalSearchParams<{ id: string; placeId: string }>();
  const tripDetail = mockTripDetails[id];
  const stop = tripDetail?.days.flatMap((d) => d.stops).find((s) => s.place.id === placeId);
  const [remark, setRemark] = useState(stop?.remark ?? '');

  if (stop === undefined) {
    return (
      <Screen>
        <EmptyState title="Place not found" description="This stop no longer exists." />
      </Screen>
    );
  }

  return (
    <PlaceDetailScreen place={stop.place} remark={remark} onRemarkChange={setRemark} />
  );
}
```

- [ ] **Step 6: Delete the old flat trips route**

Delete `app/(tabs)/trips.tsx`. This file must be removed — Expo Router cannot resolve both `trips.tsx` and the `trips/` directory.

Run: `del "app\(tabs)\trips.tsx"` (Windows) or `rm app/(tabs)/trips.tsx` (bash).

- [ ] **Step 7: Run the full test suite**

Run: `npm test -- --forceExit`
Expected: All tests pass. The `routes.test.tsx` still passes because it imports `app/(tabs)/trips` which now resolves to `app/(tabs)/trips/index.tsx`.

- [ ] **Step 8: Commit**

```bash
git add "app/(tabs)/trips/" src/core/constants/routes.ts
git rm "app/(tabs)/trips.tsx"
git commit -m "feat: restructure trips tab into Stack with Trip Detail and Place Detail routes"
```

---

### Task 7: Final Verification

**Files:**
- Any files from Tasks 1–6 needing narrow patches

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --forceExit`
Expected: All tests pass (prior 11 + new trips-feature tests = 20+ total).

- [ ] **Step 2: Start the Expo dev server**

Run: `npm start`
Expected: Expo CLI starts, QR code appears, no compilation errors in the terminal.

- [ ] **Step 3: Manual verification in Expo Go or simulator**

Check each behaviour:

- Trips tab loads → Enhanced cards show cover emoji (🗼 / ⛩️), status badge, and stop count
- Tap "Paris Weekend" card → navigates to Trip Detail
- Trip Detail shows map hero ("Paris, France · Tap to expand"), day strip with Day 1 / Day 2 pills, and stop cards with timeline connectors
- Tap "Day 2" pill → activity list switches to Louvre + Centre Pompidou stops
- Tap a stop card → navigates to Place Detail
- Place Detail shows place name, category badge, editable note field, and info rows (Rating / Hours / Admission)
- Back navigation works on all screens
- Dark mode (change system setting) renders consistently on all new screens

- [ ] **Step 4: Patch any issues found during Step 3**

Keep fixes narrow — do not add features not described in this plan.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: address manual verification issues from Trips feature"
```

---

## Self-Review

**Spec coverage:**
- §5.1 Trip List — cover emoji ✓, destination ✓, date range ✓, stop count ✓, status badge ✓. Swipe left (delete/archive actions) deferred — requires gesture library integration not yet in scope.
- §5.3 Trip Detail — map hero (placeholder) ✓, day strip ✓, activity list ✓, add stop row ✓, AI suggest button ✓.
- §5.4 Stop Cards — 3-row layout ✓, timeline connector dots ✓, TransportPill ✓, CategoryBadge ✓, remark text ✓.
- §5.6 Place Detail — hero placeholder ✓, name row ✓, category badge ✓, editable remark ✓, info rows (rating / hours / admission) ✓. Transport options (Getting There section with all modes) deferred — requires `transport_segments` per stop which is a backend concern.
- FAB sheet (Create Trip manual + AI) deferred to Phase 3.

**Placeholder scan:** No TBD, TODO, or "similar to Task N" patterns found.

**Type consistency:**
- `Trip`, `TripDetail`, `TripDay`, `Stop`, `Place`, `TransportSegment`, `TransportMode`, `StopCategory` — all defined once in `src/types/trips.ts`.
- `mockTripList` exported from `src/mocks/trips.ts`; `mockTripDetail` and `mockTripDetails` exported from `src/mocks/trip-detail.ts`.
- `TripDetailScreen` takes `{ tripDetail: TripDetail; onStopPress: (stop: Stop) => void }` — used consistently in Task 5 (screen) and Task 6 (route).
- `PlaceDetailScreen` takes `{ place: Place; remark: string; onRemarkChange: (v: string) => void }` — used consistently in Task 5 (screen) and Task 6 (route).
- `routes.tripDetail(id)` and `routes.placeDetail(tripId, placeId)` — defined in Task 6 Step 1 and called in Task 6 Steps 4 and 5.
