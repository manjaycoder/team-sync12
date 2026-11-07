import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function TaskCard({ position, color }: { position: [number, number, number]; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <group position={position}>
      <RoundedBox args={[0.5, 0.08, 0.35]} radius={0.02} ref={meshRef}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.015, 0.31]} radius={0.01} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#1E40AF" metalness={0.4} roughness={0.6} emissive="#1E40AF" emissiveIntensity={0.3} />
      </RoundedBox>
    </group>
  );
}

function KanbanBoard() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Board base */}
      <RoundedBox args={[2.4, 0.08, 1.6]} radius={0.04} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#0D1424" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Column headers */}
      {[-0.75, 0, 0.75].map((x, i) => (
        <group key={i}>
          <RoundedBox args={[0.65, 0.07, 0.25]} radius={0.02} position={[x, -0.5, -0.6]}>
            <meshStandardMaterial 
              color={i === 0 ? '#374151' : i === 1 ? '#1E3A8A' : '#065F46'} 
              metalness={0.5} roughness={0.4}
              emissive={i === 1 ? '#1E3A8A' : 'black'}
              emissiveIntensity={i === 1 ? 0.3 : 0}
            />
          </RoundedBox>
          
          {/* Task cards in each column */}
          {[0, 1, 2].slice(0, 3 - i).map((j) => (
            <TaskCard
              key={j}
              position={[x, -0.48 + j * 0.14, -0.3 + j * 0.05]}
              color={j % 2 === 0 ? '#1E3A8A' : '#111C30'}
              label={`Task ${j + 1}`}
            />
          ))}
        </group>
      ))}

      {/* Floating device */}
      <Float speed={2} floatIntensity={0.4}>
        <RoundedBox args={[0.9, 0.06, 0.65]} radius={0.03} position={[0.9, 0.2, 0.3]}>
          <meshStandardMaterial color="#111C30" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.82, 0.015, 0.57]} radius={0.02} position={[0.9, 0.24, 0.3]}>
          <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.5} emissive="#1E40AF" emissiveIntensity={0.4} />
        </RoundedBox>
      </Float>
    </group>
  );
}

export function WorkspaceModel3D() {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReduced) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-48 h-32 rounded-2xl bg-gradient-to-br from-blue-900/60 to-blue-600/40 border border-blue-500/30" />
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <Canvas
        camera={{ position: [3, 3, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 4, 4]} intensity={2.5} color="#ffffff" />
          <pointLight position={[-3, 2, -3]} intensity={1.5} color="#e4e4e7" />
          <spotLight position={[0, 6, 0]} intensity={1.8} color="#ffffff" angle={0.4} />
          <KanbanBoard />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

