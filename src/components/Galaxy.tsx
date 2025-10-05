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

  // New refs for particle core layers
  const coreParticlesRef = useRef<THREE.Points>(null);
  const innerCoreRef = useRef<THREE.Points>(null);
  const outerCoreRef = useRef<THREE.Points>(null);

  // Create Milky Way-like galaxy particles
  const particles = useMemo(() => {
    const particleCount = 10000; // More particles for denser look + scattered stars
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);
    const coreColor = new THREE.Color("#FFF8DC"); // Cream white for core
    const blueColor = new THREE.Color("#4AA3DF"); // Blue tint for outer arms

    for (let i = 0; i < particleCount; i++) {
      // 70% in spiral arms, 30% scattered between arms for natural look
      const inSpiralArm = Math.random() < 0.4;

      let finalAngle;
      let radius;

      if (inSpiralArm) {
        // Multiple spiral arms (4 arms like Milky Way)
        const spiralArms = 4;
        const armIndex = Math.floor(Math.random() * spiralArms);

        // Distance from center with power distribution for realistic density
        radius = Math.pow(Math.random(), 0.5) * 12;

        // Base angle for arm
        const baseAngle = (armIndex / spiralArms) * Math.PI * 2;

        // Spiral equation: angle increases with radius (tight spiral)
        const spiralTightness = 0.7;
        const spiralAngle = baseAngle + radius * spiralTightness;

        // Add randomness along the arm width
        const armWidth = 0.3 + radius * 0.05;
        const offsetAngle = (Math.random() - 0.5) * armWidth;

        finalAngle = spiralAngle + offsetAngle;
      } else {
        // Scattered stars between arms - completely random distribution
        radius = Math.pow(Math.random(), 0.5) * 12;
        finalAngle = Math.random() * Math.PI * 2;
      }

      // Position in XZ plane (flat galaxy disk)
      const x = Math.cos(finalAngle) * radius;
      const z = Math.sin(finalAngle) * radius;

      // Thicker disk with more pronounced bulge in center
      const diskThickness = 0.8 + (1 / (radius + 1)) * 2.5;
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

      // Brightness variation - dimmer for scattered stars
      let brightness;
      if (inSpiralArm) {
        brightness = 0.6 + Math.random() * 0.4;
      } else {
        // Scattered stars are dimmer and more varied
        brightness = 0.3 + Math.random() * 0.4;
      }

      colors[i * 3] = starColor.r * brightness;
      colors[i * 3 + 1] = starColor.g * brightness;
      colors[i * 3 + 2] = starColor.b * brightness;

      // Size variation - bigger stars near center, smaller for scattered
      const sizeVariation = Math.random();
      const centerSize = 1 / (distanceFromCenter + 1);
      const baseSize = inSpiralArm ? 0.03 : 0.02; // Scattered stars slightly smaller
      sizes[i] = baseSize + sizeVariation * 0.08 + centerSize * 0.1;
    }

    return { positions, colors, sizes };
  }, [color]);

  // Create circular particle texture for core
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;

    // Create radial gradient for circular particle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Create core particle systems like the sun
  const coreGeometry = useMemo(() => {
    // Core particles - dense, bright center
    const coreGeom = new THREE.BufferGeometry();
    const coreParticles = 8000;
    const corePositions = new Float32Array(coreParticles * 3);
    const coreColors = new Float32Array(coreParticles * 3);

    for (let i = 0; i < coreParticles; i++) {
      // Dense spherical distribution for bright core
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 radius

      corePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      corePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      corePositions[i * 3 + 2] = r * Math.cos(phi);

      // Bright white-yellow colors (more white)
      const brightness = 0.9 + Math.random() * 0.1;
      coreColors[i * 3] = brightness;        // Red - full brightness for white
      coreColors[i * 3 + 1] = brightness * 0.9;  // Green - slightly less for warm white
      coreColors[i * 3 + 2] = brightness * 0.7;  // Blue - reduced for creamy white
    }

    coreGeom.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));
    coreGeom.setAttribute("color", new THREE.BufferAttribute(coreColors, 3));

    return coreGeom;
  }, []);

  const coreMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.01,
    });
  }, [particleTexture]);

  const innerGeometry = useMemo(() => {
    // Inner core layer - medium density
    const innerGeom = new THREE.BufferGeometry();
    const innerParticles = 5000;
    const innerPositions = new Float32Array(innerParticles * 3);
    const innerColors = new Float32Array(innerParticles * 3);

    for (let i = 0; i < innerParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.5 + Math.pow(Math.random(), 2) * 1.5; // 1.5 to 3.0 radius

      innerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      innerPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      innerPositions[i * 3 + 2] = r * Math.cos(phi);

      const intensity = Math.pow(1.5 / r, 1.2);
      innerColors[i * 3] = intensity * 0.95;     // Much whiter
      innerColors[i * 3 + 1] = intensity * 0.85; // Slightly warm
      innerColors[i * 3 + 2] = intensity * 0.6;  // Minimal blue for creamy white
    }

    innerGeom.setAttribute("position", new THREE.BufferAttribute(innerPositions, 3));
    innerGeom.setAttribute("color", new THREE.BufferAttribute(innerColors, 3));

    return innerGeom;
  }, []);

  const innerMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      alphaTest: 0.01,
    });
  }, [particleTexture]);

  const outerGeometry = useMemo(() => {
    // Outer core layer - sparse, extended
    const outerGeom = new THREE.BufferGeometry();
    const outerParticles = 3000;
    const outerPositions = new Float32Array(outerParticles * 3);
    const outerColors = new Float32Array(outerParticles * 3);

    for (let i = 0; i < outerParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + Math.pow(Math.random(), 3) * 4; // 3 to 7 radius, exponential falloff

      outerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      outerPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      outerPositions[i * 3 + 2] = r * Math.cos(phi);

      const intensity = Math.pow(3 / r, 1.8);
      outerColors[i * 3] = intensity * 0.9;      // Very white
      outerColors[i * 3 + 1] = intensity * 0.75; // Warm white
      outerColors[i * 3 + 2] = intensity * 0.4;  // Minimal blue
    }

    outerGeom.setAttribute("position", new THREE.BufferAttribute(outerPositions, 3));
    outerGeom.setAttribute("color", new THREE.BufferAttribute(outerColors, 3));

    return outerGeom;
  }, []);

  const outerMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      alphaTest: 0.01,
    });
  }, [particleTexture]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (galaxyRef.current) {
      // Slow rotation
      galaxyRef.current.rotation.y = time * 0.05;
    }

    // Animate core particle systems
    if (coreParticlesRef.current) {
      coreParticlesRef.current.rotation.y = time * 0.05; // Slow rotation only
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = time * 0.03;
      const scale = 1 + Math.sin(time * 0.2) * 0.05; // Very minimal pulsing
      innerCoreRef.current.scale.setScalar(scale);
    }

    if (outerCoreRef.current) {
      outerCoreRef.current.rotation.y = time * 0.01;
      const scale = 1 + Math.sin(time * 0.15) * 0.03; // Very minimal pulsing
      outerCoreRef.current.scale.setScalar(scale);
    }

    if (glowRef.current) {
      // Very minimal pulsing glow
      const scale = 1 + Math.sin(time * 0.8) * 0.08; // Slower, smaller pulse
      glowRef.current.scale.setScalar(scale);
      glowRef.current.rotation.y = -time * 0.05; // Slower rotation
    }
  });

  return (
    <group position={center}>
      {/* Bright galactic core with particle layers */}
      <points ref={coreParticlesRef} renderOrder={4}>
        <primitive object={coreGeometry} />
        <primitive object={coreMaterial} attach="material" />
      </points>

      <points ref={innerCoreRef} renderOrder={3}>
        <primitive object={innerGeometry} />
        <primitive object={innerMaterial} attach="material" />
      </points>

      <points ref={outerCoreRef} renderOrder={2}>
        <primitive object={outerGeometry} />
        <primitive object={outerMaterial} attach="material" />
      </points>

      {/* Inner core glow - very subtle */}
      <mesh ref={glowRef} renderOrder={1}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFFAF0" // Very creamy white
          transparent
          opacity={isSelected ? 0.15 : 0.08} // Much more subtle
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

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
        <pointsMaterial
          size={0.15}
          vertexColors={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
          map={particleTexture}
        />
      </points>

      {/* Ambient light from galaxy core */}
      <pointLight
        intensity={isSelected ? 2 : 1}
        color={color}
        distance={25}
        decay={2}
      />
    </group>
  );
}
