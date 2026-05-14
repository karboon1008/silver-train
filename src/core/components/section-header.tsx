import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  onBack,
  style,
}: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.sm,
        },
        style,
      ]}
    >
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={{ paddingRight: theme.spacing.xs }}
        >
          <AppText variant="title" weight="400" tone="accent">
            ‹
          </AppText>
        </Pressable>
      ) : null}

      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        {subtitle ? (
          <AppText tone="muted" variant="label" weight="600">
            {subtitle}
          </AppText>
        ) : null}
        <AppText variant="title" weight="700">
          {title}
        </AppText>
      </View>

      {actionLabel && onPressAction ? (
        <AppText accessibilityRole="button" onPress={onPressAction} tone="accent" weight="600">
          {actionLabel}
        </AppText>
      ) : null}
    </View>
  );
}
