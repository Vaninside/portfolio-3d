"use client";
import { memo } from "react";

function ConstellationGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-constellation"
        style={{
          backgroundImage:
            "radial-gradient(rgba(236,72,153,0.5) 1.5px, transparent 1.5px), radial-gradient(rgba(99,102,241,0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px, 44px 44px",
          backgroundPosition: "0 0, 22px 22px",
        }}
      />
      <style jsx>{`
        .motif-constellation {
          animation: motif-constellation-pulse 5s ease-in-out infinite;
        }
        @keyframes motif-constellation-pulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.75;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-constellation {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(ConstellationGrid);
