import { Pressable, View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: theme.radii.pill,
        backgroundColor: theme.semantic.surface,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        padding: theme.spacing.xs,
        gap: theme.spacing.xs,
      }}
    >
      {options.map((option) => {
        const selected = option === value;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            onPress={() => onChange(option)}
            style={{
              flex: 1,
              borderRadius: theme.radii.pill,
              backgroundColor: selected ? theme.semantic.accent : 'transparent',
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <AppText
              tone={selected ? 'inverse' : 'muted'}
              weight={selected ? '600' : '500'}
              style={{ textAlign: 'center' }}
            >
              {option}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
