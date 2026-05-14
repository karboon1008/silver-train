import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/core/components/empty-state';
import { AppText } from '@/core/components/app-text';
import { Screen } from '@/core/components/screen';
import { SearchField } from '@/core/components/search-field';
import { SectionHeader } from '@/core/components/section-header';
import { SegmentedControl } from '@/core/components/segmented-control';
import { DestinationCard } from '@/features/explore/components/destination-card';
import { mockDestinations, type DestinationCategory } from '@/mocks/explore';
import { routes } from '@/core/constants/routes';

const CATEGORY_FILTERS = ['All', 'City', 'Nature', 'Beach', 'Culture'] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const router = useRouter();

  const filtered = mockDestinations.filter((d) => {
    const matchesQuery =
      query === '' ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.tag.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || (d.category as string) === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <Screen scroll>
      <SectionHeader title="Explore" subtitle="Fresh ideas" />
      <SearchField value={query} onChangeText={setQuery} placeholder="Search destinations" />
      <SegmentedControl
        options={CATEGORY_FILTERS}
        value={activeCategory}
        onChange={setActiveCategory}
      />
      {query !== '' && (
        <AppText variant="caption" tone="muted">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
        </AppText>
      )}
      <View style={{ gap: 12 }}>
        {filtered.length > 0 ? (
          filtered.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onPlan={() =>
                router.push(routes.newTrip({ destination: destination.name }))
              }
            />
          ))
        ) : (
          <EmptyState
            title="No destinations found"
            description="Can't find your destination? Type it in the trip wizard and add it manually."
          />
        )}
      </View>
    </Screen>
  );
}
