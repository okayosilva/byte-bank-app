import { useCallback, useRef, useState } from "react";

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number, filters?: any) => Promise<T[]>;
  initialFilters?: any;
  pageSize?: number;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  error: Error | null;
  currentPage: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  setFilters: (filters: any) => void;
}

export function useInfiniteScroll<T = any>({
  fetchData,
  initialFilters,
  pageSize = 10,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState(initialFilters);

  // Ref para evitar chamadas duplicadas
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || isLoadingMore) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoadingMore(true);
      setError(null);

      const nextPage = currentPage + 1;
      const newData = await fetchData(nextPage, filters);

      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => [...prev, ...newData]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Erro ao carregar dados")
      );
    } finally {
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [currentPage, filters, hasMore, isLoadingMore, fetchData, pageSize]);

  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      setCurrentPage(0);
      setHasMore(true);

      const newData = await fetchData(0, filters);

      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData(newData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Erro ao atualizar dados")
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [filters, fetchData, pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    setIsRefreshing(false);
  }, []);

  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    currentPage,
    loadMore,
    refresh,
    reset,
    setFilters: updateFilters,
  };
}
