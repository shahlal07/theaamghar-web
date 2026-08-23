import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://eznxsosvsgkhexbjoolh.supabase.co";
const SUPABASE_KEY = "sb_publishable_iJsDi91W3kwMsfdYP7AJBA_FiIOIWvI";

// Runtime schema is authoritative. The generated Database type in this
// repository is stale relative to the canonical multi-tenant schema, so the
// client intentionally uses Supabase's untyped generic here. Vendor
// isolation is enforced by explicit vendor_id filters plus database RLS.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component -- middleware handles refresh.
        }
      },
    },
  });
}
