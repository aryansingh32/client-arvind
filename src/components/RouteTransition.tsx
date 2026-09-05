import { useEffect, useState, type ReactNode } from "react";
import { useLocation, Routes } from "react-router-dom";

const OUT_MS = 240;

/**
 * Route-level page transition. The chrome (Navbar/Footer/ContactDock) stays
 * mounted and static across navigation — only the routed page content
 * crossfades. Renders the outgoing page during a brief fade/slide-out, then
 * swaps to the new route's content once that finishes. Respects
 * prefers-reduced-motion via the global CSS rule that collapses animation
 * durations, so the swap becomes effectively instant for those users.
 */
export default function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState<"in" | "out">("in");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage("out");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (stage !== "out") return;
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      setDisplayLocation(location);
      setStage("in");
    }, OUT_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <div key={displayLocation.pathname} className={stage === "out" ? "route-fade-out" : "route-fade-in"}>
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}
