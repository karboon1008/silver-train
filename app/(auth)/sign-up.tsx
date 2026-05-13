import { useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { routes } from '@/core/constants/routes';
import { AuthFormShell } from '@/features/auth/components/auth-form-shell';
import { useAppStore } from '@/store/app-store';

export default function SignUpScreen() {
  const router = useRouter();
  const signIn = useAppStore((state) => state.signIn);

  const handleContinue = () => {
    signIn();
    router.replace(routes.trips);
  };

  return (
    <AuthFormShell
      eyebrow="Get started"
      title="Create a placeholder account for the foundation flow."
      description="This route only demonstrates navigation and state wiring until backend auth is connected."
      alternateLabel="Already have an account?"
      alternateActionLabel="Sign in"
      onPressAlternate={() => router.push(routes.signIn)}
    >
      <AppText tone="muted">Account creation is stubbed, so one tap enters the authenticated shell.</AppText>
      <AppButton label="Create Account" onPress={handleContinue} />
    </AuthFormShell>
  );
}
