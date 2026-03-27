import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

export type BotMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

/* ─── tiny helpers ─── */
const green = new THREE.Color('#1B5E20');
const gold = new THREE.Color('#D4A843');
const cream = new THREE.Color('#FAF8F2');
const white = new THREE.Color('#FFFFFF');
const darkGreen = new THREE.Color('#0D3B10');

/* ─── Eye component ─── */
function Eye({ position, mood }: { position: [number, number, number]; mood: BotMood }) {
  const ref = useRef<THREE.Group>(null!);
  const pupilRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pupilRef.current) {
      // Pupil movement
      if (mood === 'listening') {
        pupilRef.current.position.x = Math.sin(t * 2) * 0.02;
        pupilRef.current.position.y = Math.cos(t * 3) * 0.01;
      } else if (mood === 'thinking') {
        pupilRef.current.position.x = Math.sin(t) * 0.03;
        pupilRef.current.position.y = 0.02;
      } else {
        pupilRef.current.position.x = Math.sin(t * 0.5) * 0.01;
        pupilRef.current.position.y = 0;
      }
    }
    // Squint when celebrating
    if (ref.current) {
      const targetScaleY = mood === 'celebrating' ? 0.4 : mood === 'sad' ? 0.6 : 1;
      ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScaleY, 0.1);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Eye socket */}
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={white} roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Pupil */}
      <mesh ref={pupilRef} position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={darkGreen} roughness={0.3} />
      </mesh>
      {/* Iris ring */}
      <mesh position={[0, 0, 0.06]}>
        <ringGeometry args={[0.05, 0.09, 32]} />
        <meshStandardMaterial color={green} roughness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ─── Antenna ─── */
function Antenna({ mood }: { mood: BotMood }) {
  const tipRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (tipRef.current) {
      const isActive = mood === 'listening';
      const targetEmissive = isActive ? 2 : 0.3;
      const mat = tipRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        targetEmissive + (isActive ? Math.sin(t * 4) * 0.8 : Math.sin(t) * 0.1),
        0.1
      );
    }
    if (glowRef.current) {
      glowRef.current.intensity = mood === 'listening' ? 1.5 + Math.sin(clock.getElapsedTime() * 4) * 0.5 : 0.3;
    }
  });

  return (
    <group position={[0, 0.65, 0]}>
      {/* Stem */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.02, 0.2, 8]} />
        <meshStandardMaterial color={green} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Tip ball */}
      <mesh ref={tipRef} position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 0.13, 0]} color={gold} intensity={0.3} distance={1} />
    </group>
  );
}

/* ─── Arm ─── */
function Arm({ side, mood }: { side: 'left' | 'right'; mood: BotMood }) {
  const ref = useRef<THREE.Group>(null!);
  const x = side === 'left' ? -0.38 : 0.38;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;

    if (mood === 'celebrating') {
      ref.current.rotation.z = (side === 'left' ? 1 : -1) * (Math.PI * 0.6 + Math.sin(t * 6) * 0.3);
    } else if (mood === 'presenting') {
      const target = side === 'right' ? -Math.PI * 0.35 : 0.1;
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, target, 0.05);
    } else if (mood === 'idle') {
      ref.current.rotation.z = (side === 'left' ? 0.15 : -0.15) + Math.sin(t * 0.8 + (side === 'left' ? 0 : Math.PI)) * 0.05;
    } else {
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, side === 'left' ? 0.15 : -0.15, 0.05);
    }
  });

  return (
    <group ref={ref} position={[x, 0.05, 0]}>
      {/* Upper arm */}
      <mesh position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.04, 0.12, 8, 8]} />
        <meshStandardMaterial color={cream} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Hand */}
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={green} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Apron ─── */
function Apron() {
  return (
    <group position={[0, -0.1, 0.26]}>
      {/* Apron body */}
      <mesh>
        <boxGeometry args={[0.3, 0.25, 0.02]} />
        <meshStandardMaterial color={green} roughness={0.6} />
      </mesh>
      {/* G badge */}
      <mesh position={[0, 0.02, 0.015]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color={gold} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Strap */}
      <mesh position={[0, 0.18, -0.01]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.01]} />
        <meshStandardMaterial color={green} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Main Robot Body ─── */
function GrocerBotModel({ mood }: { mood: BotMood }) {
  const bodyRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!bodyRef.current) return;

    // Gentle breathing
    bodyRef.current.scale.x = 1 + Math.sin(t * 1.2) * 0.01;
    bodyRef.current.scale.y = 1 + Math.sin(t * 1.2 + 0.5) * 0.01;

    // Lean forward when listening
    const targetRotX = mood === 'listening' ? 0.08 : mood === 'thinking' ? -0.05 : 0;
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, targetRotX, 0.03);

    // Nod when listening
    if (mood === 'listening') {
      bodyRef.current.rotation.x += Math.sin(t * 2) * 0.02;
    }

    // Celebratory bounce
    if (mood === 'celebrating') {
      bodyRef.current.position.y = Math.abs(Math.sin(t * 5)) * 0.1;
    } else {
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0, 0.05);
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Body - rounded capsule */}
      <mesh>
        <capsuleGeometry args={[0.28, 0.2, 16, 32]} />
        <meshStandardMaterial color={cream} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Green accent belt */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.282, 0.015, 8, 32]} />
        <meshStandardMaterial color={green} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Head - slightly smaller sphere */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={cream} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Face visor */}
      <mesh position={[0, 0.42, 0.12]}>
        <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={white} roughness={0.1} metalness={0.1} transparent opacity={0.3} />
      </mesh>

      {/* Eyes */}
      <Eye position={[-0.08, 0.44, 0.18]} mood={mood} />
      <Eye position={[0.08, 0.44, 0.18]} mood={mood} />

      {/* Mouth */}
      <mesh position={[0, 0.34, 0.2]}>
        <torusGeometry args={[0.04, 0.008, 8, 16, mood === 'celebrating' || mood === 'idle' ? Math.PI : Math.PI * 0.6]} />
        <meshStandardMaterial color={green} roughness={0.3} />
      </mesh>

      {/* Antenna */}
      <Antenna mood={mood} />

      {/* Arms */}
      <Arm side="left" mood={mood} />
      <Arm side="right" mood={mood} />

      {/* Apron */}
      <Apron />

      {/* Feet/hover pads */}
      <mesh position={[-0.1, -0.38, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={green} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.1, -0.38, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={green} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Hover glow under feet */}
      <pointLight position={[0, -0.45, 0]} color={gold} intensity={0.5} distance={0.8} />
    </group>
  );
}

/* ─── Confetti particles for celebrating ─── */
function Confetti({ active }: { active: boolean }) {
  const count = 30;
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 1] = Math.random() * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const palette = [green, gold, new THREE.Color('#4CAF50'), new THREE.Color('#FFD700')];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || !active) {
      if (ref.current) ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] -= 0.02;
      if (posArr[i * 3 + 1] < -1) posArr[i * 3 + 1] = 2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = clock.getElapsedTime() * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation />
    </points>
  );
}

/* ─── Exported Canvas Component ─── */
interface GrocerBotProps {
  mood?: BotMood;
  className?: string;
}

export default function GrocerBot({ mood = 'idle', className = '' }: GrocerBotProps) {
  return (
    <div className={`w-full ${className}`} style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0.2, 2.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1} color="#FFFBF0" />
        <directionalLight position={[-2, 2, -3]} intensity={0.3} color="#B8E6C1" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
          <GrocerBotModel mood={mood} />
        </Float>

        <Confetti active={mood === 'celebrating'} />
      </Canvas>
    </div>
  );
}
