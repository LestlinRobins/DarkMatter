import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GalaxyProps {
  center: [number, number, number];
  color: string;
  isSelected: boolean;
}

export function Galaxy({ center, color, isSelected }: GalaxyProps) {
  const galaxyRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create Milky Way-like galaxy particles
  const particles = useMemo(() => {
    const particleCount = 8000; // More particles for denser look
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);
    const coreColor = new THREE.Color("#FFF8DC"); // Cream white for core
    const blueColor = new THREE.Color("#4AA3DF"); // Blue tint for outer arms

    for (let i = 0; i < particleCount; i++) {
      // Multiple spiral arms (4 arms like Milky Way)
      const spiralArms = 4;
      const armIndex = Math.floor(Math.random() * spiralArms);

      // Distance from center with power distribution for realistic density
      const radius = Math.pow(Math.random(), 0.5) * 12;

      // Base angle for arm
      const baseAngle = (armIndex / spiralArms) * Math.PI * 2;

      // Spiral equation: angle increases with radius (tight spiral)
      const spiralTightness = 0.6;
      const spiralAngle = baseAngle + radius * spiralTightness;

      // Add randomness along the arm width
      const armWidth = 0.3 + radius * 0.05;
      const offsetAngle = (Math.random() - 0.5) * armWidth;

      const finalAngle = spiralAngle + offsetAngle;

      // Position in XZ plane (flat galaxy disk)
      const x = Math.cos(finalAngle) * radius;
      const z = Math.sin(finalAngle) * radius;

      // Thin disk with bulge in center
      const diskThickness = 0.15 + (1 / (radius + 1)) * 0.5;
      const y = (Math.random() - 0.5) * diskThickness;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient: bright cream core -> yellow -> blue arms
      const distanceFromCenter = radius;
      const normalizedDistance = Math.min(distanceFromCenter / 12, 1);

      let starColor;
      if (normalizedDistance < 0.2) {
        // Core: bright cream/white
        starColor = coreColor;
      } else if (normalizedDistance < 0.5) {
        // Inner region: mix to galaxy color
        starColor = new THREE.Color().lerpColors(
          coreColor,
          colorObj,
          (normalizedDistance - 0.2) / 0.3
        );
      } else {
        // Outer arms: mix to blue
        starColor = new THREE.Color().lerpColors(
          colorObj,
          blueColor,
          (normalizedDistance - 0.5) / 0.5
        );
      }

      // Brightness variation
      const brightness = 0.6 + Math.random() * 0.4;
      colors[i * 3] = starColor.r * brightness;
      colors[i * 3 + 1] = starColor.g * brightness;
      colors[i * 3 + 2] = starColor.b * brightness;

      // Size variation - bigger stars near center
      const sizeVariation = Math.random();
      const centerSize = 1 / (distanceFromCenter + 1);
      sizes[i] = 0.03 + sizeVariation * 0.08 + centerSize * 0.1;
    }

    return { positions, colors, sizes };
  }, [color]);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: createStarTexture(),
    });
  }, []);

  // Create star texture for better appearance
  function createStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  useFrame((state) => {
    if (galaxyRef.current) {
      // Slow rotation
      galaxyRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }

    if (coreRef.current) {
      // Pulsing core
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }

    if (glowRef.current) {
      // Pulsing glow
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;
      glowRef.current.scale.setScalar(scale);
      glowRef.current.rotation.y = -state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={center}>
      {/* Galaxy disk with particles */}
      <points ref={galaxyRef} renderOrder={5}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <primitive object={particleMaterial} attach="material" />
      </points>

      {/* Bright galactic core bulge */}
      <mesh ref={coreRef} renderOrder={4}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFF8DC"
          transparent
          opacity={isSelected ? 0.6 : 0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Inner core glow - subtle */}
      <mesh ref={glowRef} renderOrder={3}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#FFE4B5"
          transparent
          opacity={isSelected ? 0.2 : 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient light from galaxy core */}
      <pointLight
        intensity={isSelected ? 1.5 : 0.8}
        color={color}
        distance={20}
        decay={2}
      />
    </group>
  );
}
