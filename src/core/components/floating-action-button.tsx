import { Pressable, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type FloatingActionButtonProps = {
  label?: string;
  icon?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function FloatingActionButton({
  label,
  icon = '+',
  onPress,
  style,
}: FloatingActionButtonProps) {
  const theme = useAppTheme();

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: 'absolute',
          right: theme.spacing.lg,
          bottom: theme.spacing.xl,
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          backgroundColor: theme.semantic.text,
          borderRadius: theme.radii.pill,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          ...theme.shadows.card,
        }}
      >
        <AppText tone="inverse" variant="title" weight="700">
          {icon}
        </AppText>
        {label ? (
          <AppText tone="inverse" weight="600">
            {label}
          </AppText>
        ) : null}
      </Pressable>
    </View>
  );
}
