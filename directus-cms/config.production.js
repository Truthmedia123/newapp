module.exports = {
  // Database configuration
  DB_CLIENT: 'postgresql',
  DB_HOST: 'your-db-host',
  DB_PORT: 5432,
  DB_DATABASE: 'directus_production',
  DB_USER: 'directus_user',
  DB_PASSWORD: 'your-db-password',

  // Cache configuration
  CACHE_ENABLED: true,
  CACHE_STORE: 'redis',
  CACHE_REDIS: 'redis://your-redis-host:6379',
  CACHE_AUTO_PURGE: true,

  // Storage configuration (using local storage only)
  STORAGE_LOCATIONS: 'local',
  STORAGE_LOCAL_DRIVER: 'local',
  STORAGE_LOCAL_ROOT: './uploads',

  // Security configuration
  KEY: 'your-directus-key',
  SECRET: 'your-directus-secret',
  ACCESS_TOKEN_TTL: '15m',
  REFRESH_TOKEN_TTL: '7d',
  REFRESH_TOKEN_COOKIE_SECURE: true,
  REFRESH_TOKEN_COOKIE_SAME_SITE: 'lax',

  // CORS configuration
  CORS_ENABLED: true,
  CORS_ORIGIN: 'https://thegoanwedding.com',
  CORS_CREDENTIALS: true,

  // Rate limiting
  RATE_LIMITER_ENABLED: true,
  RATE_LIMITER_POINTS: 25,
  RATE_LIMITER_DURATION: 1,

  // Email configuration
  EMAIL_TRANSPORT: 'smtp',
  EMAIL_SMTP_HOST: 'your-smtp-host',
  EMAIL_SMTP_PORT: 587,
  EMAIL_SMTP_USER: 'your-smtp-user',
  EMAIL_SMTP_PASSWORD: 'your-smtp-password',
  EMAIL_SMTP_SECURE: false,
  EMAIL_SMTP_IGNORE_TLS: false,

  // Admin account
  ADMIN_EMAIL: 'admin@thegoanwedding.com',
  ADMIN_PASSWORD: 'your-admin-password',

  // Websockets
  WEBSOCKETS_ENABLED: true,
  WEBSOCKETS_REST_ENABLED: true,
  WEBSOCKETS_GRAPHQL_ENABLED: true,

  // Logging
  LOG_LEVEL: 'info',
  LOG_STYLE: 'default'
};