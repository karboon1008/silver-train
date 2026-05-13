import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { Screen } from '@/core/components/screen';
import PlaceDetailScreen from '@/features/trips/screens/place-detail';
import { mockTripDetails } from '@/mocks/trip-detail';

export default function PlaceDetailRoute() {
  const { id, placeId } = useLocalSearchParams<{ id: string; placeId: string }>();
  const tripDetail = mockTripDetails[id];
  const stop = tripDetail?.days.flatMap((d) => d.stops).find((s) => s.place.id === placeId);
  const [remark, setRemark] = useState(stop?.remark ?? '');

  if (stop === undefined) {
    return (
      <Screen>
        <EmptyState title="Place not found" description="This stop no longer exists." />
      </Screen>
    );
  }

  return (
    <PlaceDetailScreen place={stop.place} remark={remark} onRemarkChange={setRemark} />
  );
}
