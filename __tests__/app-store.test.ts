import { beforeEach, describe, expect, it } from '@jest/globals';
import { defaultAppState, useAppStore } from '../src/store/app-store';
import { mockTripDetail } from '../src/mocks/trip-detail';
import type { Stop } from '../src/types/trips';

const newStop: Stop = {
  id: 'new-stop',
  scheduledTime: '5:00 PM',
  orderIndex: 99,
  remark: '',
  place: {
    id: 'np1',
    name: 'Test Place',
    category: 'landmark',
    thumbnailEmoji: '📍',
    lat: 0,
    lng: 0,
    rating: 4.0,
    openingHours: '9:00 AM – 5:00 PM',
    admissionPrice: 'Free',
  },
  transport: null,
};

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ ...defaultAppState, trips: [] });
  });

  it('sets isAuthenticated and user on signIn', async () => {
    await useAppStore.getState().signIn('test@example.com', 'pass123');
    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().user?.email).toBe('test@example.com');
  });

  it('clears isAuthenticated on signOut', async () => {
    await useAppStore.getState().signIn('test@example.com', 'pass123');
    useAppStore.getState().signOut();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });

  it('stores theme preference', () => {
    useAppStore.getState().setThemePreference('dark');
    expect(useAppStore.getState().themePreference).toBe('dark');
  });

  it('addTrip appends a TripDetail', () => {
    useAppStore.getState().addTrip(mockTripDetail);
    expect(useAppStore.getState().trips).toHaveLength(1);
    expect(useAppStore.getState().trips[0]!.trip.id).toBe('1');
  });

  it('updateTrip patches the trip name', () => {
    useAppStore.setState({ trips: [mockTripDetail] });
    useAppStore.getState().updateTrip('1', { name: 'Updated Name' });
    expect(useAppStore.getState().trips[0]!.trip.name).toBe('Updated Name');
  });

  it('deleteTrip removes the trip', () => {
    useAppStore.setState({ trips: [mockTripDetail] });
    useAppStore.getState().deleteTrip('1');
    expect(useAppStore.getState().trips).toHaveLength(0);
  });

  it('addStop appends a stop to the correct day', () => {
    useAppStore.setState({ trips: [mockTripDetail] });
    useAppStore.getState().addStop('1', 'd1', newStop);
    const day = useAppStore.getState().trips[0]!.days.find((d) => d.id === 'd1')!;
    expect(day.stops.some((s) => s.id === 'new-stop')).toBe(true);
  });

  it('removeStop removes a stop from the day', () => {
    useAppStore.setState({ trips: [mockTripDetail] });
    const before = mockTripDetail.days[0]!.stops.length;
    useAppStore.getState().removeStop('1', 'd1', 's1');
    const day = useAppStore.getState().trips[0]!.days.find((d) => d.id === 'd1')!;
    expect(day.stops).toHaveLength(before - 1);
    expect(day.stops.some((s) => s.id === 's1')).toBe(false);
  });

  it('updateRemark changes the remark on the correct stop', () => {
    useAppStore.setState({ trips: [mockTripDetail] });
    useAppStore.getState().updateRemark('1', 's1', 'New remark');
    const stop = useAppStore
      .getState()
      .trips[0]!.days.flatMap((d) => d.stops)
      .find((s) => s.id === 's1')!;
    expect(stop.remark).toBe('New remark');
  });
});
