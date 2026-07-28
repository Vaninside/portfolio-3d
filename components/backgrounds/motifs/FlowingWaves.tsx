"use client";
import { memo } from "react";

function FlowingWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-waves"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 60px, rgba(139,92,246,0.14) 60px 70px, transparent 70px 130px)",
        }}
      />
      <style jsx>{`
        .motif-waves {
          animation: motif-waves-slide 9s linear infinite;
        }
        @keyframes motif-waves-slide {
          to {
            transform: translateX(-130px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-waves {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(FlowingWaves);
