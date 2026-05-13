import { Pressable, View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';

type Props = {
  destination: string;
  onExpand: () => void;
};

export function MapHero({ destination, onExpand }: Props) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onExpand}
      style={{
        height: 90,
        borderRadius: theme.radii.md,
        backgroundColor: theme.semantic.card,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
        <AppText variant="title">🗺️</AppText>
        <AppText variant="caption" tone="muted">
          {destination} · Tap to expand
        </AppText>
      </View>
    </Pressable>
  );
}
