import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface LightboxItem {
  image: string;
  title: string;
  subtitle?: string;
}

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNavigate]);

  if (index === null) return null;
  const item = items[index];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-charcoal/95 flex flex-col animate-scrim-in"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="flex items-center justify-between px-5 py-4 text-ivory">
        <div className="min-w-0">
          <p className="font-medium truncate">{item.title}</p>
          {item.subtitle && <p className="text-sm text-ivory/50 truncate">{item.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            className="p-2 border border-ivory/20 hover:border-ivory/50"
          >
            {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
          </button>
          <button onClick={onClose} aria-label="Close" className="p-2 border border-ivory/20 hover:border-ivory/50">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center px-4 pb-4 min-h-0">
        {items.length > 1 && (
          <button
            aria-label="Previous"
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-2 md:p-3 border border-ivory/20 text-ivory hover:border-ivory/50 bg-charcoal/40"
          >
            <ChevronIcon direction="left" />
          </button>
        )}
        <div className={`max-h-full max-w-full overflow-auto ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}>
          <img
            src={item.image}
            alt={item.title}
            onClick={() => setZoomed((z) => !z)}
            className={`mx-auto ${zoomed ? "max-w-none w-[1400px]" : "max-h-[75vh] w-auto object-contain"}`}
          />
        </div>
        {items.length > 1 && (
          <button
            aria-label="Next"
            onClick={() => onNavigate((index + 1) % items.length)}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-2 md:p-3 border border-ivory/20 text-ivory hover:border-ivory/50 bg-charcoal/40"
          >
            <ChevronIcon direction="right" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ZoomInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12.5 12.5 17 17M8.5 6v5M6 8.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function ZoomOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12.5 12.5 17 17M6 8.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M12 4l-6 6 6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
