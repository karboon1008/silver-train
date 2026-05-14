import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { routes } from '@/core/constants/routes';
import { AuthFormShell } from '@/features/auth/components/auth-form-shell';
import { AuthField } from '@/features/auth/components/auth-field';
import { useAppStore } from '@/store/app-store';

export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useAppStore((state) => state.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  async function handleSignUp() {
    const nErr = name.trim() ? '' : 'Name is required';
    const eErr = !email ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email';
    const pErr = password.length >= 6 ? '' : 'Password must be at least 6 characters';
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (nErr || eErr || pErr) return;

    setLoading(true);
    setErrorBanner('');
    try {
      await signUp(name, email, password);
      router.replace(routes.trips);
    } catch (err) {
      setErrorBanner(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Get started"
      title="Create your account to start planning trips."
      description=""
      alternateLabel="Already have an account?"
      alternateActionLabel="Sign in"
      onPressAlternate={() => router.push(routes.signIn)}
      onBack={() => router.back()}
    >
      <AuthField
        label="Name"
        value={name}
        onChangeText={setName}
        error={nameError}
        placeholder="Ava Traveler"
      />
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
        label={loading ? 'Creating account…' : 'Create Account'}
        disabled={loading}
        onPress={handleSignUp}
      />
    </AuthFormShell>
  );
}
