import { useEffect, useState } from "react";
import { useContent, useContentReady } from "../lib/content";

const SESSION_KEY = "atf-intro-seen";
const HOLD_MS = 900;
const FADE_MS = 500;

// Decided once per page load via a module-level flag (not React state), so
// React 18 StrictMode's dev-only double-invoke of the mount effect can't
// cause the second pass to see its own first pass's sessionStorage write and
// wrongly conclude "already seen" — the decision itself is memoized outside
// React's render cycle. The decision is deferred until content is `ready` so
// the admin's introEnabled toggle is respected without a redeploy.
let introDecided = false;
let introShouldShow = false;

function decideIntro(introEnabled: boolean): boolean {
  if (introDecided) return introShouldShow;
  introDecided = true;

  if (typeof window === "undefined") {
    introShouldShow = false;
    return false;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
  if (!introEnabled || reduceMotion || alreadySeen) {
    introShouldShow = false;
    return false;
  }
  sessionStorage.setItem(SESSION_KEY, "1");
  introShouldShow = true;
  return true;
}

/**
 * First-visit-only brand arrival animation. Mounted once at the top of the
 * app (inside Layout, which itself never remounts across route changes), so
 * it plays exactly once per browser session — never again on internal
 * navigation, and never again if the tab is refreshed within the same
 * session. Skips entirely under prefers-reduced-motion or when disabled from
 * the admin panel.
 */
export default function LogoIntro() {
  const ready = useContentReady();
  const content = useContent();
  const [phase, setPhase] = useState<"pending" | "reveal" | "hold" | "fade" | "done">("pending");

  useEffect(() => {
    if (!ready) return;
    const shouldShow = decideIntro(content.siteSettings.introEnabled !== false);
    if (!shouldShow) {
      setPhase("done");
      return;
    }

    setPhase("reveal");
    document.body.style.overflow = "hidden";
    const toHold = window.setTimeout(() => setPhase("hold"), 700);
    const toFade = window.setTimeout(() => setPhase("fade"), 700 + HOLD_MS);
    const toDone = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 700 + HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(toHold);
      window.clearTimeout(toFade);
      window.clearTimeout(toDone);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (phase === "pending" || phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-charcoal transition-opacity ease-in ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(184,83,31,0.14),transparent_60%)]" />
      <div className="relative">
        <img
          src={content.siteSettings.logo}
          alt=""
          className="relative z-10 h-16 md:h-20 w-auto animate-logo-reveal"
        />
        <span className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <span className="absolute inset-y-0 -left-1/2 w-1/2 animate-logo-sweep bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </span>
      </div>
    </div>
  );
}
