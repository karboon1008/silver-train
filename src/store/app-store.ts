import { create } from 'zustand';
import { signInWithEmail, signUpWithEmail } from '@/services/supabase';
import { mockTripDetail } from '@/mocks/trip-detail';
import type { Trip, TripDetail, Stop } from '@/types/trips';

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
  signOut: () => set({ isAuthenticated: false }),
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
}));
