import { getPublicEnv, type PublicEnv } from './env';

export type AppConfig = {
  env: PublicEnv;
  readiness: {
    supabaseReady: boolean;
    openAiReady: boolean;
    mapsReady: boolean;
    notificationsReady: boolean;
  };
};

export function getAppConfig(): AppConfig {
  const env = getPublicEnv();

  return {
    env,
    readiness: {
      supabaseReady: Boolean(env.expoPublicSupabaseUrl && env.expoPublicSupabaseAnonKey),
      openAiReady: Boolean(env.expoPublicOpenAiBaseUrl),
      mapsReady: Boolean(
        env.expoPublicGoogleMapsApiKey &&
          env.expoPublicGooglePlacesApiKey &&
          env.expoPublicGoogleDirectionsApiKey,
      ),
      notificationsReady: Boolean(env.expoPublicNotificationsProjectId),
    },
  };
}
