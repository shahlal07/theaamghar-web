// Every `returnTo` in this app comes from a query string an attacker can
// craft (e.g. a phishing link to /login?returnTo=https://evil.example),
// then rides along a real, successful login/signup/OTP/reset. Without this
// check, redirect(returnTo) or router.push(returnTo) would send the victim
// straight to an attacker-controlled site immediately after they've just
// proven their identity -- a classic open-redirect phishing amplifier.
// Anything that isn't an unambiguous same-origin relative path falls back.
export function safeRedirectPath(path: string | null | undefined, fallback = "/account"): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) return fallback;
  return path;
}
