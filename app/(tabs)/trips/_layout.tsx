import { Stack } from 'expo-router';
import { useAppTheme } from '@/core/theme/theme-provider';

export default function TripsLayout() {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.semantic.background },
      }}
    />
  );
}
