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

function getVendorQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase
    .from("vendors")
    .select(
      "id, slug, name, subdomain, custom_domain, active, status, logo_url, accent_color, brand_colors, whatsapp_number, phone_href, phone_display, email"
    )
    .eq("active", true)
    .eq("status", "active");
}

/**
 * Resolve the storefront tenant from the actual request hostname.
 *
 * Custom domains are checked first and subdomain is checked separately so
 * PostgREST filter syntax cannot accidentally turn an unknown hostname into
 * the default TheAamGhar tenant. Unknown real storefront hosts fail closed.
 * Vercel's generated *.vercel.app host is treated as the platform/default
 * host so direct deployment URLs remain usable for verification and rollback.
 */
export const getCurrentVendor = cache(async (): Promise<StorefrontVendor> => {
  const requestHeaders = await headers();
  const host = normalizeHost(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  );
  const supabase = await createClient();

  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const isVercelDeploymentHost = host.endsWith(".vercel.app");
  const isKnownPlatformHost = PLATFORM_HOSTS.has(host) || isLocalHost || isVercelDeploymentHost;

  if (host && !isKnownPlatformHost) {
    const { data: customDomainVendor } = await getVendorQuery(supabase)
      .eq("custom_domain", host)
      .maybeSingle();
    if (customDomainVendor) return customDomainVendor as StorefrontVendor;

    const subdomain = host.endsWith(".nashemann.store")
      ? host.slice(0, -".nashemann.store".length)
      : null;
    if (subdomain) {
      const { data: subdomainVendor } = await getVendorQuery(supabase)
        .eq("subdomain", subdomain)
        .maybeSingle();
      if (subdomainVendor) return subdomainVendor as StorefrontVendor;
    }

    throw new Error(`No active vendor is configured for storefront host: ${host}`);
  }

  const { data: defaultVendor, error } = await getVendorQuery(supabase)
    .eq("slug", DEFAULT_VENDOR_SLUG)
    .single();
  if (error || !defaultVendor) throw new Error("Default platform storefront vendor is unavailable.");
  return defaultVendor as StorefrontVendor;
});

export function isPlatformHost(host: string | null): boolean {
  const normalized = normalizeHost(host);
  return PLATFORM_HOSTS.has(normalized) || normalized.endsWith(".vercel.app");
}
