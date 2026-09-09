const TOKEN_KEY = "quiz_access_token";
const COOKIE_KEY = "quiz_token";

// Max-age: 24 hours in seconds (matches ACCESS_TOKEN_EXPIRE_MINUTES=1440)
const COOKIE_MAX_AGE = 60 * 60 * 24;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // Store in localStorage (for client-side API calls via Axios interceptor)
  localStorage.setItem(TOKEN_KEY, token);
  // Also write a cookie so Next.js middleware (server-side) can read it
  // SameSite=Lax works for Vercel HTTPS; Secure is set automatically on HTTPS
  const isSecure = window.location.protocol === "https:";
  document.cookie = `${COOKIE_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Clear the cookie by setting max-age=0
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}