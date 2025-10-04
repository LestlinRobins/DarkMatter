import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Publication } from "../types";
import { categories } from "../data";

interface PublicationNodeProps {
  publication: Publication;
  onClick: (pub: Publication) => void;
  isSelected: boolean;
  isConnected: boolean;
}

export function PublicationNode({
  publication,
  onClick,
  isSelected,
  isConnected,
}: PublicationNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color =
    categories[publication.category as keyof typeof categories]?.color ||
    "#888888";

  // Create procedural crater texture and displacement
  const { craterTexture, normalMap } = useMemo(() => {
    // Create canvas for crater texture
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base planet color (darker version of category color)
    const baseColor = new THREE.Color(color).multiplyScalar(0.6);
    ctx.fillStyle = `rgb(${baseColor.r * 255}, ${baseColor.g * 255}, ${
      baseColor.b * 255
    })`;
    ctx.fillRect(0, 0, 512, 512);

    // Add surface noise/texture
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2 + 0.5;
      const brightness = Math.random() * 0.3 - 0.15;
      const surfaceColor = new THREE.Color(color).multiplyScalar(
        0.6 + brightness
      );
      ctx.fillStyle = `rgba(${surfaceColor.r * 255}, ${surfaceColor.g * 255}, ${
        surfaceColor.b * 255
      }, 0.5)`;
      ctx.fillRect(x, y, size, size);
    }

    // Add craters
    const numCraters = Math.floor(Math.random() * 8) + 12;
    for (let i = 0; i < numCraters; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 10;

      // Crater shadow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.6)");
      gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.3)");
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const craterTex = new THREE.CanvasTexture(canvas);
    craterTex.needsUpdate = true;

    // Create normal map for depth
    const normalCanvas = document.createElement("canvas");
    normalCanvas.width = 512;
    normalCanvas.height = 512;
    const normalCtx = normalCanvas.getContext("2d")!;
    normalCtx.fillStyle = "#8080FF";
    normalCtx.fillRect(0, 0, 512, 512);

    // Add normal map craters
    for (let i = 0; i < numCraters; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 10;

      const gradient = normalCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "#4040A0");
      gradient.addColorStop(0.5, "#8080FF");
      gradient.addColorStop(1, "#C0C0FF");

      normalCtx.fillStyle = gradient;
      normalCtx.beginPath();
      normalCtx.arc(x, y, radius, 0, Math.PI * 2);
      normalCtx.fill();
    }

    const normalTex = new THREE.CanvasTexture(normalCanvas);
    normalTex.needsUpdate = true;

    return { craterTexture: craterTex, normalMap: normalTex };
  }, [color, publication.id]);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth scaling with interpolation
      let targetScale = 1;
      if (isSelected) {
        targetScale = 1.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      } else if (hovered) {
        targetScale = 1.3;
      } else if (isConnected) {
        targetScale = 1.1;
      }

      // Smooth interpolation to target scale
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.1;
      groupRef.current.scale.setScalar(newScale);

      // Gentle floating animation
      groupRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() + publication.position[0]) * 0.2;
    }

    // Slow planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
  });

  // Smooth opacity transitions
  const [currentOpacity, setCurrentOpacity] = useState(0.9);
  const targetOpacity = isSelected ? 1 : isConnected ? 0.95 : 0.9;

  useFrame(() => {
    if (Math.abs(currentOpacity - targetOpacity) > 0.01) {
      setCurrentOpacity((prev) => prev + (targetOpacity - prev) * 0.1);
    }
  });

  const scale = Math.log10(publication.citations + 1) * 0.3 + 0.5;

  return (
    <group position={publication.position}>
      <group
        ref={groupRef}
        onClick={() => onClick(publication)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        {/* Main planet sphere with craters */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial
            map={craterTexture}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.5, 0.5)}
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.4 : isConnected ? 0.2 : 0.1}
            roughness={0.9}
            metalness={0.1}
            transparent
            opacity={currentOpacity}
          />
        </mesh>

        {/* Atmospheric glow */}
        <mesh scale={1.05}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isSelected ? 0.3 : isConnected ? 0.2 : 0.1}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer glow ring for selection */}
        {(isSelected || isConnected) && (
          <mesh scale={1.2}>
            <ringGeometry args={[0.6, 0.7, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isSelected ? 0.6 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              border: `2px solid ${color}`,
              maxWidth: "800px",
              fontSize: "12px",
              whiteSpace: "normal",
              transform: "translate(-50%, -120%)",
            }}
          >
            <div
              style={{ fontWeight: "bold", marginBottom: "6px", color: color }}
            >
              {publication.title}
            </div>
            <div
              style={{ fontSize: "10px", opacity: 0.8, marginBottom: "4px" }}
            >
              {publication.authors.join(", ")} ({publication.year})
            </div>
            <div style={{ fontSize: "10px", opacity: 0.7 }}>
              📊 {publication.citations} citations | 🏷️ {publication.category}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
