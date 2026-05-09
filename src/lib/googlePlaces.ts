/**
 * Google Places API utilities for location autocomplete
 */

export type LocationSuggestion = {
  id: string;
  district: string;
  state: string;
  lowerDivisionName: string;
  placeId?: string;
  description?: string;
  primaryText?: string;
  secondaryText?: string;
};

/**
 * Fetch location suggestions from Google Places Autocomplete API
 */
export const fetchGooglePlacesSuggestions = async (
  input: string,
  apiKey: string,
): Promise<LocationSuggestion[]> => {
  if (!apiKey) {
    console.warn('[fetchGooglePlacesSuggestions] Missing Google API key');
    return [];
  }

  if (!input.trim()) return [];

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
      `input=${encodeURIComponent(input)}&types=(regions)&key=${apiKey}`;

    const response = await fetch(url);
    const payload = await response.json();

    if (payload?.status !== 'OK' || !Array.isArray(payload?.predictions)) {
      console.warn(
        '[fetchGooglePlacesSuggestions] API error:',
        payload?.status,
      );
      return [];
    }

    return payload.predictions.slice(0, 5).map((prediction: any) => {
      const description = prediction?.description || '';
      const primaryText =
        prediction?.structured_formatting?.main_text || description;
      const secondaryText =
        prediction?.structured_formatting?.secondary_text || '';

      return {
        id: prediction?.place_id?.toString?.() || description,
        district: primaryText,
        state: secondaryText,
        lowerDivisionName: description,
        placeId: prediction?.place_id,
        description,
        primaryText,
        secondaryText,
      } as LocationSuggestion;
    });
  } catch (error) {
    console.error('[fetchGooglePlacesSuggestions] Error:', error);
    return [];
  }
};

/**
 * Get coordinates from location description using Google Geocoding
 */
export const fetchGoogleGeocode = async (
  address: string,
  apiKey: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!apiKey) {
    console.warn('[fetchGoogleGeocode] Missing Google API key');
    return null;
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/geocode/json?` +
      `address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(url);
    const payload = await response.json();

    if (payload?.status !== 'OK' || !Array.isArray(payload?.results)) {
      console.warn('[fetchGoogleGeocode] API error:', payload?.status);
      return null;
    }

    const location = payload.results[0]?.geometry?.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (error) {
    console.error('[fetchGoogleGeocode] Error:', error);
    return null;
  }
};
