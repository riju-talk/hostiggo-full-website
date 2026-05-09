'use client';

export default function PropertyCardHomeSkeleton() {
  return (
    <div className="rounded-[14px] overflow-hidden border border-gray-100 bg-white">
      {/* Image placeholder */}
      <div className="w-full h-[170px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%] animate-shimmer" />

      {/* Details section */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%] rounded w-3/4 animate-shimmer" />

        {/* Location */}
        <div className="h-3 bg-gradient-to-r from-gray-150 via-gray-100 to-gray-150 bg-[length:1000px_100%] rounded w-1/2 animate-shimmer" />

        {/* Rating bar */}
        <div className="h-3 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 bg-[length:1000px_100%] rounded w-2/3 animate-shimmer mt-2" />

        {/* Price */}
        <div className="pt-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:1000px_100%] rounded w-1/2 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
