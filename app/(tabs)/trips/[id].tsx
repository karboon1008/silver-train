import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { Screen } from '@/core/components/screen';
import TripDetailScreen from '@/features/trips/screens/trip-detail';
import { mockTripDetails } from '@/mocks/trip-detail';
import { routes } from '@/core/constants/routes';
import type { Stop } from '@/types/trips';

export default function TripDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tripDetail = mockTripDetails[id];

  function handleStopPress(stop: Stop) {
    router.push(routes.placeDetail(id, stop.place.id));
  }

  if (tripDetail === undefined) {
    return (
      <Screen>
        <EmptyState title="Trip not found" description="This trip no longer exists." />
      </Screen>
    );
  }

  return <TripDetailScreen tripDetail={tripDetail} onStopPress={handleStopPress} />;
}
