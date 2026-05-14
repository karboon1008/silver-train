import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
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
  onRemove?: () => void;
  onRemarkChange?: (remark: string) => void;
};

export function StopCard({
  stop,
  isFirst,
  isLast,
  onPress,
  onRemove,
  onRemarkChange,
}: Props) {
  const theme = useAppTheme();
  const dotColor = TIMELINE_DOT_COLORS[stop.orderIndex % TIMELINE_DOT_COLORS.length];
  const [remarkExpanded, setRemarkExpanded] = useState(false);
  const [localRemark, setLocalRemark] = useState(stop.remark);

  function handleRemarkCommit() {
    setRemarkExpanded(false);
    onRemarkChange?.(localRemark);
  }

  function confirmRemove() {
    Alert.alert('Remove stop', `Remove "${stop.place.name}" from this day?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onRemove },
    ]);
  }

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
      {/* Timeline column */}
      <View style={{ alignItems: 'center', width: 20, paddingTop: theme.spacing.md }}>
        <View
          style={{
            width: 1,
            height: 12,
            backgroundColor: isFirst ? 'transparent' : theme.semantic.border,
          }}
        />
        <View
          style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dotColor }}
        />
        <View
          style={{
            width: 1,
            flex: 1,
            backgroundColor: isLast ? 'transparent' : theme.semantic.border,
          }}
        />
      </View>

      {/* Card */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.semantic.surface,
          borderRadius: theme.radii.sm,
          padding: theme.spacing.md,
          borderWidth: 1,
          borderColor: remarkExpanded ? theme.semantic.accent : theme.semantic.border,
          marginBottom: theme.spacing.sm,
          gap: theme.spacing.xs,
          ...theme.shadows.card,
        }}
      >
        {/* Row 1: emoji + name + time + × */}
        <Pressable
          onPress={onPress}
          style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}
        >
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
          <AppText
            variant="body"
            weight="500"
            style={{ flex: 1 }}
            numberOfLines={1}
          >
            {stop.place.name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {stop.scheduledTime}
          </AppText>
          {onRemove !== undefined && (
            <Pressable onPress={confirmRemove} hitSlop={8} style={{ padding: 4 }}>
              <AppText variant="body" style={{ color: '#dc2626', fontSize: 18 }}>
                ×
              </AppText>
            </Pressable>
          )}
        </Pressable>

        {/* Row 2: category badge */}
        <CategoryBadge category={stop.place.category} />

        {/* Row 3: detail pills — only shown when data is available */}
        {(stop.place.rating > 0 ||
          stop.place.openingHours !== '' ||
          stop.place.admissionPrice !== '') && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
            {stop.place.rating > 0 && (
              <View
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: theme.semantic.card,
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                }}
              >
                <AppText variant="label">★ {stop.place.rating}</AppText>
              </View>
            )}
            {stop.place.openingHours !== '' && (
              <View
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: theme.semantic.card,
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                }}
              >
                <AppText variant="label">🕘 {stop.place.openingHours}</AppText>
              </View>
            )}
            {stop.place.admissionPrice !== '' && (
              <View
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: theme.semantic.card,
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                }}
              >
                <AppText variant="label">🎫 {stop.place.admissionPrice}</AppText>
              </View>
            )}
          </View>
        )}

        {/* Row 4: inline remark */}
        {remarkExpanded ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.semantic.accent,
              borderRadius: 6,
              padding: theme.spacing.sm,
              backgroundColor: `${theme.semantic.accent}08`,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.xs,
              }}
            >
              <AppText variant="caption" tone="accent">
                ✎ Note
              </AppText>
              <Pressable onPress={handleRemarkCommit}>
                <AppText variant="caption" tone="muted">
                  Done
                </AppText>
              </Pressable>
            </View>
            <TextInput
              autoFocus
              value={localRemark}
              onChangeText={setLocalRemark}
              onBlur={handleRemarkCommit}
              placeholder="Add a note about this place…"
              placeholderTextColor={theme.semantic.mutedText}
              multiline
              style={{
                color: theme.semantic.text,
                fontSize: theme.typography.body,
              }}
            />
          </View>
        ) : (
          <Pressable
            onPress={() => setRemarkExpanded(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.xs,
              padding: theme.spacing.xs,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: theme.semantic.border,
              borderRadius: 6,
            }}
          >
            <AppText variant="caption" tone="muted">
              ✎
            </AppText>
            <AppText
              variant="caption"
              tone="muted"
              style={{ fontStyle: localRemark ? 'italic' : 'normal' }}
            >
              {localRemark || 'Add a note…'}
            </AppText>
          </Pressable>
        )}

        {/* Row 5: transport pill */}
        {stop.transport !== null && (
          <TransportPill
            mode={stop.transport.mode}
            durationMin={stop.transport.durationMin}
            routeLabel={stop.transport.routeLabel}
          />
        )}
      </View>
    </View>
  );
}
