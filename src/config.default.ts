export const env = process.env

export const PORT = env.PORT ?? 8080;

export const HOST = env.HOST ?? '0.0.0.0';

export const VC_API_EXCHANGE_TIMEOUT = env.VC_API_EXCHANGE_TIMEOUT ?? 1000 * 60 * 10;

export const EXCHANGE_URL = env.EXCHANGE_URL ?? 'https://federation-regarding-present-cingular.trycloudflare.com';

// Prefer explicit server URL, fallback to EXCHANGE_URL, then LAN IP if provided
export const EXCHANGE_SERVER_URL = env.EXCHANGE_SERVER_URL ?? env.EXCHANGE_URL ?? 'https://federation-regarding-present-cingular.trycloudflare.com';

export const RP_APP_URL = env.RP_APP_URL ?? 'https://example.com';