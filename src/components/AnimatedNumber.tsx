import { useEffect, useRef, useState } from "react";

const DURATION = 1400;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Renders a numeric string (e.g. "145+", "20+", "3") with the leading
 * digits counting up from 0 once the element scrolls into view. */
export default function AnimatedNumber({ value, className = "" }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!match) return;
    const target = parseInt(match[1], 10);
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(String(target));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          setDisplay(String(Math.round(target * easeOutExpo(progress))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {display}
      {match[2]}
    </span>
  );
}
