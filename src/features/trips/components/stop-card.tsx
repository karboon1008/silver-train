import { Pressable, View } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { CategoryBadge } from '@/core/components/category-badge';
import { TransportPill } from '@/core/components/transport-pill';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Stop } from '@/types/trips';

const TIMELINE_DOT_COLORS = ['#34C759', '#007AFF', '#FF9500', '#8E8E93'] as const;

type Props = {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  onPress?: () => void;
};

export function StopCard({ stop, isFirst, isLast, onPress }: Props) {
  const theme = useAppTheme();
  const dotColor = TIMELINE_DOT_COLORS[stop.orderIndex % TIMELINE_DOT_COLORS.length];

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
      {/* Timeline connector column */}
      <View style={{ alignItems: 'center', width: 20, paddingTop: theme.spacing.md }}>
        <View
          style={{
            width: 1,
            height: 12,
            backgroundColor: isFirst ? 'transparent' : theme.semantic.border,
          }}
        />
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: dotColor,
          }}
        />
        <View
          style={{
            width: 1,
            flex: 1,
            backgroundColor: isLast ? 'transparent' : theme.semantic.border,
          }}
        />
      </View>

      {/* Card body */}
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          backgroundColor: theme.semantic.surface,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          marginBottom: theme.spacing.sm,
          gap: theme.spacing.xs,
          ...theme.shadows.card,
        }}
      >
        {/* Row 1: emoji thumbnail + place name + time */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: theme.semantic.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="body">{stop.place.thumbnailEmoji}</AppText>
          </View>
          <AppText variant="body" weight="500" style={{ flex: 1 }} numberOfLines={1}>
            {stop.place.name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {stop.scheduledTime}
          </AppText>
        </View>

        {/* Row 2: category badge + remark */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
          <CategoryBadge category={stop.place.category} />
          {stop.remark !== '' && (
            <AppText
              variant="caption"
              tone="muted"
              style={{ fontStyle: 'italic', flex: 1 }}
              numberOfLines={1}
            >
              {stop.remark}
            </AppText>
          )}
        </View>

        {/* Row 3: transport pill */}
        {stop.transport !== null && (
          <TransportPill
            mode={stop.transport.mode}
            durationMin={stop.transport.durationMin}
            routeLabel={stop.transport.routeLabel}
          />
        )}
      </Pressable>
    </View>
  );
}
