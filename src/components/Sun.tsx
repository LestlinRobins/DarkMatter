import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const coreRef = useRef<THREE.Mesh>(null);
  const photosphereRef = useRef<THREE.Points>(null);
  const coronaRef = useRef<THREE.Points>(null);
  const prominenceRef = useRef<THREE.Points>(null);

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

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    return { photosphereGeometry: geometry, photosphereMaterial: material };
  }, []);

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

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    return { coronaGeometry: geometry, coronaMaterial: material };
  }, []);

  // Create solar prominences
  const { prominenceGeometry, prominenceMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = 10000;
    const positions = new Float32Array(points * 3);
    const colors = new Float32Array(points * 3);

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const height = Math.sin(angle * 3) * 0.5;
      const radius = 3.5 + Math.sin(angle * 5) * 0.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Hot orange-red color
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    return { prominenceGeometry: geometry, prominenceMaterial: material };
  }, []);

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

    // Animate prominences
    if (prominenceRef.current) {
      prominenceRef.current.rotation.y = time * 0.2;
      prominenceRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // Update core glow
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Core glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Photosphere particles */}
      <points ref={photosphereRef}>
        <primitive object={photosphereGeometry} />
        <primitive object={photosphereMaterial} attach="material" />
      </points>

      {/* Corona */}
      <points ref={coronaRef}>
        <primitive object={coronaGeometry} />
        <primitive object={coronaMaterial} attach="material" />
      </points>

      {/* Solar prominences */}
      <points ref={prominenceRef}>
        <primitive object={prominenceGeometry} />
        <primitive object={prominenceMaterial} attach="material" />
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
