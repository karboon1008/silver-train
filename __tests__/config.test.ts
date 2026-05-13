import { afterEach, describe, expect, it } from '@jest/globals';
import { getAppConfig } from '../src/config/app-config';
import { getPublicEnv } from '../src/config/env';

const publicEnvKeys = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_OPENAI_BASE_URL',
  'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY',
  'EXPO_PUBLIC_GOOGLE_PLACES_API_KEY',
  'EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY',
  'EXPO_PUBLIC_NOTIFICATIONS_PROJECT_ID',
] as const;

const originalEnv = Object.fromEntries(
  publicEnvKeys.map((key) => [key, process.env[key]]),
) as Record<(typeof publicEnvKeys)[number], string | undefined>;

afterEach(() => {
  for (const key of publicEnvKeys) {
    if (originalEnv[key] === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = originalEnv[key];
  }
});

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

  it('derives disabled readiness flags when public env keys are missing', () => {
    expect(getAppConfig()).toEqual({
      env: {
        expoPublicSupabaseUrl: '',
        expoPublicSupabaseAnonKey: '',
        expoPublicOpenAiBaseUrl: '',
        expoPublicGoogleMapsApiKey: '',
        expoPublicGooglePlacesApiKey: '',
        expoPublicGoogleDirectionsApiKey: '',
        expoPublicNotificationsProjectId: '',
      },
      readiness: {
        supabaseReady: false,
        openAiReady: false,
        mapsReady: false,
        notificationsReady: false,
      },
    });
  });

  it('derives readiness flags from configured public env keys', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
    process.env.EXPO_PUBLIC_OPENAI_BASE_URL = 'https://api.openai.com/v1';
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = 'maps-key';
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'places-key';
    process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY = 'directions-key';
    process.env.EXPO_PUBLIC_NOTIFICATIONS_PROJECT_ID = 'project-id';

    expect(getAppConfig()).toEqual({
      env: {
        expoPublicSupabaseUrl: 'https://example.supabase.co',
        expoPublicSupabaseAnonKey: 'anon-key',
        expoPublicOpenAiBaseUrl: 'https://api.openai.com/v1',
        expoPublicGoogleMapsApiKey: 'maps-key',
        expoPublicGooglePlacesApiKey: 'places-key',
        expoPublicGoogleDirectionsApiKey: 'directions-key',
        expoPublicNotificationsProjectId: 'project-id',
      },
      readiness: {
        supabaseReady: true,
        openAiReady: true,
        mapsReady: true,
        notificationsReady: true,
      },
    });
  });
});
