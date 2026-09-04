import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Word-by-word masked reveal for major headlines. Each line is rendered as
 * its own block; each word sits inside a small overflow-hidden mask and
 * slides up into place with a per-word stagger. GPU-friendly (transform +
 * opacity only). Respects prefers-reduced-motion via the global CSS rule
 * that collapses all transition-durations to ~0.
 */
export default function AnimatedText({
  lines,
  as = "h1",
  className = "",
  trigger = "scroll",
  baseDelay = 0,
  wordDelay = 45,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  trigger?: "scroll" | "mount";
  baseDelay?: number;
  wordDelay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === "mount") {
      const t = window.setTimeout(() => setVisible(true), 20);
      return () => window.clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger]);

  const Component = as;
  let wordIndex = 0;

  return (
    <Component ref={ref} className={className}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block">
            {words.map((word, wi) => {
              const delay = baseDelay + wordIndex * wordDelay;
              wordIndex++;
              return (
                <span key={wi}>
                  <span className="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em] align-bottom">
                    <span
                      className={`inline-block transition-all ease-out ${
                        visible ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                      style={{ transitionDuration: "700ms", transitionDelay: `${delay}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                  {wi < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        );
      })}
    </Component>
  );
}
