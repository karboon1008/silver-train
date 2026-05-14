import { useState } from 'react';
import { Alert, Modal, Pressable, TextInput, View } from 'react-native';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import type { Trip, TripDetail } from '@/types/trips';

type EditPatch = Pick<Trip, 'name' | 'destination' | 'startDate' | 'endDate'>;

type Props = {
  tripDetail: TripDetail;
  visible: boolean;
  onClose: () => void;
  onSave: (patch: EditPatch) => void;
  onDelete: () => void;
};

export function EditTripSheet({ tripDetail, visible, onClose, onSave, onDelete }: Props) {
  const { trip } = tripDetail;
  const theme = useAppTheme();
  const [name, setName] = useState(trip.name);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);

  function handleSave() {
    onSave({ name, destination, startDate, endDate });
    onClose();
  }

  function handleDelete() {
    Alert.alert('Delete trip', `Delete "${trip.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
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

  const fields: Array<{ label: string; value: string; onChange: (v: string) => void; placeholder: string }> = [
    { label: 'TRIP NAME', value: name, onChange: setName, placeholder: 'Trip name' },
    { label: 'DESTINATION', value: destination, onChange: setDestination, placeholder: 'Destination' },
    { label: 'FROM (YYYY-MM-DD)', value: startDate, onChange: setStartDate, placeholder: 'YYYY-MM-DD' },
    { label: 'TO (YYYY-MM-DD)', value: endDate, onChange: setEndDate, placeholder: 'YYYY-MM-DD' },
  ];

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
          Edit trip details
        </AppText>

        {fields.map(({ label, value, onChange, placeholder }) => (
          <View key={label} style={{ gap: theme.spacing.xs }}>
            <AppText variant="caption" weight="600">
              {label}
            </AppText>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={theme.semantic.mutedText}
              style={inputStyle}
            />
          </View>
        ))}

        <AppButton label="Save Changes" onPress={handleSave} />

        <Pressable
          onPress={handleDelete}
          style={{
            padding: theme.spacing.md,
            borderRadius: theme.radii.pill,
            borderWidth: 1,
            borderColor: '#fca5a5',
            alignItems: 'center',
          }}
        >
          <AppText variant="body" weight="600" style={{ color: '#dc2626' }}>
            🗑 Delete Trip
          </AppText>
        </Pressable>
      </View>
    </Modal>
  );
}
