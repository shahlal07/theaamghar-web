import { createClient } from "@/lib/supabase/server";

/* Site-wide chrome (footer, WhatsApp button, nav, home page contact
   section) reads from `public_business_settings`, a view -- NOT the
   `business_settings` table directly. That table's RLS is admin-only
   (private ops fields like payment_gateway_fee_percent live there too), so
   a direct query here silently returns null for every anonymous visitor.
   The view exposes just the customer-facing columns to anon/authenticated.
   `vendors` still exists and is what products/orders foreign-key against
   (and is where multi-vendor branding would live if a second vendor is
   ever added). */
export async function getSiteChrome() {
  const supabase = await createClient();

  const [{ data: vendor }, { data: settings }] = await Promise.all([
    supabase.from("vendors").select("*").eq("slug", "theaamghar").single(),
    supabase.from("public_business_settings").select("*").single(),
  ]);

  return { vendor, settings };
}
