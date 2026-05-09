export interface GuestlistingSearchResults {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  price: number;
  verified: boolean;
  featured?: boolean;
}

export interface GuestlistingFullResults extends GuestlistingSearchResults {
  images: string[];
  fullLocation: string;
  overview: string;
  facilities: string[];
  cancellationRules: {
    freeCancellationBefore: string;
    refundPercentage: string;
    nonRefundableAfter: string;
  };
  nearbyLandmarks: {
    name: string;
    distance: string;
  }[];
  mapCoordinates: {
    latitude: number;
    longitude: number;
  };
  importantRules: {
    checkIn: string;
    checkOut: string;
    cleaningRule: string;
  };
  rawHostUuid: string;
  host: {
    name: string;
    photo: string;
    joinedYears: number;
    responseRate: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
  ratingBreakdown: RatingBreakdown;
  userReviews: Review[];
}

export interface LocationSummary {
  id: string;
  state: string;
  district: string;
  lowerDivisionName: string;
}

export interface LocationListings {
  location: LocationSummary;
  listings: GuestlistingSearchResults[];
}

export interface Review {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  date: string;
  comment: string;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface SearchFilters {
  state?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  ratings?: number[];
  numAdults?: number;
  numChildren?: number;
  totalGuests?: number;
  numRooms?: number;
  amenities?: string[];
  roomTypes?: string[];
  startDate?: string;
  endDate?: string;
}

export interface HostListingDetails {
  id: string;
  title: string;
  location: string;
  locationDetailed: string;
  landmark?: string;
  address_line1?: string;
  address_line2?: string;
  longitude: number;
  latitude: number;
  price: number;
  weekendPrice: number;
  images: {
    imageUrl: string;
    isMain: boolean;
  }[];
  status: 'live' | 'paused' | 'incomplete';
  overview: string;
  completionPercentage: number;
  propertyType: {
    name: string;
    description: string;
    image: string;
  };
  discounts: {
    id: string;
    percentage: number;
    name: string;
    description: string;
    enabled: boolean;
  }[];
  facilities: {
    id: number;
    icon: string;
    name: string;
  }[];
  rooms: {
    id: string;
    bedroomIndex: number;
    name: string;
    maxGuests: number;
    bathrooms: number;
    beds: number;
    bedType?: string;
  }[];
  houseRulesId: number;
  houseRules: {
    id: string;
    icon: string;
    text: string;
    time?: string;
  }[];
  addons: {
    name: string;
    price: number;
    includes?: string;
    timings?: string;
    vehicle?: string;
    fuel?: string;
    note?: string;
  }[];
  nearbyLandmarks: {
    name: string;
    distance: string;
  }[];
  rating: number;
  totalReviews: number;
  reviews?: {
    id: string;
    guestName: string;
    date: string;
    comment: string;
  }[];
}
