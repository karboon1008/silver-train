import { View, TextInput } from 'react-native';
import { AppText } from '@/core/components/app-text';
import { CategoryBadge } from '@/core/components/category-badge';
import { Screen } from '@/core/components/screen';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Place } from '@/types/trips';

type Props = {
  place: Place;
  remark: string;
  onRemarkChange: (value: string) => void;
};

export default function PlaceDetailScreen({ place, remark, onRemarkChange }: Props) {
  const theme = useAppTheme();

  const infoRows = [
    { label: 'Rating', value: String(place.rating) },
    { label: 'Hours', value: place.openingHours },
    { label: 'Admission', value: place.admissionPrice },
  ];

  return (
    <Screen scroll>
      {/* Hero placeholder */}
      <View
        style={{
          height: 110,
          borderRadius: theme.radii.md,
          backgroundColor: theme.semantic.card,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.lg,
        }}
      >
        <AppText style={{ fontSize: 48 }}>{place.thumbnailEmoji}</AppText>
      </View>

      {/* Name row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.md,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.semantic.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="body">{place.thumbnailEmoji}</AppText>
        </View>
        <AppText variant="title" weight="600" style={{ flex: 1 }}>
          {place.name}
        </AppText>
      </View>

      {/* Category badge */}
      <CategoryBadge category={place.category} />

      {/* Editable remark */}
      <View
        style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.semantic.surface,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          gap: theme.spacing.xs,
        }}
      >
        <AppText variant="caption" tone="muted">
          ✎ Note
        </AppText>
        <TextInput
          value={remark}
          onChangeText={onRemarkChange}
          placeholder="Add a note about this place…"
          placeholderTextColor={theme.semantic.mutedText}
          multiline
          style={{
            color: theme.semantic.text,
            fontSize: theme.typography.body,
            fontStyle: remark === '' ? 'italic' : 'normal',
          }}
        />
      </View>

      {/* Info rows */}
      <View
        style={{
          marginTop: theme.spacing.lg,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.semantic.surface,
          borderWidth: 1,
          borderColor: theme.semantic.border,
          overflow: 'hidden',
        }}
      >
        {infoRows.map((row, i) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: theme.spacing.md,
              borderBottomWidth: i < infoRows.length - 1 ? 1 : 0,
              borderBottomColor: theme.semantic.border,
            }}
          >
            <AppText variant="body" tone="muted">
              {row.label}
            </AppText>
            <AppText variant="body" weight="500">
              {row.value}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}
