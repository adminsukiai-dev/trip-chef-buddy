import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export type OrbMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

const emerald = new THREE.Color('#0D4A1A');
const emeraldGlow = new THREE.Color('#1B7A30');
const gold = new THREE.Color('#D4A843');
const softGreen = new THREE.Color('#2E8B3D');

/* ─── Ambient Particles (fireflies/sparkles) ─── */
function AmbientParticles({ mood }: { mood: OrbMood }) {
  const count = 60;
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const palette = [gold, emeraldGlow, new THREE.Color('#A8D5A2'), new THREE.Color('#FFE0A0')];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 0.6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      sz[i] = 0.008 + Math.random() * 0.02;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const speed = mood === 'listening' ? 0.4 : mood === 'celebrating' ? 0.6 : mood === 'thinking' ? 0.3 : 0.12;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute('position');
    for (let i = 0; i < count; i++) {
      const phase = i * 0.5;
      const scatter = mood === 'thinking' ? 0.15 * Math.sin(t * 2 + phase) : 0;
      const baseR = 0.5 + (i % 10) * 0.06;
      const r = baseR + scatter;
      const theta = (i / count) * Math.PI * 2 + t * speed;
      const phi = Math.acos(2 * ((i * 0.618) % 1) - 1);
      posAttr.setXYZ(i,
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) + Math.sin(t + phase) * 0.02,
        r * Math.cos(phi)
      );
    }
    posAttr.needsUpdate = true;

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} vertexColors sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

/* ─── Gold Orbital Ring ─── */
function OrbitalRing({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.3) * 0.08;
    ref.current.rotation.z = t * 0.15;
    
    const targetScale = mood === 'listening' ? 1.15 : mood === 'celebrating' ? 1.1 : 1.0;
    const pulse = mood === 'listening' ? Math.sin(t * 3) * 0.03 : 0;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, targetScale + pulse, 0.05);
    ref.current.scale.setScalar(s);
    
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = mood === 'listening' ? 0.9 : 0.6;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[0.44, 0.008, 16, 100]} />
      <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.8} metalness={0.95} roughness={0.1} transparent opacity={0.6} />
    </mesh>
  );
}

/* ─── Second ring ─── */
function SecondRing({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = Math.PI / 1.8 + Math.cos(t * 0.2) * 0.1;
    ref.current.rotation.z = -t * 0.1;
    const vis = mood === 'listening' || mood === 'celebrating';
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, vis ? 0.35 : 0.1, 0.05);
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 1.8, 0, 0]}>
      <torusGeometry args={[0.5, 0.005, 16, 100]} />
      <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.4} metalness={0.9} roughness={0.15} transparent opacity={0.1} />
    </mesh>
  );
}

/* ─── Core Energy Sphere ─── */
function EnergySphere({ mood }: { mood: OrbMood }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // Breathing
    const breathScale = mood === 'listening' ? 1.08 + Math.sin(t * 2) * 0.04 :
                        mood === 'celebrating' ? 1.05 + Math.sin(t * 4) * 0.03 :
                        mood === 'thinking' ? 0.95 + Math.sin(t * 1.5) * 0.02 :
                        1.0 + Math.sin(t * 0.8) * 0.015;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, breathScale, 0.06));

    // Celebration bounce
    if (mood === 'celebrating') {
      groupRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.05;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
    }

    // Core material
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = mood === 'listening' ? 0.6 + Math.sin(t * 3) * 0.3 :
                              mood === 'presenting' ? 0.5 + Math.sin(t * 2) * 0.2 :
                              mood === 'celebrating' ? 0.7 + Math.sin(t * 5) * 0.3 :
                              0.35 + Math.sin(t * 0.8) * 0.1;
    }

    // Glow shell
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = mood === 'listening' ? 0.4 + Math.sin(t * 2.5) * 0.2 :
                              0.2 + Math.sin(t * 1.2) * 0.08;
      const s = mood === 'presenting' ? 1.02 + Math.sin(t * 1.5) * 0.01 : 1.0;
      glowRef.current.scale.setScalar(s);
    }

    // Outer atmosphere
    if (outerRef.current) {
      const mat = outerRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = mood === 'listening' ? 0.12 + Math.sin(t * 2) * 0.05 :
                    mood === 'celebrating' ? 0.15 :
                    0.06 + Math.sin(t * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner core — deep emerald */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.28, 64, 64]} />
        <meshStandardMaterial
          color={emerald}
          roughness={0.08}
          metalness={0.4}
          emissive={emeraldGlow}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Mid glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.33, 64, 64]} />
        <meshStandardMaterial
          color={softGreen}
          emissive={emeraldGlow}
          emissiveIntensity={0.2}
          transparent opacity={0.18}
          roughness={0.05}
          metalness={0.2}
        />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.40, 64, 64]} />
        <meshStandardMaterial
          color={softGreen}
          emissive={emeraldGlow}
          emissiveIntensity={0.15}
          transparent opacity={0.06}
          roughness={0} metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbital rings */}
      <OrbitalRing mood={mood} />
      <SecondRing mood={mood} />

      {/* Particles */}
      <AmbientParticles mood={mood} />

      {/* Inner light */}
      <pointLight position={[0, 0, 0]} color={emeraldGlow} intensity={1.2} distance={3} />
      <pointLight position={[0, 0.2, 0.3]} color={gold} intensity={0.3} distance={1.5} />
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
  const fov = size === 'sm' ? 52 : size === 'lg' ? 28 : 40;
  
  return (
    <div className={`w-full ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} color="#FFFBF0" />
        <directionalLight position={[-2, 2, -3]} intensity={0.15} color="#B8E6C1" />

        <Float speed={1.5} rotationIntensity={0.03} floatIntensity={0.2} floatingRange={[-0.02, 0.02]}>
          <EnergySphere mood={mood} />
        </Float>
      </Canvas>
    </div>
  );
}
