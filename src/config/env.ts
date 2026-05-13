export type PublicEnv = {
  expoPublicSupabaseUrl: string;
  expoPublicSupabaseAnonKey: string;
  expoPublicOpenAiBaseUrl: string;
  expoPublicGoogleMapsApiKey: string;
  expoPublicGooglePlacesApiKey: string;
  expoPublicGoogleDirectionsApiKey: string;
  expoPublicNotificationsProjectId: string;
};

export function getPublicEnv(): PublicEnv {
  return {
    expoPublicSupabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    expoPublicSupabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    expoPublicOpenAiBaseUrl: process.env.EXPO_PUBLIC_OPENAI_BASE_URL ?? '',
    expoPublicGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    expoPublicGooglePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? '',
    expoPublicGoogleDirectionsApiKey: process.env.EXPO_PUBLIC_GOOGLE_DIRECTIONS_API_KEY ?? '',
    expoPublicNotificationsProjectId: process.env.EXPO_PUBLIC_NOTIFICATIONS_PROJECT_ID ?? '',
  };
}
