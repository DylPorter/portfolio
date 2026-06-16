import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll position per history entry. Module-level so it survives route remounts.
const positions = new Map<string, number>();

/* Manual scroll restoration. The browser's built-in restoration double-jumps on
   a remounting SPA route (restores early, then re-corrects after layout). We own it:
   - save each entry's position in the cleanup (runs BEFORE the next route scrolls)
   - POP (back/forward): restore that entry's position, re-applying across a few
     frames in case the page is still growing (images/layout settling)
   - PUSH/REPLACE with a #hash: smooth-scroll to that section; otherwise top. */
export function ScrollManager() {
  const { key, hash } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const saved = positions.get(key);
    if (navType === "POP" && saved != null) {
      let frame = 0;
      const restore = () => {
        window.scrollTo(0, saved);
        if (Math.abs(window.scrollY - saved) > 1 && frame++ < 20) requestAnimationFrame(restore);
      };
      restore();
    } else if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
    // Save this entry's scroll on the way out, before the next route's scroll runs.
    return () => { positions.set(key, window.scrollY); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
