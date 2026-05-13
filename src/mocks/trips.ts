export const mockTrips = {
  Upcoming: [
    {
      id: '1',
      name: 'Paris Weekend',
      destination: 'Paris',
      dateRange: 'May 20 - May 23',
      status: 'In 12 days',
    },
  ],
  Past: [],
  Drafts: [
    {
      id: '2',
      name: 'Kyoto Draft',
      destination: 'Kyoto',
      dateRange: 'Unscheduled',
      status: 'Draft',
    },
  ],
} as const;
