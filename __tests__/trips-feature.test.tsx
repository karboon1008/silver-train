import { describe, expect, it } from '@jest/globals';
import { mockTripList } from '../src/mocks/trips';
import { mockTripDetail, mockTripDetails } from '../src/mocks/trip-detail';

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/core/theme/theme-provider';
import { TransportPill } from '../src/core/components/transport-pill';
import { CategoryBadge } from '../src/core/components/category-badge';
import { TripCard } from '../src/features/trips/components/trip-card';
import { DayStrip } from '../src/features/trips/components/day-strip';

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

  it('stop with transport has correct segment shape', () => {
    const stopWithTransport = mockTripDetail.days[0].stops[1];
    expect(stopWithTransport.transport).toMatchObject({
      mode: expect.stringMatching(/^(walk|metro|bus|taxi)$/),
      durationMin: expect.any(Number),
      routeLabel: expect.any(String),
    });
  });
});

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

import { StopCard } from '../src/features/trips/components/stop-card';
import TripDetailScreen from '../src/features/trips/screens/trip-detail';
import PlaceDetailScreen from '../src/features/trips/screens/place-detail';

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
    expect(getByText('★ 4.7')).toBeTruthy();
    expect(getByText('€29.40')).toBeTruthy();
    expect(getByText('9:00 AM – 11:45 PM')).toBeTruthy();
  });
});
