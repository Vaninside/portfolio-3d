"use client";
import { memo } from "react";

function WarmGlow() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ background: "linear-gradient(0deg, #1a0f22, transparent)" }}
    >
      <div
        className="absolute inset-0 motif-warm"
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(236,72,153,0.45), transparent 60%)",
        }}
      />
      <style jsx>{`
        .motif-warm {
          animation: motif-warm-rise 6s ease-in-out infinite alternate;
        }
        @keyframes motif-warm-rise {
          to {
            transform: translateY(-16px);
            opacity: 0.85;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-warm {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(WarmGlow);
