import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  style,
}: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        },
        style,
      ]}
    >
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
