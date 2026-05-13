import { useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { Screen } from '@/core/components/screen';
import { routes } from '@/core/constants/routes';
import { useAppTheme } from '@/core/theme/theme-provider';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={{ justifyContent: 'space-between' }}>
      <AppCard
        style={{
          marginTop: theme.spacing.xl,
          backgroundColor: theme.semantic.text,
          borderColor: theme.semantic.text,
        }}
      >
        <AppText tone="inverse" variant="label" weight="700">
          Smart Travel Planner
        </AppText>
        <AppText tone="inverse" variant="display" weight="700">
          Plan calmer trips with a mock-first foundation.
        </AppText>
        <AppText tone="inverse">
          Start with placeholder auth, trips, explore, and profile flows before any live service
          connection.
        </AppText>
      </AppCard>

      <AppCard>
        <AppText variant="title" weight="700">
          What is wired today
        </AppText>
        <AppText tone="muted">
          Auth routes, tab shell, mock trip cards, destination discovery, and profile settings all
          work locally against the shared store and theme.
        </AppText>
        <AppButton label="Sign In" onPress={() => router.push(routes.signIn)} />
        <AppButton label="Create Account" onPress={() => router.push(routes.signUp)} variant="secondary" />
      </AppCard>
    </Screen>
  );
}
