"use client";
import { memo } from "react";

function AuroraRibbons() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -inset-[40%] motif-aurora"
        style={{
          background:
            "conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
          filter: "blur(60px)",
          opacity: 0.4,
        }}
      />
      <style jsx>{`
        .motif-aurora {
          animation: motif-aurora-spin 22s linear infinite;
        }
        @keyframes motif-aurora-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-aurora {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(AuroraRibbons);
