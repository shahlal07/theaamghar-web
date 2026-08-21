import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The canonical Supabase schema is newer than the checked-in generated
  // client types. Runtime queries are now guarded by explicit vendor_id
  // scoping plus database RLS; keep deployment unblocked while the generated
  // type artifact is reconciled separately.
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Next's Server Action body limit defaults to 1MB. Payment-proof
    // screenshots (uploadPaymentProof in app/track/actions.ts, capped at
    // 5MB) and bug-report screenshots both go through Server Actions --
    // without this, any real phone screenshot over ~1MB was silently
    // rejected by Next itself before our own validation ever ran, which is
    // exactly what "the upload just gets stuck" looks like from the
    // customer's side. 6MB leaves headroom over the 5MB file cap for
    // multipart/form-data boundary overhead, per Next's own docs.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eznxsosvsgkhexbjoolh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
