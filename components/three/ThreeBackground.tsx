"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useTheme } from "next-themes";

const geometries = {
  torus: <torusGeometry args={[1.3, 0.35, 32, 64]} />,
  icosahedron: <icosahedronGeometry args={[1.1, 0]} />,
  octahedron: <octahedronGeometry args={[1.2]} />,
  dodecahedron: <dodecahedronGeometry args={[1.1]} />,
  sphere: <sphereGeometry args={[1, 32, 32]} />,
};

type ShapeType = keyof typeof geometries;

type ShapeProps = {
  type: ShapeType;
  color: string;
  position: readonly [number, number, number];
  scale: number;
  speed: number;
  transparent?: boolean;
};

function FloatingShape({ type, color, position, scale, speed, transparent = true }: ShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * speed * 0.3;
    meshRef.current.rotation.y += delta * speed * 0.5;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometries[type]}
        {transparent ? (
          <MeshTransmissionMaterial
            color={color}
            transmission={0.88}
            thickness={1.3}
            roughness={0.05}
            metalness={0.05}
            ior={1.45}
            transparent
            opacity={0.82}
            envMapIntensity={1.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        ) : (
          <meshPhysicalMaterial
            color={color}
            metalness={0.15}
            roughness={0.25}
            envMapIntensity={1.5}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        )}
      </mesh>
    </Float>
  );
}
function getThemeColors(theme: string) {
  if (theme === "dark") {
    return {
      ambient: 0.35,
      directional: 0.7,
      point1: { color: "#818cf8", intensity: 0.25 }, // lighter primary
      point2: { color: "#f472b6", intensity: 0.2 }, // lighter pink
      shapes: [
        { type: "torus" as const, color: "#818cf8", position: [-2.8, 1.8, -1] as const, scale: 1.15, speed: 0.35 },
        { type: "icosahedron" as const, color: "#f472b6", position: [2.8, -1, -0.3] as const, scale: 0.95, speed: 0.55 },
        { type: "octahedron" as const, color: "#67e8f9", position: [0.5, -2.8, -2.2] as const, scale: 0.85, speed: 0.45 },
        { type: "dodecahedron" as const, color: "#c084fc", position: [-1.8, 0.5, 2.2] as const, scale: 0.75, speed: 0.28 },
        { type: "sphere" as const, color: "#fdba74", position: [2.2, 2.2, 1.2] as const, scale: 0.65, speed: 0.65 },
      ],
      gradient1: "rgba(129, 140, 248, 0.05)",
      gradient2: "rgba(244, 114, 182, 0.04)",
    };
  }
  return {
    ambient: 0.45,
    directional: 1,
    point1: { color: "#6366f1", intensity: 0.35 },
    point2: { color: "#ec4899", intensity: 0.25 },
    shapes: [
      { type: "torus" as const, color: "#6366f1", position: [-2.8, 1.8, -1] as const, scale: 1.15, speed: 0.35 },
      { type: "icosahedron" as const, color: "#ec4899", position: [2.8, -1, -0.3] as const, scale: 0.95, speed: 0.55 },
      { type: "octahedron" as const, color: "#22d3ee", position: [0.5, -2.8, -2.2] as const, scale: 0.85, speed: 0.45 },
      { type: "dodecahedron" as const, color: "#a855f7", position: [-1.8, 0.5, 2.2] as const, scale: 0.75, speed: 0.28 },
      { type: "sphere" as const, color: "#f97316", position: [2.2, 2.2, 1.2] as const, scale: 0.65, speed: 0.65 },
    ],
    gradient1: "rgba(99, 102, 241, 0.04)",
    gradient2: "rgba(236, 72, 153, 0.03)",
  };
}

export default function ThreeBackground() {
  const { theme } = useTheme();
  const colors = getThemeColors(theme ?? "dark");

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={colors.ambient} />
        <directionalLight position={[8, 8, 8]} intensity={colors.directional} />
        <pointLight position={[-8, -8, -4]} intensity={colors.point1.intensity} color={colors.point1.color} />
        <pointLight position={[8, -4, 4]} intensity={colors.point2.intensity} color={colors.point2.color} />

        {colors.shapes.map((shape, i) => (
          <FloatingShape key={i} {...shape} />
        ))}

        {/* Subtle gradient overlay for depth */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${colors.gradient1} 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, ${colors.gradient2} 0%, transparent 50%)`,
          }}
        />
      </Canvas>
    </div>
  );
}