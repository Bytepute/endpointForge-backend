export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';
export const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 60; // 3600
export const TOKEN_TYPE = 'Bearer';
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
