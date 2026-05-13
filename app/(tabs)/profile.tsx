import { View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { AppButton } from '@/core/components/app-button';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { SegmentedControl } from '@/core/components/segmented-control';
import { routes } from '@/core/constants/routes';
import { ProfileSummary } from '@/features/profile/components/profile-summary';
import { mockUser } from '@/mocks/session';
import { useAppStore, type ThemePreference } from '@/store/app-store';
import { useRouter } from 'expo-router';
import { ListRow } from '@/core/components/list-row';

const themeOptions = ['system', 'light', 'dark'] as const satisfies readonly ThemePreference[];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user) ?? mockUser;
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const signOut = useAppStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    router.replace(routes.welcome);
  };

  return (
    <Screen scroll>
      <SectionHeader title="Profile" subtitle="Account and preferences" />
      <ProfileSummary name={user.name} email={user.email} />
      <AppCard>
        <AppText variant="title" weight="700">
          Theme
        </AppText>
        <AppText tone="muted">
          Switching themes here validates that shell-level preference updates do not crash the app.
        </AppText>
        <SegmentedControl
          options={themeOptions}
          value={themePreference}
          onChange={setThemePreference}
        />
      </AppCard>
      <View>
        <ListRow title="Notifications" subtitle="Reminder service is stubbed" value="Off" />
        <ListRow title="Supabase" subtitle="Session persistence will connect later" value="Pending" />
        <ListRow title="Maps" subtitle="Place search service is disconnected" value="Stubbed" />
      </View>
      <AppButton label="Sign Out" onPress={handleSignOut} variant="secondary" />
    </Screen>
  );
}
