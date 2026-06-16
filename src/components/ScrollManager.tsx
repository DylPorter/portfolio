import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* On route change: jump to top. If the target carries a hash (e.g. "/#writing"),
   smooth-scroll to that section once the page has rendered. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
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
  }, [pathname, hash]);
  return null;
}
