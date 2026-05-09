import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook that implements infinite scroll using Intersection Observer
 * Automatically calls onLoadMore when user scrolls near the bottom
 *
 * Matches app behavior: onEndReachedThreshold={0.5}
 *
 * @param onLoadMore - Callback to fetch more data
 * @param hasMore - Whether there are more items to load
 * @param isLoading - Whether data is currently loading
 * @param options - Configuration options
 */
export function useInfiniteScroll(
  onLoadMore: () => void | Promise<void>,
  hasMore: boolean,
  isLoading: boolean,
  options: UseInfiniteScrollOptions = {},
) {
  const { threshold = 0.5, rootMargin = '0px 0px 0px 0px' } = options;

  // Sentinel element to observe
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Prevent duplicate fetches
  const loadingRef = useRef(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      // Load more when sentinel is visible and not already loading
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !loadingRef.current
      ) {
        loadingRef.current = true;
        onLoadMore();

        // Reset flag after a short delay to prevent rapid-fire calls
        setTimeout(() => {
          loadingRef.current = false;
        }, 300);
      }
    },
    [onLoadMore, hasMore, isLoading],
  );

  useEffect(() => {
    // Create observer with threshold (triggers when element is 50% visible)
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Start observing sentinel
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  return sentinelRef;
}

/**
 * Alternative: useVirtualScroll hook for very large lists
 * (Optional - use if you have 1000+ items)
 */
export function useScrollPosition(
  callback: (scrollTop: number) => void,
  elementRef?: React.RefObject<HTMLDivElement>,
) {
  useEffect(() => {
    const element = elementRef?.current || window;

    const handleScroll = () => {
      const scrollTop =
        element instanceof Window ? element.scrollY : element.scrollTop;

      callback(scrollTop);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [callback, elementRef]);
}
