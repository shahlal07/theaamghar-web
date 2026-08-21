import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor, isPlatformHost } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (isPlatformHost(host)) return NextResponse.json({ ok: true, scoped: false });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const vendor = await getCurrentVendor();
    const { error } = await supabase.rpc("ensure_customer_vendor", { p_vendor_id: vendor.id });
    if (error) return NextResponse.json({ error: error.message }, { status: 409 });

    return NextResponse.json({ ok: true, vendorId: vendor.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Couldn't associate this account with the store." }, { status: 500 });
  }
}
