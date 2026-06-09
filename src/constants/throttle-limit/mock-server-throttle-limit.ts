export const mockServerThrottleLimit = {
  start: { limit: 5, ttl: 60000 },
  stop: { limit: 10, ttl: 60000 },
} as const;
