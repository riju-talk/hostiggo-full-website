'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/HeroSection';
import PopularStays from '@/components/features/PopularStays';
import CTABanner from '@/components/features/CTABanner';
import type { Property } from '@/types';
import { api, mapListingToProperty } from '@/lib/api';

type HomeSection = {
  id: string;
  title: string;
  properties: Property[];
};

export default function HomePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        const locations = await api.locations(40);
        const selected = locations
          .slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        const loaded = await Promise.all(
          selected.map(async (location: any) => {
            const rows = await api.hotelsByLocation(location.location_id, 4);
            return {
              id: String(location.location_id),
              title: `Popular stays in ${
                location.district ||
                location.lower_division_name ||
                location.state ||
                'India'
              }`,
              properties: rows
                .map(mapListingToProperty)
                .filter((item) => item.id),
            };
          }),
        );

        if (mounted) {
          setSections(
            loaded.filter((section) => section.properties.length > 0),
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[home] failed to load Supabase listings:', error);
        if (mounted) {
          setSections([]);
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />
      <HeroSection />
      <div className="container-main py-8 space-y-10">
        {isLoading ? (
          // Show 2 loading sections on initial load
          <>
            <PopularStays
              title="Popular stays loading..."
              properties={[]}
              isLoading={true}
              itemsPerRow={4}
            />
            <PopularStays
              title="Popular stays loading..."
              properties={[]}
              isLoading={true}
              itemsPerRow={4}
            />
          </>
        ) : (
          <>
            {sections.slice(0, 2).map((section) => (
              <PopularStays
                key={section.id}
                title={section.title}
                properties={section.properties}
              />
            ))}
            <CTABanner />
            {sections.slice(2).map((section) => (
              <PopularStays
                key={section.id}
                title={section.title}
                properties={section.properties}
              />
            ))}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
