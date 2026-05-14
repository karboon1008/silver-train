export const routes = {
  welcome: '/(auth)/welcome' as const,
  signIn: '/(auth)/sign-in' as const,
  signUp: '/(auth)/sign-up' as const,
  trips: '/(tabs)/trips' as const,
  tripDetail: (id: string) => `/(tabs)/trips/${id}` as const,
  placeDetail: (tripId: string, placeId: string) =>
    `/(tabs)/trips/${tripId}/place/${placeId}` as const,
  newTrip: (params?: { destination?: string }) =>
    params?.destination
      ? (`/(tabs)/trips/new?destination=${encodeURIComponent(params.destination)}` as const)
      : ('/(tabs)/trips/new' as const),
  explore: '/(tabs)/explore' as const,
  profile: '/(tabs)/profile' as const,
};
