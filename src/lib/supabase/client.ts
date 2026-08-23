import { createBrowserClient } from "@supabase/ssr";

// Falls back to the same canonical project/key used by the server and
// middleware clients (src/lib/supabase/server.ts, middleware.ts) if the env
// vars aren't set on the deployment -- keeps the browser client pointed at
// the real data even if a Vercel env var is missing or misnamed.
const FALLBACK_URL = "https://eznxsosvsgkhexbjoolh.supabase.co";
const FALLBACK_KEY = "sb_publishable_iJsDi91W3kwMsfdYP7AJBA_FiIOIWvI";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    FALLBACK_KEY;

  return createBrowserClient(url, key);
}
