import { createClient } from "@/lib/supabase/client";

export async function getProductNamesByIds(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const supabase = createClient();
  const { data } = await supabase.from("products").select("id, name").in("id", ids);
  return new Map((data ?? []).map((p) => [p.id, p.name]));
}
