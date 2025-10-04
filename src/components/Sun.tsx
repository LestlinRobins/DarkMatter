import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const coreRef = useRef<THREE.Mesh>(null);
  const photosphereRef = useRef<THREE.Points>(null);
  const coronaRef = useRef<THREE.Points>(null);

  // Create circular particle texture
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

  // Create photosphere particles for a more realistic sun surface
  const { photosphereGeometry, photosphereMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particles = 100000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      // Create spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3 + (Math.random() - 0.5) * 0.1; // Slight variation in radius

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color variation from yellow to orange
      const temperature = Math.random();
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5 + temperature * 0.3;
      colors[i * 3 + 2] = temperature * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.01,
    });

    return { photosphereGeometry: geometry, photosphereMaterial: material };
  }, [particleTexture]);

  // Create corona particles
  const { coronaGeometry, coronaMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particles = 50000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      // Create larger spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 4 + Math.pow(Math.random(), 2) * 8; // Exponential falloff

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color gradient from white to orange
      const intensity = Math.pow(4 / r, 2);
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.6 + (1 - intensity) * 0.4;
      colors[i * 3 + 2] = intensity * 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      alphaTest: 0.01,
    });

    return { coronaGeometry: geometry, coronaMaterial: material };
  }, [particleTexture]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate photosphere
    if (photosphereRef.current) {
      photosphereRef.current.rotation.y = time * 0.1;
    }

    // Animate corona
    if (coronaRef.current) {
      coronaRef.current.rotation.y = time * 0.05;
      const scale = 1 + Math.sin(time * 0.2) * 0.1;
      coronaRef.current.scale.setScalar(scale);
    }

    // Update core glow
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Core glow - render first */}
      <mesh ref={coreRef} renderOrder={1}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Photosphere particles - render second */}
      <points ref={photosphereRef} renderOrder={2}>
        <primitive object={photosphereGeometry} />
        <primitive object={photosphereMaterial} attach="material" />
      </points>

      {/* Corona - render last */}
      <points ref={coronaRef} renderOrder={3}>
        <primitive object={coronaGeometry} />
        <primitive object={coronaMaterial} attach="material" />
      </points>

      {/* Enhanced lighting */}
      <pointLight intensity={2} color="#FFE5CC" distance={100} decay={2} />
      <pointLight intensity={1.5} color="#FF8C00" distance={50} decay={2} />
      <pointLight intensity={1} color="#FF4500" distance={25} decay={2} />

      {/* Ambient light for better visibility */}
      <ambientLight intensity={0.5} color="#FFE5CC" />
    </group>
  );
}
