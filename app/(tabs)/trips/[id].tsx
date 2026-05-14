import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { Screen } from '@/core/components/screen';
import TripDetailScreen from '@/features/trips/screens/trip-detail';
import { routes } from '@/core/constants/routes';
import { useAppStore } from '@/store/app-store';
import type { Stop, Trip } from '@/types/trips';

export default function TripDetailRoute() {
  const rawId = useLocalSearchParams<{ id: string }>().id;
  const id = Array.isArray(rawId) ? (rawId[0] ?? '') : rawId;
  const router = useRouter();

  const tripDetail = useAppStore((state) =>
    state.trips.find((d) => d.trip.id === id),
  );
  const updateTrip = useAppStore((state) => state.updateTrip);
  const deleteTrip = useAppStore((state) => state.deleteTrip);
  const addStop = useAppStore((state) => state.addStop);
  const removeStop = useAppStore((state) => state.removeStop);
  const updateRemark = useAppStore((state) => state.updateRemark);
  const addDay = useAppStore((state) => state.addDay);
  const deleteDay = useAppStore((state) => state.deleteDay);
  const moveDay = useAppStore((state) => state.moveDay);

  if (tripDetail === undefined) {
    return (
      <Screen>
        <EmptyState title="Trip not found" description="This trip no longer exists." />
      </Screen>
    );
  }

  return (
    <TripDetailScreen
      tripDetail={tripDetail}
      onBack={() => router.back()}
      onStopPress={(stop: Stop) => router.push(routes.placeDetail(id, stop.place.id))}
      onEditSave={(patch: Partial<Trip>) => updateTrip(id, patch)}
      onDelete={() => {
        deleteTrip(id);
        router.back();
      }}
      onAddStop={(dayId: string, stop: Stop) => addStop(id, dayId, stop)}
      onRemoveStop={(dayId: string, stopId: string) => removeStop(id, dayId, stopId)}
      onRemarkChange={(stopId: string, remark: string) => updateRemark(id, stopId, remark)}
      onAddDay={() => addDay(id)}
      onDeleteDay={(dayId: string) => deleteDay(id, dayId)}
      onMoveDay={(dayId: string, direction: 'up' | 'down') => moveDay(id, dayId, direction)}
    />
  );
}
