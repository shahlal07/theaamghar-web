const STORAGE_KEY = "theaamghar_recently_viewed";
const MAX_ITEMS = 8;

function readSlugs(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function trackProductView(slug: string) {
  try {
    const current = readSlugs().filter((s) => s !== slug);
    current.unshift(slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, MAX_ITEMS)));
  } catch {
    // storage unavailable (private mode) -- fail silently
  }
}

export function getRecentlyViewedSlugs(excludeSlug?: string): string[] {
  return readSlugs().filter((s) => s !== excludeSlug);
}
