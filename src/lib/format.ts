// Matches vendor-admins's src/lib/format.ts formatPKR exactly (including
// the Math.round) so admin and customer-facing currency formatting never
// drift apart for the same numbers.
export function formatPKR(amount: number): string {
  return "Rs " + Math.round(amount).toLocaleString("en-PK");
}
