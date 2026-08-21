import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export async function getSiteChrome() {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();

  const { data: settings } = await supabase
    .from("public_business_settings")
    .select("*")
    .eq("vendor_id", vendor.id)
    .maybeSingle();

  return { vendor, settings };
}
