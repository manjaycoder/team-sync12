import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Individual node
function Node({ position, size = 0.12, color = '#ffffff' }: { 
  position: [number, number, number]; 
  size?: number; 
  color?: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });
  return (
    <Sphere ref={meshRef} position={position} args={[size, 16, 16]}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
        distort={0.2}
        speed={2}
      />
    </Sphere>
  );
}

// Connection line between two nodes
function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <Line
      points={points}
      color="#ffffff"
      lineWidth={1}
      transparent
      opacity={0.35}
    />
  );
}

// Particle system
function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.5} />
    </points>
  );
}

// Main network group
function Network() {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 1, 0.5],
    [-1.5, 1, -0.5],
    [0.8, -1.2, 0.8],
    [-0.8, -1.2, -0.8],
    [2, -0.5, -0.5],
    [-2, 0.5, 0.5],
    [0, 2, 0],
    [0, -2, 0],
  ];

  const connections: [[number,number,number],[number,number,number]][] = [
    [nodes[0], nodes[1]],
    [nodes[0], nodes[2]],
    [nodes[0], nodes[3]],
    [nodes[0], nodes[4]],
    [nodes[1], nodes[5]],
    [nodes[1], nodes[7]],
    [nodes[2], nodes[6]],
    [nodes[2], nodes[7]],
    [nodes[3], nodes[5]],
    [nodes[4], nodes[6]],
    [nodes[5], nodes[8]],
    [nodes[6], nodes[8]],
    [nodes[7], nodes[8]],
  ];

  const colors = ['#ffffff', '#e4e4e7', '#f4f4f5', '#a1a1aa', '#d4d4d8'];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn, i) => (
        <Connection key={i} start={conn[0]} end={conn[1]} />
      ))}
      {nodes.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.2} floatIntensity={0.3}>
          <Node
            position={pos}
            size={i === 0 ? 0.22 : 0.12}
            color={colors[i % colors.length]}
          />
        </Float>
      ))}
    </group>
  );
}

function FallbackSphere() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-white/20 border border-white/30 animate-pulse" />
    </div>
  );
}

export function CollaborationNetwork3D() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return <FallbackSphere />;

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
          <pointLight position={[-5, -5, -5]} intensity={1.5} color="#e4e4e7" />
          <Particles />
          <Network />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

