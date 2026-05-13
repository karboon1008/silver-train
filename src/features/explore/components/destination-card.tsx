import { View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';

type Destination = (typeof import('@/mocks/explore').mockDestinations)[number];

type DestinationCardProps = {
  destination: Destination;
};

export function DestinationCard({ destination }: DestinationCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText tone="accent" variant="label" weight="700">
          {destination.category}
        </AppText>
        <AppText variant="title" weight="700">
          {destination.name}
        </AppText>
      </View>
      <AppText tone="muted">{destination.tag}</AppText>
    </AppCard>
  );
}
