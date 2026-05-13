import { View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';
import type { TransportMode } from '../../types/trips';

const TRANSPORT_CONFIG: Record<TransportMode, { emoji: string; color: string; bgColor: string }> = {
  walk: { emoji: '🚶', color: '#34C759', bgColor: 'rgba(52,199,89,0.12)' },
  metro: { emoji: '🚇', color: '#007AFF', bgColor: 'rgba(0,122,255,0.12)' },
  bus: { emoji: '🚌', color: '#007AFF', bgColor: 'rgba(0,122,255,0.12)' },
  taxi: { emoji: '🚕', color: '#FF9500', bgColor: 'rgba(255,149,0,0.12)' },
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
        backgroundColor: config.bgColor,
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
