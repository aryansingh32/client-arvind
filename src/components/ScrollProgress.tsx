import { useEffect, useRef } from "react";

/**
 * Thin scroll-progress indicator pinned to the very top of the viewport.
 * Driven entirely by transform (scaleX), never by width, and updates via
 * direct DOM mutation on a rAF-throttled scroll listener — no per-scroll
 * React re-renders.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      raf.current = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
      <div ref={barRef} className="h-full w-full bg-rust origin-left scale-x-0" />
    </div>
  );
}
