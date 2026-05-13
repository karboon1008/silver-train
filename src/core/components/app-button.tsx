import { Pressable, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 52,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radii.pill,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.semantic.border,
          backgroundColor:
            variant === 'primary'
              ? theme.semantic.text
              : variant === 'secondary'
                ? theme.semantic.surface
                : 'transparent',
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <AppText
        tone={variant === 'primary' ? 'inverse' : 'default'}
        weight="600"
        style={{ textAlign: 'center' }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
