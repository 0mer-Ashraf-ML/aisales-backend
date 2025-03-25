export const USER_ROLES = Object.freeze({
  SUPER_ADMIN: 1,
  ADMIN: 2,
  VENDOR: 3,
  USER: 4,
  GUEST: 5,
});

export const COOKIES_LIFE = Object.freeze({
  // Minutes
  MIN_1: 60,
  MIN_5: 5 * 60,
  MIN_15: 15 * 60,
  MIN_30: 30 * 60,
  MIN_45: 45 * 60,

  // Hours
  HOUR_1: 60 * 60,
  HOUR_2: 2 * 60 * 60,
  HOUR_3: 3 * 60 * 60,
  HOUR_4: 4 * 60 * 60,
  HOUR_6: 6 * 60 * 60,
  HOUR_8: 8 * 60 * 60,
  HOUR_12: 12 * 60 * 60,
  HOUR_16: 16 * 60 * 60,
  HOUR_20: 20 * 60 * 60,

  // Days
  DAY_1: 24 * 60 * 60,
  DAY_2: 2 * 24 * 60 * 60,
  DAY_3: 3 * 24 * 60 * 60,
  DAY_4: 4 * 24 * 60 * 60,
  DAY_5: 5 * 24 * 60 * 60,
  DAY_6: 6 * 24 * 60 * 60,

  // Weeks
  WEEK_1: 7 * 24 * 60 * 60,
  WEEK_2: 2 * 7 * 24 * 60 * 60,
  WEEK_3: 3 * 7 * 24 * 60 * 60,
  WEEK_4: 4 * 7 * 24 * 60 * 60,

  // Months (approximated)
  MONTH_1: 30 * 24 * 60 * 60,
  MONTH_2: 2 * 30 * 24 * 60 * 60,
  MONTH_3: 3 * 30 * 24 * 60 * 60,
  MONTH_6: 6 * 30 * 24 * 60 * 60,
  MONTH_9: 9 * 30 * 24 * 60 * 60,

  // Years
  YEAR_1: 365 * 24 * 60 * 60,
  YEAR_2: 2 * 365 * 24 * 60 * 60,
  YEAR_3: 3 * 365 * 24 * 60 * 60,
  YEAR_5: 5 * 365 * 24 * 60 * 60,
  YEAR_10: 10 * 365 * 24 * 60 * 60,

  // Common business intervals
  BUSINESS_DAY: 8 * 60 * 60, // 8-hour work day
  BUSINESS_WEEK: 5 * 8 * 60 * 60, // 40-hour work week
  BUSINESS_MONTH: 22 * 8 * 60 * 60, // Average business days in a month
  BUSINESS_QUARTER: 65 * 8 * 60 * 60, // ~65 business days per quarter
  BUSINESS_YEAR: 260 * 8 * 60 * 60, // ~260 business days per year

  // Special intervals
  QUARTER: 91 * 24 * 60 * 60, // ~91 days
  HALF_YEAR: 182 * 24 * 60 * 60, // ~182 days
  DECADE: 10 * 365 * 24 * 60 * 60,
});

// Helper function to convert seconds to milliseconds
export const toMilliseconds = (seconds) => seconds * 1000;

// Helper function to convert seconds to minutes
export const toMinutes = (seconds) => seconds / 60;

// Helper function to convert seconds to hours
export const toHours = (seconds) => seconds / (60 * 60);

// Helper function to convert seconds to days
export const toDays = (seconds) => seconds / (24 * 60 * 60);

export const COOKIES_KEYS = Object.freeze({
  ACCESS_TOKEN: 'atkn',
  REFRESH_TOKEN: 'rtkn',
  USER: 'usr_data',
  SESSION_ID: '_sgl_sid',
});

export const COOKIE_CONFIG = Object.freeze({
  ACCESS_TOKEN_EXPIRATION: COOKIES_LIFE.MONTH_1 * 1000, // 1 day
  REFRESH_TOKEN_EXPIRATION: COOKIES_LIFE.MONTH_2 * 1000, // 7 days
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax', // Prevent CSRF attacks
  },
});

export const STRIPE_PUBLIC_KEY =
  process.env.STRIPE_PUBLIC_KEY ??
  'pk_test_51R1PxbCrZdCbaztHviwuR41rMsyn2hQENRUYLFOxZ7u9CAxSyY6BbIWePz5llghs05knPzqdgmEVexPKb4jbmn7800Go3twC6N';

export const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ??
  'sk_test_51R1PxbCrZdCbaztHJppghxhiGfB0vgzJyq4L80rg4vZhgMqqbT2bfaA4820rjBbkTbdr6JFdzV0cOJlOo9lnITBd00wd9lBzCP';
