import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Float, Ring, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ─── 1. Volumetric Floating Task Card ──────────────────────────────────────────
interface TaskCardProps {
  position: [number, number, number];
  titleColor: string;
  badgeColor: string;
  progressRatio: number;
  hoverOffset?: number;
}

function TaskCard({ position, titleColor, badgeColor, progressRatio, hoverOffset = 0 }: TaskCardProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + hoverOffset;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.035;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Card Body - Sleek Dark Navy Glassmorphism */}
      <RoundedBox args={[0.54, 0.08, 0.36]} radius={0.02} smoothness={4}>
        <meshStandardMaterial
          color="#0B132B"
          metalness={0.7}
          roughness={0.25}
          envMapIntensity={0.8}
        />
      </RoundedBox>

      {/* Header Accent Bar */}
      <RoundedBox args={[0.5, 0.015, 0.04]} radius={0.005} position={[0, 0.045, -0.13]}>
        <meshStandardMaterial
          color={titleColor}
          emissive={titleColor}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Progress Track */}
      <RoundedBox args={[0.5, 0.01, 0.03]} radius={0.005} position={[0, 0.045, 0.12]}>
        <meshStandardMaterial color="#1E293B" roughness={0.5} />
      </RoundedBox>

      {/* Progress Fill */}
      <RoundedBox
        args={[0.5 * progressRatio, 0.012, 0.032]}
        radius={0.005}
        position={[-0.25 + (0.5 * progressRatio) / 2, 0.046, 0.12]}
      >
        <meshStandardMaterial
          color={badgeColor}
          emissive={badgeColor}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Tiny Status Indicator Orb */}
      <Sphere args={[0.02, 12, 12]} position={[0.22, 0.045, -0.13]}>
        <meshStandardMaterial
          color={badgeColor}
          emissive={badgeColor}
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </Sphere>
    </group>
  );
}

// ─── 2. Employee Avatar Collaboration Nodes ─────────────────────────────────
function EmployeeNode({ position, color }: { position: [number, number, number]; color: string; label?: string }) {
  const nodeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.025;
    }
  });

  return (
    <group ref={nodeRef} position={position}>
      {/* Outer Halo */}
      <Ring args={[0.08, 0.095, 24]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
      {/* Avatar Orb */}
      <Sphere args={[0.065, 24, 24]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.6} />
      </Sphere>
    </group>
  );
}

// ─── 3. AI Copilot Holographic Companion ─────────────────────────────────────
function AICopilotOrb() {
  const orbRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbRef.current) {
      const t = state.clock.elapsedTime * 0.8;
      // Orbit around the workspace in an elliptical path
      orbRef.current.position.x = Math.cos(t) * 1.5;
      orbRef.current.position.z = Math.sin(t) * 1.1;
      orbRef.current.position.y = 0.45 + Math.sin(t * 2) * 0.08;
      orbRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group ref={orbRef} position={[1.4, 0.45, 0]}>
      {/* Central AI Core */}
      <Sphere args={[0.09, 32, 32]}>
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Holographic Gyroscopic Rings */}
      <Ring args={[0.13, 0.145, 32]} rotation={[Math.PI / 4, 0, 0]}>
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[0.16, 0.175, 32]} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

// ─── 4. Main 3D Workspace Scene (Platform, Columns, Tasks, AI) ───────────────
function WorkspaceScene() {
  const rootRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rootRef.current) {
      // Gentle subtle breathing motion
      rootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
  });

  return (
    <group ref={rootRef}>
      {/* ── Base Pedestal: Enterprise Glass Slab ── */}
      <RoundedBox args={[2.8, 0.08, 1.9]} radius={0.04} position={[0, -0.65, 0]} smoothness={4}>
        <meshStandardMaterial color="#080D1A" metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Cyber Grid Border Glow */}
      <RoundedBox args={[2.84, 0.015, 1.94]} radius={0.04} position={[0, -0.62, 0]}>
        <meshStandardMaterial color="#1E3A8A" emissive="#1D4ED8" emissiveIntensity={0.4} roughness={0.3} />
      </RoundedBox>

      {/* ── 3 Kanban Workflow Columns ── */}
      {/* Column 1: Backlog / Created */}
      <RoundedBox args={[0.74, 0.03, 1.6]} radius={0.02} position={[-0.85, -0.59, 0]}>
        <meshStandardMaterial color="#0F172A" metalness={0.6} roughness={0.4} />
      </RoundedBox>

      {/* Column 2: In Progress / Active Sprint */}
      <RoundedBox args={[0.74, 0.03, 1.6]} radius={0.02} position={[0, -0.59, 0]}>
        <meshStandardMaterial color="#0F2147" metalness={0.6} roughness={0.3} emissive="#1E3A8A" emissiveIntensity={0.15} />
      </RoundedBox>

      {/* Column 3: Completed / Deployed */}
      <RoundedBox args={[0.74, 0.03, 1.6]} radius={0.02} position={[0.85, -0.59, 0]}>
        <meshStandardMaterial color="#0A221E" metalness={0.6} roughness={0.3} emissive="#064E3B" emissiveIntensity={0.15} />
      </RoundedBox>

      {/* ── Column Headers ── */}
      {/* Header 1 */}
      <RoundedBox args={[0.66, 0.04, 0.16]} radius={0.015} position={[-0.85, -0.55, -0.66]}>
        <meshStandardMaterial color="#1E293B" emissive="#334155" emissiveIntensity={0.3} roughness={0.3} />
      </RoundedBox>
      {/* Header 2 */}
      <RoundedBox args={[0.66, 0.04, 0.16]} radius={0.015} position={[0, -0.55, -0.66]}>
        <meshStandardMaterial color="#1E40AF" emissive="#2563EB" emissiveIntensity={0.6} roughness={0.3} />
      </RoundedBox>
      {/* Header 3 */}
      <RoundedBox args={[0.66, 0.04, 0.16]} radius={0.015} position={[0.85, -0.55, -0.66]}>
        <meshStandardMaterial color="#065F46" emissive="#059669" emissiveIntensity={0.6} roughness={0.3} />
      </RoundedBox>

      {/* ── Floating Volumetric Task Cards across Workflow ── */}
      {/* Backlog Column Tasks */}
      <TaskCard position={[-0.85, -0.44, -0.32]} titleColor="#64748B" badgeColor="#94A3B8" progressRatio={0.25} hoverOffset={0.2} />
      <TaskCard position={[-0.85, -0.32, 0.22]} titleColor="#64748B" badgeColor="#38BDF8" progressRatio={0.4} hoverOffset={0.8} />

      {/* In-Progress Column Tasks */}
      <TaskCard position={[0, -0.38, -0.32]} titleColor="#38BDF8" badgeColor="#60A5FA" progressRatio={0.65} hoverOffset={1.4} />
      <TaskCard position={[0, -0.24, 0.22]} titleColor="#818CF8" badgeColor="#6366F1" progressRatio={0.85} hoverOffset={2.1} />

      {/* Completed Column Tasks */}
      <TaskCard position={[0.85, -0.42, -0.32]} titleColor="#34D399" badgeColor="#10B981" progressRatio={1.0} hoverOffset={2.7} />
      <TaskCard position={[0.85, -0.28, 0.22]} titleColor="#34D399" badgeColor="#059669" progressRatio={1.0} hoverOffset={3.3} />

      {/* ── Employee Collaboration Nodes ── */}
      <EmployeeNode position={[-0.85, -0.15, 0.65]} color="#60A5FA" label="Alex Morgan" />
      <EmployeeNode position={[0, -0.08, 0.65]} color="#38BDF8" label="Sarah Chen" />
      <EmployeeNode position={[0.85, -0.12, 0.65]} color="#34D399" label="David Kim" />

      {/* ── Central Holographic Metric Hub ── */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[0, 0.45, 0]}>
          {/* Ring Dashboard */}
          <Ring args={[0.26, 0.29, 32]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </Ring>
          <Ring args={[0.34, 0.355, 32]} rotation={[-Math.PI / 2.5, 0, 0]}>
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.4} side={THREE.DoubleSide} />
          </Ring>
        </group>
      </Float>

      {/* ── Autonomous AI Copilot Orb ── */}
      <AICopilotOrb />
    </group>
  );
}

// ─── 5. Exported WorkspaceModel3D Component ──────────────────────────────────
export function WorkspaceModel3D() {
  const [hasContextLost, setHasContextLost] = useState(false);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || hasContextLost) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#090D1A] to-[#04060C] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg border-2 border-blue-400 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-white font-display">TeamSync 3D Engine Ready</p>
        <p className="text-[11px] text-neutral-400 font-sans mt-1 max-w-xs">
          High-fidelity procedural rendering active.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: 360 }}>
      <Canvas
        camera={{ position: [3.4, 2.9, 3.8], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('[TeamSync 3D] WebGL context lost. Engaging graceful fallback.');
            setHasContextLost(true);
          });
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting Rig for High-End SaaS Contrast */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 4]} intensity={2.2} color="#FFFFFF" />
          <pointLight position={[-4, 3, -3]} intensity={1.5} color="#38BDF8" />
          <pointLight position={[3, -1, 3]} intensity={1.2} color="#1D4ED8" />
          <spotLight position={[0, 6, 0]} intensity={2.0} color="#60A5FA" angle={0.5} penumbra={0.8} />

          {/* Procedural Workspace Model */}
          <WorkspaceScene />

          {/* Orbit Controls with bounded pitch/yaw to prevent clipping */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 4.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default WorkspaceModel3D;
