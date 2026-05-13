import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type ListRowProps = {
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ListRow({ title, subtitle, value, onPress, style }: ListRowProps) {
  const theme = useAppTheme();
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { accessibilityRole: 'button', onPress } : {})}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.semantic.border,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <AppText weight="600">{title}</AppText>
        {subtitle ? <AppText tone="muted">{subtitle}</AppText> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
        {value ? <AppText tone="muted">{value}</AppText> : null}
        <AppText tone="muted">{'>'}</AppText>
      </View>
    </Container>
  );
}
