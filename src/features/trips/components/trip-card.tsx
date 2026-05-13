import { Pressable, View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Trip } from '@/types/trips';

type Props = {
  trip: Trip;
  onPress: () => void;
};

export function TripCard({ trip, onPress }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: theme.radii.sm,
              backgroundColor: theme.semantic.background,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="title">{trip.coverEmoji}</AppText>
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <AppText variant="body" weight="600">
              {trip.name}
            </AppText>
            <AppText variant="caption" tone="muted">
              {trip.destination}
            </AppText>
          </View>
          <View
            style={{
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.sm,
              borderRadius: theme.radii.pill,
              backgroundColor: `${theme.semantic.accent}25`,
            }}
          >
            <AppText variant="caption" weight="600" tone="accent">
              {trip.statusLabel}
            </AppText>
          </View>
        </View>
        {trip.stopCount > 0 && (
          <AppText variant="label" tone="muted">
            {trip.stopCount} {trip.stopCount === 1 ? 'stop' : 'stops'} ·{' '}
            {trip.startDate} – {trip.endDate}
          </AppText>
        )}
      </AppCard>
    </Pressable>
  );
}
