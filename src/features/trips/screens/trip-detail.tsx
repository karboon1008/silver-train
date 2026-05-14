import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { MapHero } from '@/core/components/map-hero';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import { AddStopSheet } from '../components/add-stop-sheet';
import { DayStrip } from '../components/day-strip';
import { EditTripSheet } from '../components/edit-trip-sheet';
import { StopCard } from '../components/stop-card';
import { suggestStops } from '@/services/openai';
import type { Stop, Trip, TripDetail } from '@/types/trips';

type Props = {
  tripDetail: TripDetail;
  onBack: () => void;
  onStopPress: (stop: Stop) => void;
  onEditSave: (patch: Partial<Trip>) => void;
  onDelete: () => void;
  onAddStop: (dayId: string, stop: Stop) => void;
  onRemoveStop: (dayId: string, stopId: string) => void;
  onRemarkChange: (stopId: string, remark: string) => void;
  onAddDay: () => void;
  onDeleteDay: (dayId: string) => void;
  onMoveDay: (dayId: string, direction: 'up' | 'down') => void;
};

export default function TripDetailScreen({
  tripDetail,
  onBack,
  onStopPress,
  onEditSave,
  onDelete,
  onAddStop,
  onRemoveStop,
  onRemarkChange,
  onAddDay,
  onDeleteDay,
  onMoveDay,
}: Props) {
  const { trip, days } = tripDetail;
  const theme = useAppTheme();
  const [activeDayId, setActiveDayId] = useState(days[0]?.id ?? '');
  const [editVisible, setEditVisible] = useState(false);
  const [addStopVisible, setAddStopVisible] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<
    Array<Omit<Stop, 'id' | 'orderIndex'>>
  >([]);
  const [aiLoading, setAiLoading] = useState(false);

  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];

  async function handleAiSuggest() {
    setAiLoading(true);
    const result = await suggestStops();
    if (result.ok) setAiSuggestions(result.stops);
    setAiLoading(false);
  }

  function handleAddAiStop(s: Omit<Stop, 'id' | 'orderIndex'>, index: number) {
    if (!activeDay) return;
    const stop: Stop = {
      ...s,
      id: `stop-${Date.now()}-${index}`,
      orderIndex: activeDay.stops.length + index,
    };
    onAddStop(activeDay.id, stop);
    setAiSuggestions((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Screen scroll>
      <SectionHeader
        title={trip.name}
        subtitle={
          trip.startDate !== '' ? `${trip.startDate} – ${trip.endDate}` : 'Unscheduled'
        }
        onBack={onBack}
        actionLabel="✏️ Edit"
        onPressAction={() => setEditVisible(true)}
      />

      <MapHero destination={trip.destination} onExpand={() => undefined} />
      <DayStrip
        days={days}
        activeDay={activeDayId}
        onDayPress={setActiveDayId}
        onAddDay={onAddDay}
        onDeleteDay={(dayId) => {
          onDeleteDay(dayId);
          if (activeDayId === dayId) setActiveDayId(days.find((d) => d.id !== dayId)?.id ?? '');
        }}
        onMoveDay={onMoveDay}
      />

      {activeDay !== undefined && (
        <View style={{ marginTop: theme.spacing.sm }}>
          {activeDay.stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              isFirst={index === 0}
              isLast={index === activeDay.stops.length - 1}
              onPress={() => onStopPress(stop)}
              onRemove={() => onRemoveStop(activeDay.id, stop.id)}
              onRemarkChange={(remark) => onRemarkChange(stop.id, remark)}
            />
          ))}

          {/* AI suggestions */}
          {aiSuggestions.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => handleAddAiStop(s, i)}
              style={{
                marginTop: theme.spacing.xs,
                padding: theme.spacing.md,
                borderRadius: theme.radii.sm,
                borderWidth: 1,
                borderColor: `${theme.semantic.accent}40`,
                backgroundColor: `${theme.semantic.accent}08`,
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <AppText variant="body">{s.place.thumbnailEmoji}</AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="body" weight="500">
                  {s.place.name}
                </AppText>
                <AppText variant="caption" tone="muted">
                  {s.scheduledTime} · Tap to add
                </AppText>
              </View>
            </Pressable>
          ))}

          {/* Add stop */}
          <Pressable
            onPress={() => setAddStopVisible(true)}
            style={{
              marginTop: theme.spacing.xs,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              borderWidth: 1,
              borderColor: theme.semantic.border,
              borderStyle: 'dashed',
              alignItems: 'center',
            }}
          >
            <AppText variant="body" tone="muted">
              ＋ Add a stop
            </AppText>
          </Pressable>

          {/* AI suggest */}
          <Pressable
            onPress={handleAiSuggest}
            disabled={aiLoading}
            style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              backgroundColor: `${theme.semantic.accent}18`,
              alignItems: 'center',
              opacity: aiLoading ? 0.6 : 1,
            }}
          >
            <AppText variant="body" weight="600" tone="accent">
              {aiLoading
                ? 'Loading…'
                : `✦ Suggest more stops for Day ${activeDay.dayNumber}`}
            </AppText>
          </Pressable>
        </View>
      )}

      <EditTripSheet
        tripDetail={tripDetail}
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={onEditSave}
        onDelete={onDelete}
      />

      <AddStopSheet
        visible={addStopVisible}
        existingStopCount={activeDay?.stops.length ?? 0}
        onClose={() => setAddStopVisible(false)}
        onAdd={(stop) => {
          if (activeDay) onAddStop(activeDay.id, stop);
        }}
      />
    </Screen>
  );
}
