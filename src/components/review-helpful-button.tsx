"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/use-user";
import { useToast } from "@/lib/toast-context";

export function ReviewHelpfulButton({
  reviewId,
  initialCount,
  initialVoted,
}: {
  reviewId: string;
  initialCount: number;
  initialVoted: boolean;
}) {
  const { user } = useUser();
  const showToast = useToast();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!user) {
      showToast("Sign in to vote this review helpful");
      return;
    }
    if (voted) return;
    startTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("mark_review_helpful", { p_review_id: reviewId });
      if (!error && typeof data === "number") {
        setCount(data);
        setVoted(true);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending || voted}
      className={`text-xs font-semibold flex items-center gap-1 ${
        voted ? "text-mango-orange" : "text-ink-light hover:text-mango-orange"
      } disabled:cursor-default`}
    >
      👍 Helpful{count > 0 ? ` (${count})` : ""}
    </button>
  );
}
