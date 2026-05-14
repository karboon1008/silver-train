import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { routes } from '@/core/constants/routes';
import { AuthFormShell } from '@/features/auth/components/auth-form-shell';
import { AuthField } from '@/features/auth/components/auth-field';
import { useAppStore } from '@/store/app-store';

function validateEmail(email: string): string {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useAppStore((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  async function handleSignIn() {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    setErrorBanner('');
    try {
      await signIn(email, password);
      router.replace(routes.trips);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Welcome back"
      title="Sign in to continue building your next trip."
      description=""
      alternateLabel="Need an account?"
      alternateActionLabel="Create one"
      onPressAlternate={() => router.push(routes.signUp)}
      onBack={() => router.back()}
    >
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={emailError}
        placeholder="you@example.com"
      />
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={passwordError}
        placeholder="Min. 6 characters"
      />
      {errorBanner !== '' && (
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#fee2e2' }}>
          <AppText variant="caption" style={{ color: '#dc2626' }}>
            {errorBanner}
          </AppText>
        </View>
      )}
      <AppButton
        label={loading ? 'Signing in…' : 'Sign In'}
        disabled={loading}
        onPress={handleSignIn}
      />
    </AuthFormShell>
  );
}
