import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppButton } from '@/core/components/app-button';
import { AppText } from '@/core/components/app-text';
import { DatePickerField } from '@/core/components/date-picker-field';
import { Screen } from '@/core/components/screen';
import { SearchField } from '@/core/components/search-field';
import { SectionHeader } from '@/core/components/section-header';
import { useAppTheme } from '@/core/theme/theme-provider';
import { getPublicEnv } from '@/config/env';
import { generateTrip } from '@/services/openai';
import { useAppStore } from '@/store/app-store';
import { routes } from '@/core/constants/routes';
import { mockDestinations } from '@/mocks/explore';
import type { TripDay, TripDetail, TripStatus } from '@/types/trips';

type Step = 1 | 2 | 3;

function nightsBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function buildDays(startDate: string, endDate: string): TripDay[] {
  const nights = nightsBetween(startDate, endDate);
  const count = nights > 0 ? nights + 1 : 1;
  const base = Date.now();
  return Array.from({ length: count }, (_, i) => {
    let date = '';
    if (startDate) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      date = d.toISOString().split('T')[0] ?? '';
    }
    return { id: `day-${base}-${i}`, date, dayNumber: i + 1, stops: [] };
  });
}

function getStatusLabel(startDate: string, status: TripStatus): string {
  if (status === 'draft') return 'Draft';
  if (!startDate) return 'Upcoming';
  const diff = Math.round(
    (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return 'Past';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function NewTripScreen() {
  const router = useRouter();
  const rawParam = useLocalSearchParams<{ destination?: string }>().destination;
  const prefill = Array.isArray(rawParam) ? (rawParam[0] ?? '') : (rawParam ?? '');
  const theme = useAppTheme();
  const addTrip = useAppStore((state) => state.addTrip);
  const hasAi = Boolean(getPublicEnv().expoPublicOpenAiBaseUrl);

  const [step, setStep] = useState<Step>(prefill ? 2 : 1);
  const [destination, setDestination] = useState(prefill);
  const [destinationQuery, setDestinationQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tripName, setTripName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const filteredDestinations = mockDestinations.filter(
    (d) =>
      destinationQuery === '' ||
      d.name.toLowerCase().includes(destinationQuery.toLowerCase()),
  );

  const nights = nightsBetween(startDate, endDate);

  function handleCreateTrip() {
    const status: TripStatus = startDate ? 'upcoming' : 'draft';
    const id = `trip-${Date.now()}`;
    const detail: TripDetail = {
      trip: {
        id,
        name: tripName.trim() || `${destination} Trip`,
        destination,
        startDate,
        endDate,
        status,
        coverEmoji: '✈️',
        stopCount: 0,
        statusLabel: getStatusLabel(startDate, status),
        aiGenerated: false,
      },
      days: buildDays(startDate, endDate),
    };
    addTrip(detail);
    router.replace(routes.tripDetail(id));
  }

  async function handleAiGenerate() {
    setAiLoading(true);
    await generateTrip();
    setAiLoading(false);
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.semantic.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    backgroundColor: theme.semantic.surface,
  } as const;

  // Step 1 — Where to?
  if (step === 1) {
    return (
      <Screen scroll>
        <SectionHeader title="Where to?" subtitle="Step 1 of 3" onBack={() => router.back()} />
        <SearchField
          value={destinationQuery}
          onChangeText={setDestinationQuery}
          placeholder="Search destinations…"
        />
        <View style={{ gap: theme.spacing.sm }}>
          {filteredDestinations.map((d) => (
            <Pressable
              key={d.id}
              onPress={() => {
                setDestination(d.name);
                setDestinationQuery('');
              }}
              style={({ pressed }) => ({
                padding: theme.spacing.md,
                borderRadius: theme.radii.sm,
                backgroundColor:
                  destination === d.name
                    ? `${theme.semantic.accent}20`
                    : theme.semantic.surface,
                borderWidth: 1,
                borderColor:
                  destination === d.name
                    ? theme.semantic.accent
                    : theme.semantic.border,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <AppText
                variant="body"
                weight={destination === d.name ? '600' : '400'}
              >
                {d.emoji} {d.name}
              </AppText>
            </Pressable>
          ))}
          {destinationQuery !== '' &&
            !filteredDestinations.some(
              (d) => d.name.toLowerCase() === destinationQuery.toLowerCase(),
            ) && (
              <Pressable
                onPress={() => setDestination(destinationQuery)}
                style={({ pressed }) => ({
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.sm,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: theme.semantic.border,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <AppText variant="body" tone="muted">
                  Use &quot;{destinationQuery}&quot; as destination
                </AppText>
              </Pressable>
            )}
        </View>
        <AppButton
          label="Next →"
          disabled={destination === ''}
          onPress={() => setStep(2)}
        />
      </Screen>
    );
  }

  // Step 2 — When?
  if (step === 2) {
    return (
      <Screen scroll>
        <SectionHeader title="When?" subtitle="Step 2 of 3" onBack={() => setStep(1)} />
        <AppText variant="title" weight="700" style={{ textAlign: 'center' }}>
          ✈️ {destination}
        </AppText>
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
        {nights > 0 && (
          <View
            style={{
              padding: theme.spacing.md,
              borderRadius: theme.radii.sm,
              backgroundColor: `${theme.semantic.accent}15`,
              alignItems: 'center',
            }}
          >
            <AppText variant="body" tone="accent" weight="600">
              📅 {nights} {nights === 1 ? 'night' : 'nights'} · {nights + 1} days
            </AppText>
          </View>
        )}
        <Pressable onPress={() => { setStartDate(''); setEndDate(''); setStep(3); }}>
          <AppText variant="body" tone="muted" style={{ textAlign: 'center' }}>
            No dates yet? Skip — plan later
          </AppText>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <AppButton
            label="← Back"
            variant="secondary"
            onPress={() => setStep(1)}
            style={{ flex: 1 }}
          />
          <AppButton label="Next →" onPress={() => setStep(3)} style={{ flex: 1 }} />
        </View>
      </Screen>
    );
  }

  // Step 3 — Name it
  return (
    <Screen scroll>
      <SectionHeader title="Name your trip" subtitle="Step 3 of 3" onBack={() => setStep(2)} />
      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="caption" weight="600">
          TRIP NAME
        </AppText>
        <TextInput
          value={tripName}
          onChangeText={setTripName}
          placeholder={`${destination} Trip`}
          placeholderTextColor={theme.semantic.mutedText}
          style={inputStyle}
        />
      </View>
      <View
        style={{
          padding: theme.spacing.md,
          borderRadius: theme.radii.sm,
          backgroundColor: `${theme.semantic.accent}10`,
          borderWidth: 1,
          borderColor: `${theme.semantic.accent}30`,
          gap: theme.spacing.sm,
        }}
      >
        <AppText variant="body" weight="600" tone="accent">
          ✦ AI-generate my itinerary
        </AppText>
        <AppText variant="caption" tone="muted">
          OpenAI will suggest stops for each day.
        </AppText>
        {hasAi ? (
          <AppButton
            label={aiLoading ? 'Generating…' : 'Generate with AI'}
            disabled={aiLoading}
            onPress={handleAiGenerate}
          />
        ) : (
          <View
            style={{
              padding: theme.spacing.sm,
              borderRadius: theme.radii.sm,
              backgroundColor: `${theme.semantic.accent}20`,
              alignItems: 'center',
            }}
          >
            <AppText variant="caption" tone="accent">
              Coming soon — add EXPO_PUBLIC_OPENAI_BASE_URL in .env
            </AppText>
          </View>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <AppButton
          label="← Back"
          variant="secondary"
          onPress={() => setStep(2)}
          style={{ flex: 1 }}
        />
        <AppButton
          label="Create Trip ✓"
          onPress={handleCreateTrip}
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}
