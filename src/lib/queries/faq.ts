import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export type FaqEntry = { id: string; question: string; answer: string };

export async function getActiveFaqs(): Promise<FaqEntry[]> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  const { data } = await supabase
    .from("faq_entries")
    .select("id, question, answer")
    .eq("vendor_id", vendor.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}
