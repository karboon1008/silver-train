import { View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';
import type { TransportMode } from '../../types/trips';

const TRANSPORT_CONFIG: Record<TransportMode, { emoji: string; color: string }> = {
  walk: { emoji: '🚶', color: '#34C759' },
  metro: { emoji: '🚇', color: '#007AFF' },
  bus: { emoji: '🚌', color: '#007AFF' },
  taxi: { emoji: '🚕', color: '#FF9500' },
};

type Props = {
  mode: TransportMode;
  durationMin: number;
  routeLabel: string;
};

export function TransportPill({ mode, durationMin, routeLabel }: Props) {
  const theme = useAppTheme();
  const config = TRANSPORT_CONFIG[mode];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: 3,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: `${config.color}20`,
        alignSelf: 'flex-start',
      }}
    >
      <AppText variant="caption">{config.emoji}</AppText>
      <AppText
        variant="caption"
        weight="600"
        style={{ color: config.color }}
      >
        {durationMin} min
      </AppText>
      <AppText variant="caption" tone="muted">
        {routeLabel}
      </AppText>
    </View>
  );
}
