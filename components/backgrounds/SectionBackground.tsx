"use client";
import { memo, type ComponentType, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import HeroParticles from "@/components/backgrounds/motifs/HeroParticles";
import AuroraRibbons from "@/components/backgrounds/motifs/AuroraRibbons";
import FlowingWaves from "@/components/backgrounds/motifs/FlowingWaves";
import ConstellationGrid from "@/components/backgrounds/motifs/ConstellationGrid";
import SpotlightSweep from "@/components/backgrounds/motifs/SpotlightSweep";
import MeshBlobs from "@/components/backgrounds/motifs/MeshBlobs";
import Starfield from "@/components/backgrounds/motifs/Starfield";
import WarmGlow from "@/components/backgrounds/motifs/WarmGlow";

const MOTIFS: ComponentType[] = [
  HeroParticles,
  AuroraRibbons,
  FlowingWaves,
  ConstellationGrid,
  SpotlightSweep,
  MeshBlobs,
  Starfield,
  WarmGlow,
];

const N = MOTIFS.length; // 8

function MotifLayer({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const band = 1 / N;
  const center = index * band + band / 2;
  // fade-in begins a full band before center, fade-out ends a band after.
  const p0 = Math.max(0, center - band);
  const p1 = center;
  const p2 = Math.min(1, center + band);
  const opacity = useTransform(
    progress,
    [p0, p1, p2],
    [index === 0 ? 1 : 0, 1, index === N - 1 ? 1 : 0]
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {children}
    </motion.div>
  );
}

function SectionBackground() {
  const { scrollYProgress } = useScroll();

  // Readability overlay fades in only after the hero. At progress 0 its
  // opacity is 0, so the backdrop-blur never touches the hero particles;
  // it ramps to full within the first section band as you scroll down.
  const overlayOpacity = useTransform(scrollYProgress, [0, 1 / N], [0, 1]);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      {MOTIFS.map((Motif, i) => (
        <MotifLayer key={i} index={i} progress={scrollYProgress}>
          <Motif />
        </MotifLayer>
      ))}
      {/* Readability overlay: keeps text crisp over the motifs, but stays
          fully transparent over the hero so its particles are never blurred. */}
      <motion.div
        className="absolute inset-0 bg-background/40 backdrop-blur-sm"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}

export default memo(SectionBackground);
