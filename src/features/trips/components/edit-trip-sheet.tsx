import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { DatePickerField } from '@/core/components/date-picker-field';
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleSave() {
    onSave({ name, destination, startDate, endDate });
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={() => { setConfirmingDelete(false); onClose(); }}
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

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" weight="600" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Trip Name
          </AppText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Trip name"
            placeholderTextColor={theme.semantic.mutedText}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" weight="600" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Destination
          </AppText>
          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder="Destination"
            placeholderTextColor={theme.semantic.mutedText}
            style={inputStyle}
          />
        </View>

        <DatePickerField
          label="From"
          value={startDate}
          onChange={(iso) => {
            setStartDate(iso);
            if (endDate && endDate < iso) setEndDate(iso);
          }}
        />

        <DatePickerField
          label="To"
          value={endDate}
          onChange={setEndDate}
          minimumDate={startDate ? new Date(`${startDate}T00:00:00`) : undefined}
        />

        <AppButton label="Save Changes" onPress={handleSave} />

        {confirmingDelete ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#fca5a5',
              borderRadius: theme.radii.sm,
              padding: theme.spacing.md,
              gap: theme.spacing.sm,
              backgroundColor: '#fff5f5',
            }}
          >
            <AppText variant="body" weight="600" style={{ color: '#dc2626', textAlign: 'center' }}>
              Delete "{trip.name}" permanently?
            </AppText>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Pressable
                onPress={() => setConfirmingDelete(false)}
                style={{
                  flex: 1,
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.sm,
                  borderWidth: 1,
                  borderColor: theme.semantic.border,
                  alignItems: 'center',
                }}
              >
                <AppText variant="body" weight="600">Cancel</AppText>
              </Pressable>
              <Pressable
                onPress={onDelete}
                style={{
                  flex: 1,
                  padding: theme.spacing.sm,
                  borderRadius: theme.radii.sm,
                  backgroundColor: '#dc2626',
                  alignItems: 'center',
                }}
              >
                <AppText variant="body" weight="600" style={{ color: '#ffffff' }}>
                  Delete
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setConfirmingDelete(true)}
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
        )}
      </View>
    </Modal>
  );
}
