import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes to reduce database hits
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Don't refetch on window focus to reduce egress
      refetchOnWindowFocus: false,
      // Retry failed requests only once
      retry: 1,
      // Don't refetch on reconnect to reduce egress
      refetchOnReconnect: false,
    },
  },
});
