import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-provider';

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style }: AppCardProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.semantic.card,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
          ...theme.shadows.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
