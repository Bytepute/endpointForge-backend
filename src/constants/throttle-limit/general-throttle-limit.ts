export const generalThrottleLimit = {
  get: { limit: 100, ttl: 60000 },
  post: { limit: 20, ttl: 60000 },
  put: { limit: 15, ttl: 60000 },
  patch: { limit: 15, ttl: 60000 },
  delete: { limit: 10, ttl: 60000 },
} as const;
