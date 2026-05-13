import { describe, expect, it } from '@jest/globals';
import { generateTrip, suggestStops } from '../src/services/openai';
import { searchPlaces } from '../src/services/maps';
import { registerForNotifications } from '../src/services/notifications';

describe('service stubs', () => {
  it('returns deterministic not-connected AI responses', async () => {
    await expect(generateTrip()).resolves.toEqual({ ok: false, reason: 'not-connected' });
    await expect(suggestStops()).resolves.toEqual({ ok: false, reason: 'not-connected' });
  });

  it('returns empty maps results', async () => {
    await expect(searchPlaces('Paris')).resolves.toEqual([]);
  });

  it('returns a disabled notification registration result', async () => {
    await expect(registerForNotifications()).resolves.toEqual({
      ok: false,
      reason: 'not-connected',
      token: null,
    });
  });
});
