"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/* Client-side auth state for components that need to react to sign-in/out
   without a full page reload (nav link, cart badge). Server Components use
   `supabase.auth.getClaims()` via src/lib/supabase/server.ts instead --
   this hook is for Client Components only. */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading: user === undefined };
}
