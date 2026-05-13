import { View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';

type ProfileSummaryProps = {
  name: string;
  email: string;
};

export function ProfileSummary({ name, email }: ProfileSummaryProps) {
  const theme = useAppTheme();

  return (
    <AppCard>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText tone="muted" variant="label" weight="700">
          Traveler profile
        </AppText>
        <AppText variant="title" weight="700">
          {name}
        </AppText>
        <AppText tone="muted">{email}</AppText>
      </View>
    </AppCard>
  );
}
