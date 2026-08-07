"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = { message: string; type: "success" | "error" };

const ToastContext = createContext<((message: string, type?: Toast["type"]) => void) | null>(
  null
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    setToast({ message, type });
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2500);
  }, []);

  return (
    <ToastContext value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-2 px-5 py-3 rounded-full shadow-brand-lg text-white text-sm font-medium transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        } ${toast?.type === "error" ? "bg-error" : "bg-orchard-green"}`}
      >
        <span aria-hidden="true">{toast?.type === "error" ? "!" : "✓"}</span>
        <span>{toast?.message}</span>
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
