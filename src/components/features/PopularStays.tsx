import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/features/PropertyCard';
import PropertyCardHomeSkeleton from '@/components/features/PropertyCardHomeSkeleton';
import type { Property } from '@/types';

interface PopularStaysProps {
  title: string;
  properties: Property[];
  isLoading?: boolean;
  itemsPerRow?: number;
}

export default function PopularStays({
  title,
  properties,
  isLoading = false,
  itemsPerRow = 4,
}: PopularStaysProps) {
  const router = useRouter();
  const city = properties[0]?.city ?? '';

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-gray-800 capitalize">
            {title}
          </h2>
          <button
            onClick={() =>
              router.push(`/search?destination=${encodeURIComponent(city)}`)
            }
            className="text-[11px] text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-2.5 py-0.5 rounded-full transition-colors font-semibold"
          >
            View all
          </button>
        </div>
        <button
          onClick={() =>
            router.push(`/search?destination=${encodeURIComponent(city)}`)
          }
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[13px] font-semibold transition-colors group"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: itemsPerRow }).map((_, i) => (
              <PropertyCardHomeSkeleton key={`skeleton-${i}`} />
            ))
          : properties.map((p) => <PropertyCard key={p.id} property={p} />)}
      </div>
    </section>
  );
}
