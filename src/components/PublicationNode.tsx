import { useRef, useState } from "react";
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
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color =
    categories[publication.category as keyof typeof categories]?.color ||
    "#888888";

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.scale.setScalar(
          1.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2
        );
      } else if (hovered) {
        meshRef.current.scale.setScalar(1.3);
      } else {
        meshRef.current.scale.setScalar(1);
      }

      // Gentle floating animation
      meshRef.current.position.y =
        publication.position[1] +
        Math.sin(state.clock.getElapsedTime() + publication.position[0]) * 0.2;
    }
  });

  const opacity = isSelected ? 1 : isConnected ? 0.8 : 0.5;
  const scale = Math.log10(publication.citations + 1) * 0.3 + 0.5;

  return (
    <group position={publication.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(publication)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : isConnected ? 0.5 : 0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh scale={scale * 1.2}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.6 : isConnected ? 0.3 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              border: `2px solid ${color}`,
              maxWidth: "300px",
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
