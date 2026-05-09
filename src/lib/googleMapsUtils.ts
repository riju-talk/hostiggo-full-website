// Google Maps Utilities similar to app implementation

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export interface LocationSuggestion {
  id: string;
  label: string;
  description: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
}

// Fetch location suggestions using Google Places Autocomplete
export const fetchGooglePlacesSuggestions = async (
  input: string,
): Promise<LocationSuggestion[]> => {
  if (!API_KEY) {
    console.warn('[googleMapsUtils] Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return [];
  }

  if (!input.trim()) return [];

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(input)}&types=(regions)&key=${API_KEY}`;

    const response = await fetch(url);
    const payload = await response.json();

    console.log('[googleMapsUtils] Places API response:', {
      input,
      status: payload?.status,
      predictions_count: Array.isArray(payload?.predictions)
        ? payload.predictions.length
        : 0,
    });

    if (payload?.status !== 'OK' || !Array.isArray(payload?.predictions)) {
      return [];
    }

    return payload.predictions.slice(0, 5).map((prediction: any) => {
      const description = prediction?.description || '';
      const mainText =
        prediction?.structured_formatting?.main_text || description;

      return {
        id: prediction?.place_id,
        label: mainText,
        description: description,
        placeId: prediction?.place_id,
      } as LocationSuggestion;
    });
  } catch (error) {
    console.error('[googleMapsUtils] Places API error:', error);
    return [];
  }
};

// Geocode a location using Google Geocoding API
export const geocodeLocation = async (
  query: string,
  placeId?: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!API_KEY) {
    console.warn('[googleMapsUtils] Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return null;
  }

  try {
    const endpoint = placeId
      ? `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(placeId)}&key=${API_KEY}`
      : `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    console.log('[googleMapsUtils] Geocode API response:', {
      query,
      placeId,
      status: data?.status,
      results_count: Array.isArray(data?.results) ? data.results.length : 0,
    });

    if (
      data?.status !== 'OK' ||
      !Array.isArray(data?.results) ||
      data.results.length === 0
    ) {
      return null;
    }

    const location = data.results[0].geometry?.location;
    if (location?.lat && location?.lng) {
      return { lat: location.lat, lng: location.lng };
    }

    return null;
  } catch (error) {
    console.error('[googleMapsUtils] Geocode API error:', error);
    return null;
  }
};

// Reverse geocode using coordinates to get address
export const reverseGeocodeLocation = async (
  lat: number,
  lng: number,
): Promise<string | null> => {
  if (!API_KEY) {
    console.warn('[googleMapsUtils] Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return null;
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?` +
      `latlng=${lat},${lng}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('[googleMapsUtils] Reverse geocode response:', {
      lat,
      lng,
      status: data?.status,
      results_count: Array.isArray(data?.results) ? data.results.length : 0,
    });

    if (
      data?.status === 'OK' &&
      Array.isArray(data?.results) &&
      data.results.length > 0
    ) {
      return data.results[0].formatted_address;
    }

    return null;
  } catch (error) {
    console.error('[googleMapsUtils] Reverse geocode error:', error);
    return null;
  }
};

// Get bounds for a list of coordinates
export const calculateBounds = (
  coordinates: Array<{ lat: number; lng: number }>,
): {
  north: number;
  south: number;
  east: number;
  west: number;
} | null => {
  if (coordinates.length === 0) return null;

  let north = coordinates[0].lat;
  let south = coordinates[0].lat;
  let east = coordinates[0].lng;
  let west = coordinates[0].lng;

  for (const coord of coordinates) {
    if (coord.lat > north) north = coord.lat;
    if (coord.lat < south) south = coord.lat;
    if (coord.lng > east) east = coord.lng;
    if (coord.lng < west) west = coord.lng;
  }

  // Add padding
  const latPadding = (north - south) * 0.1;
  const lngPadding = (east - west) * 0.1;

  return {
    north: north + latPadding,
    south: south - latPadding,
    east: east + lngPadding,
    west: west - lngPadding,
  };
};

// Default city coordinates (fallback)
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'New Delhi': { lat: 28.6139, lng: 77.209 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Shimla: { lat: 31.1048, lng: 77.1734 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Rishikesh: { lat: 30.0869, lng: 78.2676 },
  Goa: { lat: 15.2993, lng: 74.124 },
  Dharamshala: { lat: 32.219, lng: 76.3234 },
  Kasol: { lat: 32.0109, lng: 77.313 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
};

// India center fallback
export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };
