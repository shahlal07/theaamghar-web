import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type RateLimitOptions = {
  maxAttempts: number;
  windowMinutes: number;
  lockMinutes: number;
};

type RateLimitResult = { allowed: boolean; retryAfter: string | null };

// Generic wrapper around the check_and_record_rate_limit RPC (a parameterized
// version of the same row-lock/increment/lockout primitive checkCoupon() in
// checkout/actions.ts already uses for coupon-guessing prevention). Fails
// closed on any RPC error, same as that existing call site -- a broken
// rate limiter shouldn't become an open door.
export async function checkRateLimit(
  supabase: SupabaseClient<Database>,
  bucket: string,
  identifier: string,
  { maxAttempts, windowMinutes, lockMinutes }: RateLimitOptions
): Promise<RateLimitResult> {
  const { data } = await supabase
    .rpc("check_and_record_rate_limit", {
      p_bucket: bucket,
      p_identifier: identifier,
      p_max_attempts: maxAttempts,
      p_window_minutes: windowMinutes,
      p_lock_minutes: lockMinutes,
    })
    .single();

  return { allowed: data?.allowed === true, retryAfter: data?.retry_after ?? null };
}

// Same x-forwarded-for/x-real-ip extraction checkCoupon() already uses,
// factored out for the new anonymous-caller rate-limited routes.
export function getRequestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
