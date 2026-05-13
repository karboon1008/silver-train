import { useState } from 'react';
import { View } from 'react-native';
import { EmptyState } from '@/core/components/empty-state';
import { FloatingActionButton } from '@/core/components/floating-action-button';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { SegmentedControl } from '@/core/components/segmented-control';
import { TripCard } from '@/features/trips/components/trip-card';
import { mockTrips } from '@/mocks/trips';

type TripSegment = keyof typeof mockTrips;

const tripSegments = ['Upcoming', 'Past', 'Drafts'] as const satisfies readonly TripSegment[];

export default function TripsScreen() {
  const [segment, setSegment] = useState<TripSegment>('Upcoming');
  const trips = mockTrips[segment];

  return (
    <Screen scroll>
      <SectionHeader title="My Trips" subtitle="Good morning" />
      <SegmentedControl options={tripSegments} value={segment} onChange={setSegment} />
      <View style={{ gap: 16, paddingBottom: 96 }}>
        {trips.length > 0 ? (
          trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <EmptyState
            title={`No ${segment.toLowerCase()} trips yet`}
            description="This section is wired to mock data so the shell can be exercised before Supabase is connected."
          />
        )}
      </View>
      <FloatingActionButton label="Plan a trip" onPress={() => undefined} />
    </Screen>
  );
}
