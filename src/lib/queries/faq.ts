import { createClient } from "@/lib/supabase/server";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

// Reads the admin-managed FAQ knowledge base (public SELECT by design --
// see faq_entries' table comment). Empty today until an admin populates it;
// the homepage FAQ section falls back to a small static list rather than
// rendering nothing in that case.
export async function getActiveFaqs(): Promise<FaqEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq_entries")
    .select("id, question, answer")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}
