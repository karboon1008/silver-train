import { useState } from 'react';
import { View } from 'react-native';
import { AppCard } from '@/core/components/app-card';
import { AppText } from '@/core/components/app-text';
import { Screen } from '@/core/components/screen';
import { SearchField } from '@/core/components/search-field';
import { SectionHeader } from '@/core/components/section-header';
import { DestinationCard } from '@/features/explore/components/destination-card';
import { mockDestinations } from '@/mocks/explore';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');

  return (
    <Screen scroll>
      <SectionHeader
        title="Explore"
        subtitle="Fresh ideas"
        actionLabel="AI soon"
        onPressAction={() => undefined}
      />
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search destinations"
      />
      <AppCard>
        <AppText variant="title" weight="700">
          AI itinerary banner
        </AppText>
        <AppText tone="muted">
          Destination search is local-only for now. Later tasks can replace this shell with live
          recommendation and routing calls.
        </AppText>
      </AppCard>
      <View style={{ gap: 16 }}>
        {mockDestinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </View>
    </Screen>
  );
}
