import { useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { routes } from '@/core/constants/routes';
import { AuthFormShell } from '@/features/auth/components/auth-form-shell';
import { useAppStore } from '@/store/app-store';

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAppStore((state) => state.signIn);

  const handleContinue = () => {
    signIn();
    router.replace(routes.trips);
  };

  return (
    <AuthFormShell
      eyebrow="Welcome back"
      title="Sign in to continue building your next trip."
      description="This placeholder screen skips credentials and only wires the session state into the tab shell."
      alternateLabel="Need an account?"
      alternateActionLabel="Create one"
      onPressAlternate={() => router.push(routes.signUp)}
    >
      <AppText tone="muted">Authentication is intentionally mocked at this stage.</AppText>
      <AppButton label="Continue to Trips" onPress={handleContinue} />
    </AuthFormShell>
  );
}
