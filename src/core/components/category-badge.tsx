import { View } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '../theme/theme-provider';
import type { StopCategory } from '../../types/trips';

const CATEGORY_CONFIG: Record<StopCategory, { emoji: string; label: string }> = {
  landmark: { emoji: '🏛️', label: 'Landmark' },
  accommodation: { emoji: '🏨', label: 'Accommodation' },
  mall: { emoji: '🛍️', label: 'Mall' },
  station: { emoji: '🚉', label: 'Station' },
  restaurant: { emoji: '🍽️', label: 'Restaurant' },
  nature: { emoji: '🌿', label: 'Nature' },
  entertainment: { emoji: '🎭', label: 'Entertainment' },
};

type Props = {
  category: StopCategory;
};

export function CategoryBadge({ category }: Props) {
  const theme = useAppTheme();
  const config = CATEGORY_CONFIG[category];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: 3,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: theme.semantic.surface,
        borderWidth: 1,
        borderColor: theme.semantic.border,
        alignSelf: 'flex-start',
      }}
    >
      <AppText variant="caption">{config.emoji}</AppText>
      <AppText variant="label" weight="600">
        {config.label}
      </AppText>
    </View>
  );
}
