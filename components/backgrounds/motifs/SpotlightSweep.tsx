"use client";
import { memo } from "react";

function SpotlightSweep() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute top-[-20%] h-[140%] w-[55%] motif-spotlight"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.42), transparent 60%)",
          filter: "blur(40px)",
          left: "-10%",
        }}
      />
      <style jsx>{`
        .motif-spotlight {
          animation: motif-spotlight-sweep 11s ease-in-out infinite alternate;
        }
        @keyframes motif-spotlight-sweep {
          to {
            transform: translateX(120%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-spotlight {
            animation: none;
            transform: translateX(60%);
          }
        }
      `}</style>
    </div>
  );
}

export default memo(SpotlightSweep);
