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
