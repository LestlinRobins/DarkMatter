import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConstellationBubbleProps {
  center: [number, number, number];
  color: string;
  radius?: number;
  isSelected: boolean;
}

export function ConstellationBubble({
  center,
  color,
  radius = 5,
  isSelected,
}: ConstellationBubbleProps) {
  const bubbleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bubbleRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
      bubbleRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={bubbleRef} position={center}>
      {/* Bubble sphere */}
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={isSelected ? 0.15 : 0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
