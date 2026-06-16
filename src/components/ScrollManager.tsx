import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/* On forward navigation: jump to top, or smooth-scroll to a "/#hash" target.
   On back/forward (POP), do nothing — let the browser restore the prior scroll
   position, so returning from a post lands you back where you were. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === "POP") return;
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.scrollTo(0, 0);
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navType]);
  return null;
}
