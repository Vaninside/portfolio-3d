"use client";
import { memo } from "react";

function Starfield() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.14), transparent 55%)",
      }}
    >
      <div
        className="absolute inset-0 motif-stars"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.16,
        }}
      />
      <style jsx>{`
        .motif-stars {
          animation: motif-stars-twinkle 4s ease-in-out infinite;
        }
        @keyframes motif-stars-twinkle {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.28;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .motif-stars {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}

export default memo(Starfield);
