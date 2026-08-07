import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    // AVIF first (smaller than WebP at equivalent quality on photos like
    // this catalog's product shots), WebP fallback for browsers/devices
    // that don't support it -- Next serves whichever the request's Accept
    // header prefers, sharp (already a dependency) handles the encode.
    formats: ["image/avif", "image/webp"],
    // Product photos are either a legacy local base path (served from
    // /public/images/products) or, for anything added through the admin
    // app's upload flow, a real Supabase Storage URL -- see
    // src/lib/product-image.ts for how the two are told apart.
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
