// lib/config.ts

// Primary production URL (your canonical domain)
const PRODUCTION_URL = "https://docmagic1.netlify.app";

// Environment detection helpers
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isNetlify = process.env.NETLIFY === "true";

// Get the appropriate base URL based on environment
export function getBaseUrl(): string {
  // 1. Use explicit env variable if set (highest priority)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return ensureHttps(process.env.NEXT_PUBLIC_APP_URL);
  }

  // 2. Vercel-specific URL
  if (isVercel && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Netlify-specific URL
  if (isNetlify && process.env.URL) {
    return ensureHttps(process.env.URL);
  }

  // 4. Default production URL (for static exports)
  return PRODUCTION_URL;
}

// For client-side usage where you need current origin
export function getClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getBaseUrl();
}

// Helper to ensure URLs use HTTPS
function ensureHttps(url: string): string {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url.replace(/^http:/, "https:");
}

// Common paths (adjust as needed)
export const PATHS = {
  home: "/",
  authCallback: "/auth/callback",
  api: {
    submit: "/api/submit",
  },
};

// Full URL generators
export const getAuthCallbackUrl = () => `${getBaseUrl()}${PATHS.authCallback}`;
export const getApiUrl = (path: keyof typeof PATHS.api) => 
  `${getBaseUrl()}${PATHS.api[path]}`;