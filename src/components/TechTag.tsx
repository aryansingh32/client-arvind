/**
 * Small engineering-drawing style metadata readout — e.g. "ATF / 001 —
 * ENGINEERING" or "PROJECT 014". Used throughout as a recurring industrial
 * UI detail rather than a decorative label.
 */
export default function TechTag({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 tech-tag ${dark ? "text-ivory/50" : "text-steel"} ${className}`}>
      <span className={`h-1 w-1 ${dark ? "bg-rust-light" : "bg-rust"}`} />
      {children}
    </div>
  );
}
