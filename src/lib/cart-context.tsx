"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSyncedLocalStorage, writeSyncedLocalStorage } from "@/lib/use-synced-local-storage";
import { createClient } from "@/lib/supabase/client";

/* Cart only stores identifiers + qty -- never a cached price/name. Unit
   prices/stock live in Supabase and can change, so display data is always
   fetched fresh (see resolveCartLines in ./queries/cart) rather than
   trusted from what was true when the item was added.

   `source` distinguishes a product_box_sizes row (fruit) from a
   product_variants row (everything else) -- absent on any cart persisted
   before product types existed, which this treats as "box_size" so an
   already-shopping customer's cart keeps resolving exactly as before. */
export type CartItem = {
  unitId: string;
  source?: "box_size" | "variant";
  qty: number;
};

function itemSource(item: Pick<CartItem, "source">): "box_size" | "variant" {
  return item.source ?? "box_size";
}

type CartContextValue = {
  items: CartItem[];
  addItem: (unitId: string, qty?: number, source?: "box_size" | "variant") => void;
  removeItem: (unitId: string) => void;
  updateQty: (unitId: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "theaamghar_cart";
const EMPTY_CART: CartItem[] = [];

function mergeCartItems(a: CartItem[], b: CartItem[]): CartItem[] {
  const merged = new Map<string, { qty: number; source: "box_size" | "variant" }>();
  for (const item of [...a, ...b]) {
    const existing = merged.get(item.unitId);
    merged.set(item.unitId, {
      qty: (existing?.qty ?? 0) + item.qty,
      source: itemSource(item),
    });
  }
  return [...merged.entries()].map(([unitId, v]) => ({ unitId, qty: v.qty, source: v.source }));
}

/* Best-effort background push of the current cart to cart_items for the
   signed-in user -- fire-and-forget, never blocks the UI. Deletes rows for
   anything no longer in the local cart so removals sync too. */
async function pushCartToServer(userId: string, items: CartItem[]) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("cart_items")
    .select("box_size_id, variant_id")
    .eq("profile_id", userId);

  const currentBoxSizeIds = new Set(
    items.filter((i) => itemSource(i) === "box_size").map((i) => i.unitId)
  );
  const currentVariantIds = new Set(
    items.filter((i) => itemSource(i) === "variant").map((i) => i.unitId)
  );
  const staleBoxSizeIds = (existing ?? [])
    .map((r) => r.box_size_id)
    .filter((id): id is string => id !== null && !currentBoxSizeIds.has(id));
  const staleVariantIds = (existing ?? [])
    .map((r) => r.variant_id)
    .filter((id): id is string => id !== null && !currentVariantIds.has(id));

  if (staleBoxSizeIds.length > 0) {
    await supabase.from("cart_items").delete().eq("profile_id", userId).in("box_size_id", staleBoxSizeIds);
  }
  if (staleVariantIds.length > 0) {
    await supabase.from("cart_items").delete().eq("profile_id", userId).in("variant_id", staleVariantIds);
  }

  const boxSizeItems = items.filter((i) => itemSource(i) === "box_size");
  const variantItems = items.filter((i) => itemSource(i) === "variant");

  if (boxSizeItems.length > 0) {
    await supabase.from("cart_items").upsert(
      boxSizeItems.map((i) => ({ profile_id: userId, box_size_id: i.unitId, qty: i.qty })),
      { onConflict: "profile_id,box_size_id" }
    );
  }
  if (variantItems.length > 0) {
    await supabase.from("cart_items").upsert(
      variantItems.map((i) => ({ profile_id: userId, variant_id: i.unitId, qty: i.qty })),
      { onConflict: "profile_id,variant_id" }
    );
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncedLocalStorage<CartItem[]>(STORAGE_KEY, EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);
  const lastSyncedUserId = useRef<string | null>(null);

  // Runs once per sign-in (not on every render/cart-change): pulls this
  // account's server-side cart -- saved from a previous session, possibly
  // on a different device -- and merges it into whatever's currently in
  // this browser's localStorage, rather than either one silently winning.
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const userId = session?.user?.id ?? null;
      if (event !== "SIGNED_IN" || !userId || lastSyncedUserId.current === userId) return;
      lastSyncedUserId.current = userId;

      supabase
        .from("cart_items")
        .select("box_size_id, variant_id, qty")
        .eq("profile_id", userId)
        .then(({ data }) => {
          const serverItems: CartItem[] = (data ?? []).map((r) => ({
            unitId: (r.box_size_id ?? r.variant_id) as string,
            source: r.box_size_id ? "box_size" : "variant",
            qty: r.qty,
          }));
          if (serverItems.length === 0) return; // nothing to merge in
          const localItems = readSyncedLocalStorageNow();
          const merged = mergeCartItems(localItems, serverItems);
          writeSyncedLocalStorage(STORAGE_KEY, merged);
          pushCartToServer(userId, merged);
        });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keeps the server-side backup current after every local cart mutation,
  // for whichever user is signed in right now (a no-op guest cart mutation
  // just doesn't push anywhere).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) pushCartToServer(data.user.id, items);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    function addItem(unitId: string, qty = 1, source: "box_size" | "variant" = "box_size") {
      const existing = items.find((i) => i.unitId === unitId);
      const next = existing
        ? items.map((i) => (i.unitId === unitId ? { ...i, qty: i.qty + qty } : i))
        : [...items, { unitId, qty, source }];
      writeSyncedLocalStorage(STORAGE_KEY, next);
      setIsOpen(true);
    }

    function removeItem(unitId: string) {
      writeSyncedLocalStorage(
        STORAGE_KEY,
        items.filter((i) => i.unitId !== unitId)
      );
    }

    function updateQty(unitId: string, qty: number) {
      if (qty <= 0) return removeItem(unitId);
      writeSyncedLocalStorage(
        STORAGE_KEY,
        items.map((i) => (i.unitId === unitId ? { ...i, qty } : i))
      );
    }

    function clearCart() {
      writeSyncedLocalStorage(STORAGE_KEY, []);
    }

    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [items, isOpen]);

  return <CartContext value={value}>{children}</CartContext>;
}

// Reads localStorage directly (not through the hook) for one-off use inside
// the auth-change handler above, which runs outside React's render cycle.
function readSyncedLocalStorageNow(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
