import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://mztayodmvdpzzwzznsvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dGF5b2RtdmRwenp3enpuc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NDQ5NzYsImV4cCI6MjEwMjMyMDk3Nn0.lDEup88roTPXpM1bVCSxjVWxeiWcstwD82fdlyBu99k";

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
