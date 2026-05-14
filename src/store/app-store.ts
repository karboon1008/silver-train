import { create } from 'zustand';
import { signInWithEmail, signUpWithEmail } from '@/services/supabase';
import { mockTripDetail } from '@/mocks/trip-detail';
import type { Trip, TripDay, TripDetail, Stop } from '@/types/trips';

export type ThemePreference = 'system' | 'light' | 'dark';

export type AppUser = {
  name: string;
  email: string;
};

export type AppState = {
  isAuthenticated: boolean;
  themePreference: ThemePreference;
  user: AppUser | null;
  trips: TripDetail[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  setThemePreference: (value: ThemePreference) => void;
  addTrip: (detail: TripDetail) => void;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addStop: (tripId: string, dayId: string, stop: Stop) => void;
  removeStop: (tripId: string, dayId: string, stopId: string) => void;
  updateRemark: (tripId: string, stopId: string, remark: string) => void;
  addDay: (tripId: string) => void;
  deleteDay: (tripId: string, dayId: string) => void;
  moveDay: (tripId: string, dayId: string, direction: 'up' | 'down') => void;
};

const defaultUser: AppUser = { name: 'Ava Traveler', email: 'ava@example.com' };

export const defaultAppState: Pick<
  AppState,
  'isAuthenticated' | 'themePreference' | 'user' | 'trips'
> = {
  isAuthenticated: false,
  themePreference: 'system',
  user: defaultUser,
  trips: [mockTripDetail],
};

export const useAppStore = create<AppState>((set) => ({
  ...defaultAppState,
  signIn: async (email, password) => {
    const result = await signInWithEmail(email, password);
    if (!result.ok) throw new Error(result.error);
    set({ isAuthenticated: true, user: { name: result.user.name, email: result.user.email } });
  },
  signUp: async (name, email, password) => {
    const result = await signUpWithEmail(name, email, password);
    if (!result.ok) throw new Error(result.error);
    set({ isAuthenticated: true, user: { name, email } });
  },
  signOut: () => set({ isAuthenticated: false, user: null }),
  setThemePreference: (value) => set({ themePreference: value }),
  addTrip: (detail) => set((state) => ({ trips: [...state.trips, detail] })),
  updateTrip: (id, patch) =>
    set((state) => ({
      trips: state.trips.map((d) =>
        d.trip.id === id ? { ...d, trip: { ...d.trip, ...patch } } : d,
      ),
    })),
  deleteTrip: (id) =>
    set((state) => ({ trips: state.trips.filter((d) => d.trip.id !== id) })),
  addStop: (tripId, dayId, stop) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        return {
          ...d,
          days: d.days.map((day) =>
            day.id === dayId ? { ...day, stops: [...day.stops, stop] } : day,
          ),
        };
      }),
    })),
  removeStop: (tripId, dayId, stopId) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        return {
          ...d,
          days: d.days.map((day) =>
            day.id === dayId
              ? { ...day, stops: day.stops.filter((s) => s.id !== stopId) }
              : day,
          ),
        };
      }),
    })),
  updateRemark: (tripId, stopId, remark) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        return {
          ...d,
          days: d.days.map((day) => ({
            ...day,
            stops: day.stops.map((s) => (s.id === stopId ? { ...s, remark } : s)),
          })),
        };
      }),
    })),
  addDay: (tripId) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        const lastDay = d.days[d.days.length - 1];
        const nextDate = (() => {
          if (lastDay?.date && /^\d{4}-\d{2}-\d{2}$/.test(lastDay.date)) {
            const [y, m, day] = lastDay.date.split('-').map(Number);
            const dt = new Date(y, m - 1, day + 1);
            if (!isNaN(dt.getTime())) {
              return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
            }
          }
          return new Date().toISOString().slice(0, 10);
        })();
        const newDay: TripDay = {
          id: `day-${Date.now()}`,
          date: nextDate,
          dayNumber: d.days.length + 1,
          stops: [],
        };
        return { ...d, days: [...d.days, newDay] };
      }),
    })),
  deleteDay: (tripId, dayId) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        const remaining = d.days.filter((day) => day.id !== dayId);
        return {
          ...d,
          days: remaining.map((day, i) => ({ ...day, dayNumber: i + 1 })),
        };
      }),
    })),
  moveDay: (tripId, dayId, direction) =>
    set((state) => ({
      trips: state.trips.map((d) => {
        if (d.trip.id !== tripId) return d;
        const idx = d.days.findIndex((day) => day.id === dayId);
        if (idx === -1) return d;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= d.days.length) return d;
        const newDays = [...d.days];
        [newDays[idx], newDays[swapIdx]] = [newDays[swapIdx], newDays[idx]];
        return {
          ...d,
          days: newDays.map((day, i) => ({ ...day, dayNumber: i + 1 })),
        };
      }),
    })),
}));
