import { Alert, Pressable, ScrollView } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { TripDay } from '@/types/trips';

type Props = {
  days: TripDay[];
  activeDay: string;
  onDayPress: (dayId: string) => void;
  onAddDay?: () => void;
  onDeleteDay?: (dayId: string) => void;
  onMoveDay?: (dayId: string, direction: 'up' | 'down') => void;
};

export function DayStrip({
  days,
  activeDay,
  onDayPress,
  onAddDay,
  onDeleteDay,
  onMoveDay,
}: Props) {
  const theme = useAppTheme();

  function handleLongPress(day: TripDay, index: number) {
    const options: Array<{
      text: string;
      onPress?: () => void;
      style?: 'destructive' | 'cancel' | 'default';
    }> = [];

    if (index > 0 && onMoveDay) {
      options.push({ text: '↑ Move Up', onPress: () => onMoveDay(day.id, 'up') });
    }
    if (index < days.length - 1 && onMoveDay) {
      options.push({ text: '↓ Move Down', onPress: () => onMoveDay(day.id, 'down') });
    }
    if (days.length > 1 && onDeleteDay) {
      options.push({
        text: 'Delete Day',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Delete Day',
            `Delete Day ${day.dayNumber}? All stops will be removed.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDeleteDay(day.id) },
            ],
          ),
      });
    }
    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(`Day ${day.dayNumber}`, day.date, options);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: theme.spacing.sm }}
    >
      {days.map((day, index) => {
        const isActive = day.id === activeDay;
        return (
          <Pressable
            key={day.id}
            onPress={() => onDayPress(day.id)}
            onLongPress={() => handleLongPress(day, index)}
            style={{
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radii.pill,
              backgroundColor: isActive ? theme.semantic.text : theme.semantic.surface,
              borderWidth: 1,
              borderColor: isActive ? theme.semantic.text : theme.semantic.border,
              alignItems: 'center',
            }}
          >
            <AppText
              variant="caption"
              weight="600"
              style={{ color: isActive ? theme.semantic.background : theme.semantic.text }}
            >
              {`Day ${day.dayNumber}`}
            </AppText>
            {/^\d{4}-\d{2}-\d{2}$/.test(day.date) && (
              <AppText
                variant="caption"
                style={{ color: isActive ? theme.semantic.background : theme.semantic.mutedText }}
              >
                {day.date.slice(5)}
              </AppText>
            )}
          </Pressable>
        );
      })}
      {onAddDay !== undefined && (
        <Pressable
          onPress={onAddDay}
          style={{
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.radii.pill,
            borderWidth: 1,
            borderColor: theme.semantic.border,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="caption" weight="600" tone="muted">
            ＋ Day
          </AppText>
        </Pressable>
      )}
    </ScrollView>
  );
}
