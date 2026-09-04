import { useEffect, useState } from "react";

/**
 * Autoplaying muted background video with a poster-image fallback for
 * prefers-reduced-motion users (and for the brief moment before the video
 * can play). The MP4 itself is a placeholder — swap /public/videos/*.mp4
 * for real site-footage later without touching this component.
 */
export default function VideoHero({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduceMotion) {
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  return (
    <video
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={alt}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
