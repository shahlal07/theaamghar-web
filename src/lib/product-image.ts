const IMAGE_WIDTHS = [400, 700, 1000] as const;

/* products.image/gallery hold either:
   - a legacy base path like "images/products/sindhri-a" (the original 6
     seed products, photos self-hosted in /public, pre-resized to
     -w400/-w700/-w1000.jpg -- same convention as the static site this was
     ported from), or
   - a full Supabase Storage URL (anything uploaded via the admin app's
     product-image upload flow, which writes real object URLs).
   Never assume one or the other; always branch on it. */
function isRemoteUrl(path: string) {
  return path.startsWith("http://") || path.startsWith("https://");
}

export function productImageSrc(path: string, width: number = 700): string {
  if (isRemoteUrl(path)) return path;
  const nearest = IMAGE_WIDTHS.reduce((closest, w) =>
    Math.abs(w - width) < Math.abs(closest - width) ? w : closest
  );
  return `/${path}-w${nearest}.jpg`;
}
