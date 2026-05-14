import { getPublicEnv } from '@/config/env';
import { mockDestinations } from '@/mocks/explore';

export type PlaceResult = {
  id: string;
  name: string;
  category: string;
};

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  if (!query) return [];
  if (!getPublicEnv().expoPublicGooglePlacesApiKey) {
    const lower = query.toLowerCase();
    return mockDestinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.tag.toLowerCase().includes(lower),
      )
      .map((d) => ({ id: d.id, name: d.name, category: d.category }));
  }
  // Real path: call Google Places API here
  return [];
}
