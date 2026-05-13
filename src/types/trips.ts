export type TripStatus = 'upcoming' | 'past' | 'draft';

export type TransportMode = 'walk' | 'metro' | 'bus' | 'taxi';

export type StopCategory =
  | 'landmark'
  | 'accommodation'
  | 'mall'
  | 'station'
  | 'restaurant'
  | 'nature'
  | 'entertainment';

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  coverEmoji: string;
  stopCount: number;
  statusLabel: string;
  aiGenerated: boolean;
};

export type Place = {
  id: string;
  name: string;
  category: StopCategory;
  thumbnailEmoji: string;
  lat: number;
  lng: number;
  rating: number;
  openingHours: string;
  admissionPrice: string;
};

export type TransportSegment = {
  mode: TransportMode;
  durationMin: number;
  routeLabel: string;
};

export type Stop = {
  id: string;
  scheduledTime: string;
  orderIndex: number;
  remark: string;
  place: Place;
  transport: TransportSegment | null;
};

export type TripDay = {
  id: string;
  date: string;
  dayNumber: number;
  stops: Stop[];
};

export type TripDetail = {
  trip: Trip;
  days: TripDay[];
};
