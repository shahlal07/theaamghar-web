"use server";

import { createClient } from "@/lib/supabase/server";
import { sendAdminPaymentProofAlert, ADMIN_ALERT_EMAIL } from "@/lib/email";

export type UploadProofState = { error: string } | { success: true } | undefined;

const MAX_PROOF_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function uploadPaymentProof(
  _prev: UploadProofState,
  formData: FormData
): Promise<UploadProofState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to upload your payment proof." };

  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const file = formData.get("proof");

  if (!orderNumber) return { error: "Missing order number." };
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a screenshot or PDF receipt to upload." };
  }
  if (file.size > MAX_PROOF_BYTES) {
    return { error: "That file is too large — please keep it under 5MB." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Please upload a JPG, PNG, WebP or PDF file." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  // Folder-per-user path, matching the review-images convention -- the
  // storage RLS policy keys off this first segment being the caller's uid.
  const path = `${user.id}/${orderNumber}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { error: "Couldn't upload that file. Please try again." };
  }

  // Customers have no UPDATE policy on orders by design -- this RPC is the
  // only path, and it can only touch the payment-proof columns of an order
  // they own that isn't already verified.
  const { error: rpcError } = await supabase.rpc("attach_payment_proof", {
    p_order_number: orderNumber,
    p_proof_path: path,
  });

  if (rpcError) {
    return { error: "Couldn't attach that proof to your order. Please contact us on WhatsApp." };
  }

  if (ADMIN_ALERT_EMAIL) {
    // Best-effort: RLS already scopes this to the caller's own order, and a
    // failed lookup just means a slightly less detailed alert email, not a
    // failed upload (which already succeeded above).
    const { data: order } = await supabase
      .from("orders")
      .select("total")
      .eq("order_number", orderNumber)
      .maybeSingle();

    await sendAdminPaymentProofAlert({
      to: ADMIN_ALERT_EMAIL,
      orderNumber,
      total: Number(order?.total ?? 0),
    });
  }

  return { success: true };
}
