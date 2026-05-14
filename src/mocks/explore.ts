export const mockDestinations = [
  { id: '1', name: 'Lisbon', emoji: '🏖️', tag: 'Coastal city breaks', category: 'City' },
  { id: '2', name: 'Bali', emoji: '🌿', tag: 'Nature and calm escapes', category: 'Nature' },
  { id: '3', name: 'Kyoto', emoji: '🏯', tag: 'Temples and traditions', category: 'Culture' },
  { id: '4', name: 'New York', emoji: '🗽', tag: 'Urban energy and culture', category: 'City' },
  { id: '5', name: 'Amalfi Coast', emoji: '🌊', tag: 'Clifftop coastal drives', category: 'Beach' },
  { id: '6', name: 'Patagonia', emoji: '🏔️', tag: 'Wild southern wilderness', category: 'Nature' },
  { id: '7', name: 'Barcelona', emoji: '🏛️', tag: 'Architecture and nightlife', category: 'City' },
  { id: '8', name: 'Marrakech', emoji: '🕌', tag: 'Souks and desert gateways', category: 'Culture' },
] as const;

export type Destination = (typeof mockDestinations)[number];
export type DestinationCategory = Destination['category'];
