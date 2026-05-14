import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Stop, StopCategory } from '@/types/trips';

const CATEGORIES: StopCategory[] = [
  'landmark',
  'restaurant',
  'accommodation',
  'entertainment',
  'mall',
  'station',
  'nature',
];

const CATEGORY_EMOJIS: Record<StopCategory, string> = {
  landmark: '🏛️',
  accommodation: '🏨',
  mall: '🛒',
  station: '🚉',
  restaurant: '🍽️',
  nature: '🌿',
  entertainment: '🎭',
};

type Props = {
  visible: boolean;
  existingStopCount: number;
  onClose: () => void;
  onAdd: (stop: Stop) => void;
};

export function AddStopSheet({ visible, existingStopCount, onClose, onAdd }: Props) {
  const theme = useAppTheme();
  const [placeName, setPlaceName] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<StopCategory>('landmark');

  function handleAdd() {
    if (!placeName.trim()) return;
    const base = Date.now();
    onAdd({
      id: `stop-${base}`,
      scheduledTime: time.trim() || '12:00 PM',
      orderIndex: existingStopCount,
      remark: '',
      place: {
        id: `place-${base}`,
        name: placeName.trim(),
        category,
        thumbnailEmoji: CATEGORY_EMOJIS[category],
        lat: 0,
        lng: 0,
        rating: 0,
        openingHours: '',
        admissionPrice: '',
      },
      transport: null,
    });
    setPlaceName('');
    setTime('');
    setCategory('landmark');
    onClose();
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.semantic.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    backgroundColor: theme.semantic.card,
  } as const;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      />
      <View
        style={{
          backgroundColor: theme.semantic.surface,
          borderTopLeftRadius: theme.radii.lg,
          borderTopRightRadius: theme.radii.lg,
          padding: theme.spacing.xl,
          gap: theme.spacing.lg,
        }}
      >
        <AppText variant="title" weight="700">
          Add a stop
        </AppText>

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" weight="600">
            PLACE NAME
          </AppText>
          <TextInput
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="e.g. Sacré-Cœur"
            placeholderTextColor={theme.semantic.mutedText}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" weight="600">
            TIME
          </AppText>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="e.g. 2:00 PM"
            placeholderTextColor={theme.semantic.mutedText}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" weight="600">
            CATEGORY
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radii.pill,
                  backgroundColor:
                    category === cat ? theme.semantic.accent : theme.semantic.card,
                  borderWidth: 1,
                  borderColor:
                    category === cat ? theme.semantic.accent : theme.semantic.border,
                }}
              >
                <AppText
                  variant="caption"
                  weight="600"
                  style={{
                    color:
                      category === cat ? theme.semantic.surface : theme.semantic.text,
                    textTransform: 'capitalize',
                  }}
                >
                  {CATEGORY_EMOJIS[cat]} {cat}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <AppButton
          label="Add Stop"
          disabled={placeName.trim() === ''}
          onPress={handleAdd}
        />
      </View>
    </Modal>
  );
}
