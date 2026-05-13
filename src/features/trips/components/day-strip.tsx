import { ScrollView, Pressable, View } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { TripDay } from '@/types/trips';

type Props = {
  days: TripDay[];
  activeDay: string;
  onDayPress: (dayId: string) => void;
};

export function DayStrip({ days, activeDay, onDayPress }: Props) {
  const theme = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: theme.spacing.sm }}
    >
      {days.map((day) => {
        const isActive = day.id === activeDay;
        return (
          <Pressable
            key={day.id}
            onPress={() => onDayPress(day.id)}
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
            <AppText
              variant="caption"
              style={{ color: isActive ? theme.semantic.background : theme.semantic.mutedText }}
            >
              {day.date.slice(5)}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
