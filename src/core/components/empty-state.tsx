import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppCard } from './app-card';
import { AppButton } from './app-button';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onPressAction,
  style,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <AppCard style={style}>
      <View style={{ alignItems: 'flex-start', gap: theme.spacing.sm }}>
        <AppText variant="title" weight="700">
          {title}
        </AppText>
        <AppText tone="muted">{description}</AppText>
      </View>
      {actionLabel && onPressAction ? (
        <AppButton label={actionLabel} onPress={onPressAction} variant="secondary" />
      ) : null}
    </AppCard>
  );
}
