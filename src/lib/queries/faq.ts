import { createClient } from "@/lib/supabase/server";
import { getCurrentVendor } from "@/lib/tenant";

export type FaqEntry = { id: string; question: string; answer: string };

export async function getActiveFaqs(): Promise<FaqEntry[]> {
  const supabase = await createClient();
  const vendor = await getCurrentVendor();
  // The checked-in generated Database type predates the vendor_id column on
  // faq_entries; the live database is authoritative for this tenant filter.
  const faqQuery = supabase.from("faq_entries") as any;
  const { data } = await faqQuery
    .select("id, question, answer")
    .eq("vendor_id", vendor.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
