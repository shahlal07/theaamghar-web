import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type StorefrontVendor = {
  id: string;
  slug: string;
  name: string;
  subdomain: string;
  custom_domain: string | null;
  active: boolean;
  status: string;
  logo_url: string | null;
  accent_color: string | null;
  brand_colors: Record<string, unknown> | null;
  whatsapp_number: string | null;
  phone_href: string | null;
  phone_display: string | null;
  email: string | null;
};

const DEFAULT_VENDOR_SLUG = "theaamghar";
const PLATFORM_HOSTS = new Set([
  "nashemann.store",
  "www.nashemann.store",
  "admin.nashemann.store",
]);

function normalizeHost(value: string | null): string {
  return (value ?? "").split(",")[0].trim().toLowerCase().split(":")[0];
}

/**
 * Resolves the storefront tenant from the request hostname.
 *
 * The hostname is only a routing hint. Database ownership remains the
 * authoritative vendor_id on every vendor-owned query and RLS remains the
 * security boundary.
 */
export const getCurrentVendor = cache(async (): Promise<StorefrontVendor> => {
  const requestHeaders = await headers();
  const host = normalizeHost(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  );

  const supabase = await createClient();
  let query = supabase
    .from("vendors")
    .select(
      "id, slug, name, subdomain, custom_domain, active, status, logo_url, accent_color, brand_colors, whatsapp_number, phone_href, phone_display, email"
    )
    .eq("active", true)
    .eq("status", "active");

  if (host && !PLATFORM_HOSTS.has(host) && host !== "localhost" && host !== "127.0.0.1") {
    const { data } = await query
      .or(`custom_domain.eq.${host},subdomain.eq.${host.split(".")[0]}`)
      .maybeSingle();
    if (data) return data as StorefrontVendor;
  }

  const { data } = await query.eq("slug", DEFAULT_VENDOR_SLUG).single();
  return data as StorefrontVendor;
});

export function isPlatformHost(host: string | null): boolean {
  return PLATFORM_HOSTS.has(normalizeHost(host));
}
