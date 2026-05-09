import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { CITY_COORDINATES, INDIA_CENTER } from '@/lib/googleMapsUtils';

interface MapPreviewProps {
  city?: string;
  count?: number;
  coordinates?: { lat: number; lng: number };
}

export default function MapPreview({
  city = 'New Delhi',
  count = 0,
  coordinates,
}: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const getCenter = () => {
    if (coordinates) return { lat: coordinates.lat, lng: coordinates.lng };

    for (const [name, coords] of Object.entries(CITY_COORDINATES)) {
      if (city.toLowerCase().includes(name.toLowerCase())) return coords;
    }
    return INDIA_CENTER;
  };

  useEffect(() => {
    if (!mapRef.current || googleMapRef.current || !apiKey) return;

    const loadGoogleMaps = () => {
      if ((window as any).google?.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current) return;

    const center = getCenter();

    googleMapRef.current = new (window as any).google.maps.Map(mapRef.current, {
      center: center,
      zoom: 11,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ],
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      draggable: false,
      scrollwheel: false,
    });

    // Add center marker
    new (window as any).google.maps.Marker({
      position: center,
      map: googleMapRef.current,
      title: city,
    });

    setMapLoaded(true);
  };

  // Update map center when city or coordinates change
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded) return;
    const center = getCenter();
    googleMapRef.current.setCenter(center);
    googleMapRef.current.setZoom(11);
  }, [city, coordinates, mapLoaded]);

  return (
    <div
      className="rounded-2xl overflow-hidden border border-gray-100 relative"
      style={{ height: 160 }}
    >
      <div ref={mapRef} className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
            <p className="text-[11px] text-blue-500 font-medium">Loading…</p>
          </div>
        </div>
      )}

      {/* Overlay label */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent py-2 px-3 pointer-events-none">
        <p className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-500" />
          {city} · {count} properties
        </p>
      </div>
    </div>
  );
}
