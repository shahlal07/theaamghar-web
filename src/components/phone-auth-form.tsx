"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { safeRedirectPath } from "@/lib/safe-redirect";

// One phone-OTP flow handles both sign-up and sign-in -- a first-time
// number creates the account automatically (Supabase default), a returning
// number just signs in. Same normalization pattern already validated in
// checkout/actions.ts's PK_PHONE_PATTERN, converted to the E.164 shape
// Supabase's phone auth requires.
function normalizePhone(input: string): string | null {
  const cleaned = input.replace(/[\s-]/g, "");
  const match = cleaned.match(/^(?:\+92|0092|0)?(3\d{9})$/);
  return match ? `+92${match[1]}` : null;
}

export function PhoneAuthForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizePhone(phoneInput);
    if (!normalized) {
      setError("Enter a valid Pakistani mobile number, e.g. 0300-1234567.");
      return;
    }

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: normalized });
    setPending(false);

    if (otpError) {
      setError("Something went wrong sending the code. Please try again.");
      return;
    }
    setNormalizedPhone(normalized);
    setStep("code");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: code,
      type: "sms",
    });
    setPending(false);

    if (verifyError) {
      setError("That code didn't work — check it and try again.");
      return;
    }
    router.push(safeRedirectPath(returnTo));
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <p className="text-sm text-ink-light">
          Enter the code we texted to <span className="font-semibold">{normalizedPhone}</span>.
        </p>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm tracking-widest text-center"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={pending || code.length < 4}
          className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
        >
          {pending ? "Verifying…" : "Verify & Continue"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError(null);
          }}
          className="text-xs font-semibold text-ink-light"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <div>
        <label htmlFor="phone-otp" className="text-sm font-medium block mb-1">
          Mobile Number
        </label>
        <input
          id="phone-otp"
          type="tel"
          required
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          placeholder="0300-1234567"
          className="w-full border border-border-subtle rounded-brand-sm px-4 py-3 text-sm"
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-mango-orange text-white font-semibold py-3.5 rounded-full disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Code"}
      </button>
    </form>
  );
}
