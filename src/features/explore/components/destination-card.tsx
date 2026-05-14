import { Pressable, View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Destination } from '@/mocks/explore';

type Props = {
  destination: Destination;
  onPlan: () => void;
};

export function DestinationCard({ destination, onPlan }: Props) {
  const theme = useAppTheme();

  return (
    <AppCard>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: theme.spacing.xs, flex: 1 }}>
          <AppText tone="accent" variant="label" weight="700" style={{ textTransform: 'uppercase' }}>
            {destination.category}
          </AppText>
          <AppText variant="title" weight="700">
            {destination.emoji} {destination.name}
          </AppText>
          <AppText tone="muted">{destination.tag}</AppText>
        </View>
        <Pressable
          onPress={onPlan}
          accessibilityRole="button"
          accessibilityLabel={`Plan trip to ${destination.name}`}
          style={({ pressed }) => ({
            backgroundColor: `${theme.semantic.accent}20`,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radii.sm,
            opacity: pressed ? 0.7 : 1,
            marginLeft: theme.spacing.md,
          })}
        >
          <AppText variant="body" weight="600" tone="accent">
            Plan →
          </AppText>
        </Pressable>
      </View>
    </AppCard>
  );
}
