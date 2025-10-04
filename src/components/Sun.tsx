import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const fireRef = useRef<THREE.Mesh>(null);

  // Fire shader material
  const fireShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scale: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function for fire
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        }
        
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for(int i = 0; i < 6; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create turbulent fire motion
          float noise1 = fbm(vec3(uv * 3.0, time * 0.5));
          float noise2 = fbm(vec3(uv * 6.0, time * 0.8 + 10.0));
          
          // Mix noises for fire effect
          float fire = noise1 * 0.6 + noise2 * 0.4;
          
          // Make fire rise upward
          fire *= (1.0 - uv.y) * 1.5;
          
          // Add some horizontal distortion
          fire += sin(uv.x * 10.0 + time) * 0.1;
          
          // Create fire colors
          vec3 color1 = vec3(1.0, 0.9, 0.0);  // Yellow
          vec3 color2 = vec3(1.0, 0.4, 0.0);  // Orange
          vec3 color3 = vec3(1.0, 0.1, 0.0);  // Red
          vec3 color4 = vec3(0.2, 0.0, 0.0);  // Dark red
          
          vec3 fireColor;
          if(fire > 0.7) {
            fireColor = mix(color2, color1, (fire - 0.7) / 0.3);
          } else if(fire > 0.4) {
            fireColor = mix(color3, color2, (fire - 0.4) / 0.3);
          } else {
            fireColor = mix(color4, color3, fire / 0.4);
          }
          
          // Alpha for transparency
          float alpha = smoothstep(0.0, 0.5, fire);
          
          gl_FragColor = vec4(fireColor, alpha * 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Update fire shader time
    if (fireRef.current) {
      fireShader.uniforms.time.value = time;
      fireRef.current.rotation.y = time * 0.1;
    }

    // Pulsating sun effect
    if (sunRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      sunRef.current.scale.setScalar(scale);
    }

    // Rotating glow layers
    if (glowRef.current) {
      glowRef.current.rotation.z = time * 0.2;
      const glowScale = 1 + Math.sin(time * 0.8) * 0.1;
      glowRef.current.scale.setScalar(glowScale);
    }

    if (outerGlowRef.current) {
      outerGlowRef.current.rotation.z = -time * 0.15;
      const outerScale = 1 + Math.cos(time * 0.6) * 0.08;
      outerGlowRef.current.scale.setScalar(outerScale);
    }

    // Corona effect
    if (coronaRef.current) {
      coronaRef.current.rotation.x = time * 0.1;
      coronaRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#FF6B00"
          emissive="#FF4500"
          emissiveIntensity={3}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Inner Glow Layer - Orange */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Middle Glow Layer - Yellow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Corona - Light Yellow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial
          color="#FFF5E1"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Realistic Fire Layer */}
      <mesh ref={fireRef}>
        <sphereGeometry args={[3.3, 64, 64]} />
        <primitive object={fireShader} attach="material" />
      </mesh>

      {/* Directional light from sun */}
      <directionalLight intensity={2.5} color="#FFE5CC" castShadow />

      {/* Main sun point light - Brighter orange glow */}
      <pointLight intensity={5} color="#FF8C00" distance={150} decay={1.2} />

      {/* Secondary warm glow - More intense */}
      <pointLight intensity={3} color="#FFD700" distance={100} decay={1.5} />

      {/* Additional ambient orange light */}
      <pointLight intensity={2} color="#FFA500" distance={80} decay={2} />
    </group>
  );
}
