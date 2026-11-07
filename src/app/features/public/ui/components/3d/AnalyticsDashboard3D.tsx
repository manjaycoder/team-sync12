import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function Bar({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = useRef(0);

  useFrame((state) => {
    targetHeight.current = height + Math.sin(state.clock.elapsedTime + position[0]) * 0.05;
    if (meshRef.current) {
      meshRef.current.scale.y += (targetHeight.current - meshRef.current.scale.y) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1] + height / 2, position[2]]}
      scale={[1, height, 1]}
    >
      <boxGeometry args={[0.18, 1, 0.18]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function CircularRing({ radius, color, speed = 1 }: { radius: number; color: string; speed?: number }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 1.6, false, 0);
    const points = curve.getPoints(64);
    const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
    return geo;
  }, [radius]);

  return (
    // @ts-expect-error - R3F line element
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.7} />
    </line>
  );
}

function Dashboard() {
  const groupRef = useRef<THREE.Group>(null);

  const bars = [
    { x: -1.0, h: 0.6, color: '#ffffff' },
    { x: -0.65, h: 0.9, color: '#e4e4e7' },
    { x: -0.30, h: 0.5, color: '#d4d4d8' },
    { x: 0.05, h: 1.1, color: '#ffffff' },
    { x: 0.40, h: 0.75, color: '#a1a1aa' },
    { x: 0.75, h: 0.95, color: '#f4f4f5' },
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <RoundedBox args={[2.8, 0.06, 2]} radius={0.05} position={[0, -0.03, 0]}>
        <meshStandardMaterial color="#08080a" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Bar chart area */}
      <group position={[-0.1, 0.03, -0.3]}>
        {bars.map((bar, i) => (
          <Bar key={i} position={[bar.x, 0, 0]} height={bar.h} color={bar.color} />
        ))}
        {/* Chart floor */}
        <RoundedBox args={[2, 0.02, 0.4]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#111114" metalness={0.8} roughness={0.2} />
        </RoundedBox>
      </group>

      {/* Circular progress rings */}
      <Float speed={1.5} floatIntensity={0.2}>
        <group position={[0.9, 0.5, 0.5]}>
          <CircularRing radius={0.35} color="#ffffff" speed={0.5} />
          <CircularRing radius={0.27} color="#e4e4e7" speed={-0.7} />
          <CircularRing radius={0.19} color="#a1a1aa" speed={0.9} />
        </group>
      </Float>

      {/* Data points */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.3}>
          <mesh position={[x - 0.9, 0.3 + (i % 2) * 0.2, 0.6]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function AnalyticsDashboard3D() {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-48 h-32 rounded-2xl bg-white/10 border border-white/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <Canvas
        camera={{ position: [2.5, 2.5, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 4]} intensity={2.5} color="#ffffff" />
          <pointLight position={[-3, 3, -3]} intensity={1.5} color="#e4e4e7" />
          <pointLight position={[0, -3, 0]} intensity={0.8} color="#ffffff" />
          <Dashboard />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

