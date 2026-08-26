"use client";

import { useEffect, useState } from "react";

// A shrink of the visual viewport by more than this many px is treated as
// "the on-screen keyboard opened" rather than e.g. the address bar
// collapsing/expanding on scroll (which moves it by a much smaller amount).
const KEYBOARD_HEIGHT_THRESHOLD = 150;

// Used to hide UI that shouldn't end up sandwiched between a focused input
// and the keyboard -- see MobileTabBar, which used to get visually dragged
// up next to the keyboard instead of staying out of the way (a real
// customer report, with a screenshot showing the tab bar squeezed right
// above the keyboard on the track page).
export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const fullHeight = window.innerHeight;
    function check() {
      setOpen(fullHeight - vv!.height > KEYBOARD_HEIGHT_THRESHOLD);
    }
    check();
    vv.addEventListener("resize", check);
    return () => vv.removeEventListener("resize", check);
  }, []);

  return open;
}
