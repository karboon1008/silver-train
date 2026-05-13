import { View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import { tokens } from '@/core/theme/tokens';

type Trip = (typeof import('@/mocks/trips').mockTrips)[keyof typeof import('@/mocks/trips').mockTrips][number];

type TripCardProps = {
  trip: Trip;
};

export function TripCard({ trip }: TripCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText tone="accent" variant="label" weight="700">
          {trip.destination}
        </AppText>
        <AppText variant="title" weight="700">
          {trip.name}
        </AppText>
      </View>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText tone="muted">{trip.dateRange}</AppText>
        <AppText
          style={{
            alignSelf: 'flex-start',
            backgroundColor: theme.semantic.surface,
            borderRadius: theme.radii.pill,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
          }}
        >
          {trip.status}
        </AppText>
      </View>
      <View
        style={{
          height: 6,
          borderRadius: theme.radii.pill,
          backgroundColor: tokens.colors.slate,
          opacity: 0.35,
        }}
      />
    </AppCard>
  );
}
