import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export type OrbMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

const green = new THREE.Color('#1B5E20');
const greenGlow = new THREE.Color('#2E7D32');
const gold = new THREE.Color('#D4A843');
const white = new THREE.Color('#FFFFFF');

/* ─── Eye ─── */
function Eye({ position, mood }: { position: [number, number, number]; mood: OrbMood }) {
  const ref = useRef<THREE.Group>(null!);
  const pupilRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pupilRef.current) {
      if (mood === 'listening') {
        pupilRef.current.position.x = Math.sin(t * 2) * 0.015;
        pupilRef.current.position.y = Math.cos(t * 3) * 0.008;
      } else if (mood === 'thinking') {
        pupilRef.current.position.x = Math.sin(t) * 0.02;
        pupilRef.current.position.y = 0.015;
      } else {
        pupilRef.current.position.x = Math.sin(t * 0.5) * 0.008;
        pupilRef.current.position.y = 0;
      }
    }
    if (ref.current) {
      const targetScaleY = mood === 'celebrating' ? 0.3 : mood === 'thinking' ? 0.6 : mood === 'sad' ? 0.5 : 1;
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScaleY, 0.1);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial color={white} roughness={0.05} metalness={0.1} emissive={white} emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#0D3B10" roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ─── Particles (firefly sparkles) ─── */
function Particles({ mood }: { mood: OrbMood }) {
  const count = 40;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.55 + Math.random() * 0.4;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const palette = [gold, greenGlow, new THREE.Color('#A8D5A2')];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    const speed = mood === 'celebrating' ? 3 : mood === 'listening' ? 1.5 : 1;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.4 + Math.sin(t * speed) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}

/* ─── Gold Ring ─── */
function GoldRing({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.05;
    ref.current.rotation.z = t * 0.2;
    const scale = mood === 'listening' ? 1.08 + Math.sin(t * 3) * 0.04 : 1;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.42, 0.012, 16, 64]} />
      <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.6} metalness={0.9} roughness={0.15} />
    </mesh>
  );
}

/* ─── Main Orb ─── */
function OrbModel({ mood }: { mood: OrbMood }) {
  const orbRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!orbRef.current) return;

    // Breathing
    const breathe = 1 + Math.sin(t * 1.5) * 0.015;
    orbRef.current.scale.setScalar(breathe);

    // Tilt based on mood
    const targetRotX = mood === 'listening' ? 0.06 : mood === 'thinking' ? -0.04 : 0;
    orbRef.current.rotation.x = THREE.MathUtils.lerp(orbRef.current.rotation.x, targetRotX, 0.03);

    // Celebration bounce
    if (mood === 'celebrating') {
      orbRef.current.position.y = Math.abs(Math.sin(t * 5)) * 0.08;
    } else {
      orbRef.current.position.y = THREE.MathUtils.lerp(orbRef.current.position.y, 0, 0.05);
    }

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const intensity = mood === 'listening' ? 0.6 + Math.sin(t * 3) * 0.3 :
                        mood === 'celebrating' ? 0.8 + Math.sin(t * 6) * 0.2 :
                        0.3 + Math.sin(t * 1.2) * 0.1;
      mat.emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={orbRef}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 64, 64]} />
        <meshStandardMaterial
          color={green}
          roughness={0.15}
          metalness={0.3}
          emissive={greenGlow}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.38, 64, 64]} />
        <meshStandardMaterial
          color={green}
          emissive={greenGlow}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <Eye position={[-0.1, 0.05, 0.3]} mood={mood} />
      <Eye position={[0.1, 0.05, 0.3]} mood={mood} />

      {/* Subtle G emboss (small circle badge) */}
      <mesh position={[0, -0.12, 0.34]}>
        <circleGeometry args={[0.04, 32]} />
        <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gold ring */}
      <GoldRing mood={mood} />

      {/* Particles */}
      <Particles mood={mood} />

      {/* Ambient glow light */}
      <pointLight position={[0, 0, 0]} color={greenGlow} intensity={0.8} distance={3} />
      <pointLight position={[0, -0.5, 0]} color={gold} intensity={0.3} distance={1.5} />
    </group>
  );
}

/* ─── Exported Canvas ─── */
interface GrocerOrbProps {
  mood?: OrbMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GrocerOrb({ mood = 'idle', className = '', size = 'md' }: GrocerOrbProps) {
  const fov = size === 'sm' ? 50 : size === 'lg' ? 30 : 38;
  
  return (
    <div className={`w-full ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#FFFBF0" />
        <directionalLight position={[-2, 2, -3]} intensity={0.2} color="#B8E6C1" />

        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.3} floatingRange={[-0.03, 0.03]}>
          <OrbModel mood={mood} />
        </Float>
      </Canvas>
    </div>
  );
}
