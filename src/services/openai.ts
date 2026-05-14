import { getPublicEnv } from '@/config/env';
import type { Stop } from '@/types/trips';

type SuggestResult =
  | { ok: true; stops: Array<Omit<Stop, 'id' | 'orderIndex'>> }
  | { ok: false; reason: string };

const STUB_STOPS: Array<Omit<Stop, 'id' | 'orderIndex'>> = [
  {
    scheduledTime: '2:00 PM',
    remark: '',
    place: {
      id: 'ai-stub-1',
      name: 'Local Market',
      category: 'mall',
      thumbnailEmoji: '🛒',
      lat: 0,
      lng: 0,
      rating: 4.2,
      openingHours: '8:00 AM – 8:00 PM',
      admissionPrice: 'Free entry',
    },
    transport: null,
  },
  {
    scheduledTime: '4:00 PM',
    remark: '',
    place: {
      id: 'ai-stub-2',
      name: 'City Viewpoint',
      category: 'nature',
      thumbnailEmoji: '🌅',
      lat: 0,
      lng: 0,
      rating: 4.5,
      openingHours: '6:00 AM – 10:00 PM',
      admissionPrice: 'Free entry',
    },
    transport: null,
  },
];

export async function generateTrip(): Promise<{ ok: boolean; reason?: string }> {
  return { ok: false, reason: 'not-connected' };
}

export async function suggestStops(): Promise<SuggestResult> {
  if (!getPublicEnv().expoPublicOpenAiBaseUrl) {
    return { ok: true, stops: STUB_STOPS };
  }
  // Real path: call OpenAI API here
  return { ok: true, stops: STUB_STOPS };
}
