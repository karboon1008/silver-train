import { useState } from 'react';
import { View } from 'react-native';
import { MapHero } from '@/core/components/map-hero';
import { Screen } from '@/core/components/screen';
import { SectionHeader } from '@/core/components/section-header';
import { AppText } from '@/core/components/app-text';
import { useAppTheme } from '@/core/theme/theme-provider';
import { DayStrip } from '../components/day-strip';
import { StopCard } from '../components/stop-card';
import type { Stop, TripDetail } from '@/types/trips';

type Props = {
  tripDetail: TripDetail;
  onStopPress: (stop: Stop) => void;
};

export default function TripDetailScreen({ tripDetail, onStopPress }: Props) {
  const { trip, days } = tripDetail;
  const theme = useAppTheme();
  const [activeDayId, setActiveDayId] = useState(days[0]?.id ?? '');
  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];

  return (
    <Screen scroll>
      <SectionHeader
        title={trip.name}
        subtitle={trip.startDate !== '' ? `${trip.startDate} – ${trip.endDate}` : 'Unscheduled'}
      />
      <MapHero destination={trip.destination} onExpand={() => undefined} />
      <DayStrip days={days} activeDay={activeDayId} onDayPress={setActiveDayId} />
      {activeDay !== undefined && (
        <View style={{ marginTop: theme.spacing.sm }}>
          {activeDay.stops.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              isFirst={index === 0}
              isLast={index === activeDay.stops.length - 1}
              onPress={() => onStopPress(stop)}
            />
          ))}

          {/* Add stop row */}
          <View
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
          </View>

          {/* AI suggest button */}
          <View
            style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              backgroundColor: `${theme.semantic.accent}18`,
              alignItems: 'center',
            }}
          >
            <AppText
              variant="body"
              weight="600"
              tone="accent"
            >
              {`✦ Suggest more stops for Day ${activeDay.dayNumber}`}
            </AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}
