import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { FloatingActionButton } from '@/core/components/floating-action-button';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { SegmentedControl } from '@/core/components/segmented-control';
import { TripCard } from '@/features/trips/components/trip-card';
import { mockTrips } from '@/mocks/trips';
import { routes } from '@/core/constants/routes';
import type { Trip } from '@/types/trips';

type TripSegment = 'Upcoming' | 'Past' | 'Drafts';
const SEGMENTS = ['Upcoming', 'Past', 'Drafts'] as const satisfies readonly TripSegment[];

export default function TripsScreen() {
  const [segment, setSegment] = useState<TripSegment>('Upcoming');
  const router = useRouter();
  const trips = mockTrips[segment];

  function handleTripPress(trip: Trip) {
    router.push(routes.tripDetail(trip.id));
  }

  return (
    <Screen scroll>
      <SectionHeader title="My Trips" subtitle="Good morning" />
      <SegmentedControl options={SEGMENTS} value={segment} onChange={setSegment} />
      <View style={{ gap: 16, paddingBottom: 96 }}>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onPress={() => handleTripPress(trip)} />
          ))
        ) : (
          <EmptyState
            title={`No ${segment.toLowerCase()} trips yet`}
            description="Tap + to plan your first trip."
          />
        )}
      </View>
      <FloatingActionButton label="Plan a trip" onPress={() => undefined} />
    </Screen>
  );
}
