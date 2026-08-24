import { createClient } from "@/lib/supabase/client";

export type PaymentAccount = {
  id: string;
  method: "bank" | "easypaisa" | "jazzcash";
  label: string;
  account_title: string;
  account_number: string;
  bank_name: string | null;
  iban: string | null;
  instructions: string | null;
};

// Only active rows come back for anonymous/customer visitors (enforced by
// RLS, not just this query) -- an account the admin hasn't finished filling
// in stays invisible rather than showing placeholder digits to a customer
// who might actually transfer money to them.
export async function getActivePaymentAccounts(vendorId: string): Promise<PaymentAccount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payment_accounts")
    .select("id, method, label, account_title, account_number, bank_name, iban, instructions")
    .eq("vendor_id", vendorId)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getActivePaymentAccounts failed:", error);
    return [];
  }
  return (data ?? []) as PaymentAccount[];
}
