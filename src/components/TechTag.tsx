/**
 * Small engineering-drawing style metadata readout — e.g. "ATF / 001 —
 * ENGINEERING" or "PROJECT 014". Used throughout as a recurring industrial
 * UI detail rather than a decorative label.
 */
export default function TechTag({
  children,
  dark = false,
  onImage = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  /** Adds a corner scrim behind the tag so it stays crisp over unpredictable
   * photography (bright rock, sky, concrete) instead of relying on a
   * section-wide gradient that may not reach this exact corner. */
  onImage?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex items-center gap-2 tech-tag ${dark ? "text-ivory/50" : "text-steel"} ${className}`}>
      {onImage && (
        <span
          aria-hidden="true"
          className="absolute -inset-x-3 -inset-y-2 rounded-sm bg-gradient-to-r from-charcoal/85 via-charcoal/60 to-transparent"
        />
      )}
      <span className={`relative h-1 w-1 ${dark ? "bg-rust-light" : "bg-rust"}`} />
      <span className="relative">{children}</span>
    </div>
  );
}
