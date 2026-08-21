import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

const SUPABASE_URL = "https://eznxsosvsgkhexbjoolh.supabase.co";
const SUPABASE_KEY = "sb_publishable_iJsDi91W3kwMsfdYP7AJBA_FiIOIWvI";

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY);
}
