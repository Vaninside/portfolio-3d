"use client";
import { memo } from "react";

function MeshBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 motif-mesh"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.5), transparent 42%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.42), transparent 42%), radial-gradient(circle at 60% 20%, rgba(139,92,246,0.38), transparent 45%)",
          filter: "blur(20px)",
        }}
      />
      <style jsx>{`
        .motif-mesh {
          animation: motif-mesh-breathe 12s ease-in-out infinite alternate;
          transform-origin: center;
        }
        @keyframes motif-mesh-breathe {
          to {
            transform: scale(1.12);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-mesh {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(MeshBlobs);
