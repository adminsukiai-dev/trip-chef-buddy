import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type OrbMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

const green = new THREE.Color('#2E8B3D');
const gold = new THREE.Color('#D4A843');
const warmGold = new THREE.Color('#FFE0A0');
const softGreen = new THREE.Color('#4CAF50');

/* ─── Ring Particles ─── */
function RingParticles({ mood }: { mood: OrbMood }) {
  const count = 200;
  const ref = useRef<THREE.Points>(null!);

  const { basePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return { basePositions: pos };
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const c = new THREE.Color().lerpColors(green, gold, t < 0.5 ? t * 2 : 2 - t * 2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute('position');
    const colAttr = geo.getAttribute('color');

    const speed = mood === 'listening' ? 0.8 : mood === 'thinking' ? 0.3 : mood === 'celebrating' ? 1.2 : 0.15;
    const radiusMod = mood === 'listening' ? 0.58 : mood === 'thinking' ? 0.42 : 0.5;
    const spread = mood === 'thinking' ? 0.06 : mood === 'celebrating' ? 0.04 : 0.02;

    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      const angle = baseAngle + t * speed;
      const trail = mood === 'listening' ? Math.sin(baseAngle * 3 + t * 2) * 0.03 : 0;
      const r = radiusMod + Math.sin(baseAngle * 4 + t) * spread + trail;
      const yOff = Math.sin(baseAngle * 2 + t * 0.5) * 0.015;

      posAttr.setXYZ(i,
        Math.cos(angle) * r,
        yOff,
        Math.sin(angle) * r
      );

      // Shift colors toward gold when listening
      const blend = mood === 'listening' ? 0.6 + Math.sin(baseAngle + t * 3) * 0.4 :
                    mood === 'celebrating' ? 0.5 + Math.sin(baseAngle + t * 4) * 0.5 :
                    Math.sin(baseAngle + t * 0.3) * 0.3 + 0.3;
      const c = new THREE.Color().lerpColors(green, gold, blend);
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Tilt ring based on mood
    const tiltX = mood === 'listening' ? 0.4 : mood === 'thinking' ? 0.2 : 0.3;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, tiltX, 0.03);
    ref.current.rotation.y = t * speed * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(basePositions)} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} vertexColors sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ─── Thin Luminous Ring (the main structure) ─── */
function LuminousRing({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshStandardMaterial;

    const targetScale = mood === 'listening' ? 1.15 : mood === 'thinking' ? 0.88 : mood === 'celebrating' ? 1.1 : 1.0;
    const pulse = mood === 'listening' ? Math.sin(t * 2.5) * 0.03 : Math.sin(t * 0.8) * 0.01;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, targetScale + pulse, 0.04);
    ref.current.scale.setScalar(s);

    ref.current.rotation.x = 0.3 + Math.sin(t * 0.3) * 0.05;
    ref.current.rotation.y = t * 0.12;

    // Color shift
    const isGold = mood === 'listening' || mood === 'celebrating';
    const targetColor = isGold ? gold : green;
    mat.color.lerp(targetColor, 0.05);
    mat.emissive.lerp(targetColor, 0.05);
    mat.emissiveIntensity = mood === 'listening' ? 1.2 + Math.sin(t * 3) * 0.4 :
                            mood === 'presenting' ? 0.8 + Math.sin(t * 2) * 0.2 :
                            0.6 + Math.sin(t * 0.8) * 0.15;
    mat.opacity = mood === 'thinking' ? 0.5 + Math.sin(t * 2) * 0.1 : 0.7;
  });

  return (
    <mesh ref={ref} rotation={[0.3, 0, 0]}>
      <torusGeometry args={[0.5, 0.006, 16, 128]} />
      <meshStandardMaterial color={green} emissive={green} emissiveIntensity={0.6} metalness={0.95} roughness={0.05} transparent opacity={0.7} />
    </mesh>
  );
}

/* ─── Second thinner ring ─── */
function InnerRing({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = 0.5 + Math.cos(t * 0.2) * 0.1;
    ref.current.rotation.y = -t * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.15) * 0.1;

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = mood === 'listening' ? 0.6 : mood === 'thinking' ? 0.3 : 0.4;
    mat.emissiveIntensity = mood === 'celebrating' ? 1.0 : 0.5;
  });

  return (
    <mesh ref={ref} rotation={[0.5, 0, 0]}>
      <torusGeometry args={[0.35, 0.003, 16, 100]} />
      <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} transparent opacity={0.4} />
    </mesh>
  );
}

/* ─── Center Glow (the breathing core) ─── */
function CenterGlow({ mood }: { mood: OrbMood }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshBasicMaterial;

    const breathe = mood === 'listening' ? 0.25 + Math.sin(t * 2) * 0.08 :
                    mood === 'presenting' ? 0.2 + Math.sin(t * 1.5) * 0.05 :
                    mood === 'thinking' ? 0.12 + Math.sin(t * 3) * 0.04 :
                    0.15 + Math.sin(t * 0.6) * 0.03;
    mat.opacity = breathe;

    const s = mood === 'listening' ? 1.1 + Math.sin(t * 2.5) * 0.1 :
              mood === 'presenting' ? 1.0 + Math.sin(t * 1.5) * 0.05 :
              0.9 + Math.sin(t * 0.8) * 0.03;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshBasicMaterial color={softGreen} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─── Ripple Waves (when speaking/presenting) ─── */
function RippleWaves({ mood }: { mood: OrbMood }) {
  const count = 3;
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const active = mood === 'presenting' || mood === 'celebrating';
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t * 0.8 + i * 1.2) % 3;
      const scale = active ? 0.3 + phase * 0.25 : 0;
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scale, 0.05));
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? Math.max(0, 0.15 - phase * 0.05) : 0;
    });
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={el => { if (el) refs.current[i] = el; }} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.5, 64]} />
          <meshBasicMaterial color={gold} transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
}

/* ─── Reflection plane ─── */
function ReflectionPlane() {
  return (
    <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="#0D2818" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─── Scene ─── */
function AIRingScene({ mood }: { mood: OrbMood }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <LuminousRing mood={mood} />
      <InnerRing mood={mood} />
      <RingParticles mood={mood} />
      <CenterGlow mood={mood} />
      <RippleWaves mood={mood} />
      <ReflectionPlane />

      {/* Lighting */}
      <pointLight position={[0, 0, 0]} color={softGreen} intensity={0.5} distance={3} />
      <pointLight position={[0, 0.3, 0.5]} color={gold} intensity={0.2} distance={2} />
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
  const fov = size === 'sm' ? 55 : size === 'lg' ? 25 : 40;

  return (
    <div className={`w-full ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0.3, 1.8], fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[2, 3, 4]} intensity={0.3} color="#FFFBF0" />
        <AIRingScene mood={mood} />
      </Canvas>
    </div>
  );
}
