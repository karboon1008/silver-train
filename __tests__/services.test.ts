import { describe, expect, it } from '@jest/globals';
import { generateTrip, suggestStops } from '../src/services/openai';
import { searchPlaces } from '../src/services/maps';
import { signInWithEmail, signUpWithEmail } from '../src/services/supabase';
import { registerForNotifications } from '../src/services/notifications';

describe('supabase service (mock path — no key set in test env)', () => {
  it('signInWithEmail returns ok:true with user on mock path', async () => {
    const result = await signInWithEmail('test@example.com', 'pass');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.email).toBe('test@example.com');
      expect(typeof result.user.name).toBe('string');
    }
  });

  it('signUpWithEmail returns ok:true with name on mock path', async () => {
    const result = await signUpWithEmail('Ava', 'ava@example.com', 'pass123');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.name).toBe('Ava');
    }
  });
});

describe('openai service (mock path — no key set in test env)', () => {
  it('generateTrip returns not-connected', async () => {
    await expect(generateTrip()).resolves.toEqual({ ok: false, reason: 'not-connected' });
  });

  it('suggestStops returns two stub stops', async () => {
    const result = await suggestStops();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stops).toHaveLength(2);
      expect(result.stops[0]!.place.name).toBe('Local Market');
      expect(result.stops[1]!.place.name).toBe('City Viewpoint');
    }
  });
});

describe('maps service (mock path — no key set in test env)', () => {
  it('returns empty array for empty query', async () => {
    await expect(searchPlaces('')).resolves.toEqual([]);
  });

  it('returns matching destinations for a query', async () => {
    const results = await searchPlaces('Lisbon');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.name).toBe('Lisbon');
  });

  it('returns empty for no match', async () => {
    const results = await searchPlaces('zzzzz');
    expect(results).toHaveLength(0);
  });
});

describe('notifications service', () => {
  it('returns disabled result', async () => {
    await expect(registerForNotifications()).resolves.toEqual({
      ok: false,
      reason: 'not-connected',
      token: null,
    });
  });
});
