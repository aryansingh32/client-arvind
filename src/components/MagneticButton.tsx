import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Wraps a button/link and gives it a subtle cursor-attraction effect on
 * hover — desktop (pointer: fine) only, capped to a small offset so it
 * reads as premium polish rather than a gimmick. Moves the wrapper via a
 * direct style mutation (no React re-render per mousemove) for smooth,
 * GPU-friendly tracking.
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  maxOffset = 10,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  maxOffset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tx = Math.max(-maxOffset, Math.min(maxOffset, x * strength));
    const ty = Math.max(-maxOffset, Math.min(maxOffset, y * strength));

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (el) el.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (raf.current) cancelAnimationFrame(raf.current);
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
