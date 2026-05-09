'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';
import {
  fetchGooglePlacesSuggestions,
  type LocationSuggestion,
} from '@/lib/googlePlaces';
import { useListingActions } from '@/context/ListingFilterContext';
import { cn } from '@/lib/utils';

interface LocationDropdownProps {
  value: string;
  onChange?: (location: LocationSuggestion) => void;
  onClose?: () => void;
  placeholder?: string;
}

export function LocationDropdown({
  value,
  onChange,
  onClose,
  placeholder = 'Search destination...',
}: LocationDropdownProps) {
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const { setLocation } = useListingActions();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || !apiKey) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchGooglePlacesSuggestions(query, apiKey);
        setSuggestions(results);
      } catch (error) {
        console.error('[LocationDropdown] Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiKey],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInput(newValue);
      setIsOpen(true);

      // Debounce the API call
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, 300);
    },
    [fetchSuggestions],
  );

  const handleSelectLocation = useCallback(
    (location: LocationSuggestion) => {
      setInput((location.description || location.primaryText) ?? "");
      setIsOpen(false);
      setSuggestions([]);
      setLocation({ query: location.district || location.state || location.primaryText || '' });
      onChange?.(location);
    },
    [onChange, setLocation],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.target) return;
      const target = e.target as HTMLElement;
      if (!target.closest('.location-dropdown-container')) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="location-dropdown-container relative w-full">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full h-[52px] px-5 rounded-full border-2 text-[14px]',
            'bg-white focus:outline-none transition-all',
            isOpen ? 'border-blue-400' : 'border-transparent',
          )}
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {suggestions.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-3 group"
                >
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate group-hover:text-blue-600">
                      {location.primaryText}
                    </p>
                    {location.secondaryText && (
                      <p className="text-[12px] text-gray-500 truncate">
                        {location.secondaryText}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : input.trim() ? (
            <div className="text-center py-6 px-4">
              <p className="text-[13px] text-gray-500">No locations found</p>
            </div>
          ) : (
            <div className="text-center py-6 px-4">
              <p className="text-[13px] text-gray-500">
                Type to search locations
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
