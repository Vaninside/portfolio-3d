"use client";

import { cn } from "@/lib/utils";

export interface MarqueeProps {
  /** Content to scroll. Rendered twice for a seamless loop. */
  children: React.ReactNode;
  /** Full loop duration in seconds. Default 30. */
  speedSeconds?: number;
  /** Pause the scroll while hovered. Default true. */
  pauseOnHover?: boolean;
  /** Extra classes on the outer region. */
  className?: string;
  /** Accessible label for the scrolling region. */
  ariaLabel?: string;
}

/**
 * Marquee — infinite horizontal auto-scroll. Duplicates its children into a
 * two-half track and animates translateX(0 → -50%) so the wrap is seamless.
 * Edges fade via a mask. Pauses on hover when enabled. Under
 * prefers-reduced-motion the animation is disabled (a static, clipped row);
 * callers that need a fully static layout should branch before using Marquee.
 */
export function Marquee({
  children,
  speedSeconds = 30,
  pauseOnHover = true,
  className,
  ariaLabel,
}: MarqueeProps) {
  return (
    <div
      className={cn("marquee-root relative w-full overflow-hidden", className)}
      role="region"
      aria-label={ariaLabel}
    >
      <div className={cn("marquee-track flex w-max", pauseOnHover && "marquee-pausable")}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        .marquee-root {
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
        .marquee-track {
          animation: marquee-scroll ${speedSeconds}s linear infinite;
        }
        .marquee-pausable:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
