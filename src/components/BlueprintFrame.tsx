import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Signature interaction — "Engineering Blueprint": fine technical corner
 * brackets draw themselves in around the wrapped content the first time it
 * enters the viewport, evoking a drawing being measured/annotated. Used
 * sparingly on a handful of key moments (hero stat, featured project,
 * fieldwork imagery) rather than on every element.
 */
export default function BlueprintFrame({
  children,
  className = "",
  dark = false,
}: {
  children?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stroke = dark ? "rgba(217,122,63,0.75)" : "rgba(184,83,31,0.7)";
  const armLen = 22;

  const corner = (position: "tl" | "tr" | "bl" | "br") => {
    // Same L-shaped path for every corner (top-left orientation); the other
    // three are produced by flipping via CSS scale rather than new paths.
    const path = `M0 ${armLen} V0 H${armLen}`;
    const posClass = {
      tl: "top-0 left-0",
      tr: "top-0 right-0 -scale-x-100",
      bl: "bottom-0 left-0 -scale-y-100",
      br: "bottom-0 right-0 -scale-x-100 -scale-y-100",
    }[position];
    return (
      <svg
        key={position}
        width={armLen}
        height={armLen}
        viewBox={`0 0 ${armLen} ${armLen}`}
        className={`absolute ${posClass}`}
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={1.4}
          strokeDasharray={armLen * 2}
          strokeDashoffset={visible ? 0 : armLen * 2}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1) 200ms" }}
        />
      </svg>
    );
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {corner("tl")}
      {corner("tr")}
      {corner("bl")}
      {corner("br")}
      {children}
    </div>
  );
}
