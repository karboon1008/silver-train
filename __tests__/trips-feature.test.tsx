import { describe, expect, it } from '@jest/globals';
import { mockTripList } from '../src/mocks/trips';
import { mockTripDetail, mockTripDetails } from '../src/mocks/trip-detail';

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../src/core/theme/theme-provider';
import { TransportPill } from '../src/core/components/transport-pill';
import { CategoryBadge } from '../src/core/components/category-badge';

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
