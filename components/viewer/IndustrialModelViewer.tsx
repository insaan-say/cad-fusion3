"use client";

import { Html, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AlertTriangle,
  BadgeCheck,
  Crosshair,
  Eye,
  Maximize2,
  Move3D,
  Power,
  Ruler,
  SplitSquareHorizontal,
  Wrench
} from "lucide-react";
import { Suspense, useMemo, useRef, useState, type ReactNode } from "react";
import { AdditiveBlending, DoubleSide, type BufferAttribute, type Group, type Points } from "three";
import { engineeringParts } from "@/lib/platform-data";

type ViewerMode = "engineering" | "repair";

type IndustrialModelViewerProps = {
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  mode?: ViewerMode;
};

const partColors: Record<string, string> = {
  "fan-rotor": "#1f9fb6",
  "bearing-cartridge": "#c98314",
  "thermal-casing": "#5d6978",
  "hydraulic-manifold": "#b83b3b"
};

export function IndustrialModelViewer({
  selectedPartId,
  onSelectPart,
  mode = "engineering"
}: IndustrialModelViewerProps) {
  const [exploded, setExploded] = useState(false);
  const [section, setSection] = useState(mode === "repair");
  const [measure, setMeasure] = useState(true);
  const [faultMarkers, setFaultMarkers] = useState(mode === "repair");
  const [running, setRunning] = useState(true);

  const selectedPart = useMemo(
    () => engineeringParts.find((part) => part.id === selectedPartId) ?? engineeringParts[0],
    [selectedPartId]
  );

  return (
    <div className="flex h-[560px] min-h-[520px] flex-col overflow-hidden rounded-lg border border-line bg-white shadow-panel md:h-[650px] xl:h-[calc(100vh-230px)] xl:max-h-[720px]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-panel px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-white">
            <Move3D aria-hidden="true" size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{selectedPart.name}</p>
            <p className="truncate text-xs text-steel">
              {selectedPart.file} | {selectedPart.revision}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Power simulation"
            aria-pressed={running}
            onClick={() => setRunning((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
              running ? "border-success bg-success text-white" : "border-line bg-white text-steel hover:text-marine"
            }`}
          >
            <Power aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            title="Exploded view"
            aria-pressed={exploded}
            onClick={() => setExploded((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
              exploded ? "border-cyan bg-cyan text-white" : "border-line bg-white text-steel hover:text-marine"
            }`}
          >
            <Maximize2 aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            title="Section plane"
            aria-pressed={section}
            onClick={() => setSection((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
              section ? "border-amber bg-amber text-white" : "border-line bg-white text-steel hover:text-marine"
            }`}
          >
            <SplitSquareHorizontal aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            title="Measurement overlay"
            aria-pressed={measure}
            onClick={() => setMeasure((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
              measure ? "border-success bg-success text-white" : "border-line bg-white text-steel hover:text-marine"
            }`}
          >
            <Ruler aria-hidden="true" size={17} />
          </button>
          <button
            type="button"
            title="Fault markers"
            aria-pressed={faultMarkers}
            onClick={() => setFaultMarkers((value) => !value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border ${
              faultMarkers ? "border-danger bg-danger text-white" : "border-line bg-white text-steel hover:text-marine"
            }`}
          >
            <Crosshair aria-hidden="true" size={17} />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#02070b]">
        <Canvas camera={{ position: [6.3, 2.7, 4.9], fov: 42 }} dpr={[1, 1.7]} shadows>
          <color attach="background" args={["#02070b"]} />
          <fog attach="fog" args={["#02070b", 6, 14]} />
          <ambientLight intensity={0.38} />
          <directionalLight position={[4, 6, 5]} intensity={1.4} color="#dffcff" castShadow />
          <pointLight position={[-3.4, 1.7, 1.6]} intensity={2.1} color="#00d7ff" />
          <pointLight position={[2.9, 0.2, 0]} intensity={2.7} color="#ffb02e" />
          <gridHelper args={[11, 28, "#0b8f78", "#082029"]} position={[0, -1.55, 0]} />
          <Suspense fallback={null}>
            <Assembly
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
              exploded={exploded}
              section={section}
              measure={measure}
              faultMarkers={faultMarkers}
              mode={mode}
              running={running}
            />
          </Suspense>
          <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={3.4} maxDistance={12} />
        </Canvas>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
          <span className="inline-flex h-8 items-center rounded-md border border-cyan/40 bg-ink/88 px-3 text-xs font-semibold text-cyan shadow-sm">
            <Eye aria-hidden="true" className="mr-1.5" size={14} />
            STEP | STL | OBJ | GLB ready
          </span>
          <span className="inline-flex h-8 items-center rounded-md border border-success/40 bg-ink/88 px-3 text-xs font-semibold text-success shadow-sm">
            <BadgeCheck aria-hidden="true" className="mr-1.5" size={14} />
            Encrypted review session
          </span>
          <span className="inline-flex h-8 items-center rounded-md border border-amber/40 bg-ink/88 px-3 text-xs font-semibold text-amber shadow-sm">
            <Power aria-hidden="true" className="mr-1.5" size={14} />
            {running ? "Afterburner flow active" : "Engine simulation paused"}
          </span>
        </div>
      </div>
    </div>
  );
}

type AssemblyProps = {
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  exploded: boolean;
  section: boolean;
  measure: boolean;
  faultMarkers: boolean;
  mode: ViewerMode;
  running: boolean;
};

function Assembly({
  selectedPartId,
  onSelectPart,
  exploded,
  section,
  measure,
  faultMarkers,
  mode,
  running
}: AssemblyProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && mode === "engineering" && running) {
      groupRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.03, -0.48, 0]}>
      <EngineCore selectedPartId={selectedPartId} onSelectPart={onSelectPart} exploded={exploded} running={running} />
      {section ? <SectionPlane /> : null}
      {measure ? <MeasurementOverlay /> : null}
      {faultMarkers ? <FaultMarkers /> : null}
    </group>
  );
}

type EngineCoreProps = {
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  exploded: boolean;
  running: boolean;
};

function EngineCore({ selectedPartId, onSelectPart, exploded, running }: EngineCoreProps) {
  return (
    <group>
      <SelectableMesh
        partId="thermal-casing"
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        position={[exploded ? 0.72 : 0, 0, 0]}
      >
        <NacelleCasing />
      </SelectableMesh>

      <SelectableMesh
        partId="fan-rotor"
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        position={[exploded ? -1.12 : -0.7, 0, 0]}
      >
        <FanStage running={running} />
      </SelectableMesh>

      <SelectableMesh
        partId="bearing-cartridge"
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        position={[exploded ? 0.32 : 0.02, 0, 0]}
      >
        <RotatingCore running={running} />
      </SelectableMesh>

      <SelectableMesh
        partId="hydraulic-manifold"
        selectedPartId={selectedPartId}
        onSelectPart={onSelectPart}
        position={[exploded ? 1.7 : 1.2, exploded ? -0.72 : -0.48, 1.18]}
      >
        <AccessoryManifold />
      </SelectableMesh>
      <AfterburnerPlume running={running} />
    </group>
  );
}

type SelectableMeshProps = {
  partId: string;
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  position: [number, number, number];
  children: ReactNode;
};

function SelectableMesh({ partId, selectedPartId, onSelectPart, position, children }: SelectableMeshProps) {
  const [hovered, setHovered] = useState(false);
  const selected = selectedPartId === partId;
  useCursor(hovered);

  return (
    <group
      position={position}
      scale={selected ? 1.04 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelectPart(partId);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {selected ? (
        <Html position={[0, 1.45, 0]} center distanceFactor={8}>
          <div className="rounded-md border border-cyan bg-white px-2 py-1 text-xs font-bold text-marine shadow-sm">
            {engineeringParts.find((part) => part.id === partId)?.name}
          </div>
        </Html>
      ) : null}
      {hovered && !selected ? (
        <Html position={[0, 1.25, 0]} center distanceFactor={8}>
          <div className="rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-steel shadow-sm">
            Select part
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function NacelleCasing() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.96, 1.34, 4.85, 72, 1, true, -0.78, Math.PI * 1.56]} />
        <meshStandardMaterial
          color={partColors["thermal-casing"]}
          metalness={0.52}
          roughness={0.26}
          transparent
          opacity={0.36}
          side={DoubleSide}
          wireframe
        />
      </mesh>
      <EngineRing x={-2.42} radius={1.36} tube={0.07} color="#0f1720" />
      <EngineRing x={-1.64} radius={1.18} tube={0.045} color="#536170" />
      <EngineRing x={-0.64} radius={1.02} tube={0.038} color="#536170" />
      <EngineRing x={0.66} radius={0.92} tube={0.038} color="#536170" />
      <EngineRing x={1.72} radius={0.84} tube={0.045} color="#25313d" />
      <EngineRing x={2.42} radius={0.72} tube={0.06} color="#0f1720" />
      <BoltRing x={-2.43} radius={1.47} count={20} color="#dce3ea" />
      <BoltRing x={2.35} radius={0.82} count={16} color="#dce3ea" />
      <mesh position={[0.1, 1.05, -0.78]} rotation={[0.25, 0, -0.08]} castShadow>
        <boxGeometry args={[2.55, 0.035, 0.34]} />
        <meshStandardMaterial color="#00d7ff" metalness={0.12} roughness={0.42} wireframe />
      </mesh>
      <mesh position={[0.55, -1.08, 0.64]} rotation={[-0.18, 0.18, 0.02]} castShadow>
        <boxGeometry args={[2.7, 0.035, 0.28]} />
        <meshStandardMaterial color="#21d39b" metalness={0.18} roughness={0.38} wireframe />
      </mesh>
      <Html position={[0.15, 1.34, -0.48]} center distanceFactor={8}>
        <div className="rounded-md border border-cyan/60 bg-ink/90 px-2 py-1 text-xs font-bold text-cyan shadow-sm">
          Holographic wireframe
        </div>
      </Html>
    </group>
  );
}

function FanStage({ running }: { running: boolean }) {
  const rotorRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (rotorRef.current && running) {
      rotorRef.current.rotation.x += delta * 5.8;
    }
  });

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.34, 0.72, 48]} />
        <meshStandardMaterial color="#0bd8ff" metalness={0.72} roughness={0.18} wireframe />
      </mesh>
      <group ref={rotorRef}>
        <BladeRing count={34} radius={0.78} bladeLength={0.72} chord={0.075} color={partColors["fan-rotor"]} twist={0.68} />
        <BladeRing count={34} radius={0.49} bladeLength={0.38} chord={0.055} color="#3bf1ff" twist={0.42} offset={Math.PI / 30} />
      </group>
      <EngineRing x={0} radius={0.98} tube={0.035} color="#0e1b25" />
      <EngineRing x={0.12} radius={0.42} tube={0.035} color="#d7dde5" />
    </group>
  );
}

function RotatingCore({ running }: { running: boolean }) {
  const compressorRef = useRef<Group>(null);
  const turbineRef = useRef<Group>(null);
  const compressorStages = [
    { x: -0.25, radius: 0.58, bladeLength: 0.36 },
    { x: 0.18, radius: 0.52, bladeLength: 0.31 },
    { x: 0.58, radius: 0.46, bladeLength: 0.27 },
    { x: 0.98, radius: 0.41, bladeLength: 0.23 }
  ];
  const turbineStages = [
    { x: 1.74, radius: 0.48, bladeLength: 0.25 },
    { x: 2.08, radius: 0.42, bladeLength: 0.22 }
  ];

  useFrame((_, delta) => {
    if (!running) {
      return;
    }

    if (compressorRef.current) {
      compressorRef.current.rotation.x += delta * 3.2;
    }

    if (turbineRef.current) {
      turbineRef.current.rotation.x -= delta * 4.7;
    }
  });

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 4.75, 48]} />
        <meshStandardMaterial color="#31ffe2" metalness={0.76} roughness={0.18} wireframe />
      </mesh>
      <mesh position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.42, 0.5, 0.42, 48]} />
        <meshStandardMaterial color={partColors["bearing-cartridge"]} metalness={0.55} roughness={0.24} wireframe />
      </mesh>
      <group ref={compressorRef}>
        {compressorStages.map((stage, index) => (
          <group key={stage.x} position={[stage.x, 0, 0]}>
            <BladeRing
              count={24}
              radius={stage.radius}
              bladeLength={stage.bladeLength}
              chord={0.047}
              color={index % 2 === 0 ? "#1fffc2" : "#0aa485"}
              twist={0.32}
              offset={index * 0.12}
            />
            <StatorRing radius={stage.radius + 0.18} count={18} color="#78ffe4" offset={index * 0.08} />
          </group>
        ))}
      </group>
      <mesh position={[1.34, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.47, 0.58, 0.58, 48, 1, true]} />
        <meshStandardMaterial color="#ffb02e" metalness={0.34} roughness={0.36} transparent opacity={0.82} wireframe />
      </mesh>
      <BoltRing x={1.34} radius={0.66} count={12} color="#f0b35d" />
      <group ref={turbineRef}>
        {turbineStages.map((stage, index) => (
          <group key={stage.x} position={[stage.x, 0, 0]}>
            <BladeRing
              count={22}
              radius={stage.radius}
              bladeLength={stage.bladeLength}
              chord={0.052}
              color={index === 0 ? "#ffb02e" : "#ff6c1f"}
              twist={-0.36}
              offset={index * 0.1}
            />
            <EngineRing x={0} radius={stage.radius + 0.14} tube={0.025} color="#4d6bff" />
          </group>
        ))}
      </group>
      <mesh position={[2.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.68, 0.72, 56, 1, true]} />
        <meshStandardMaterial color="#5d6bff" metalness={0.62} roughness={0.22} wireframe />
      </mesh>
      <Html position={[0.72, -0.96, 0.56]} center distanceFactor={8}>
        <div className="rounded-md border border-amber/60 bg-ink/90 px-2 py-1 text-xs font-bold text-amber shadow-sm">
          rotating compressor
        </div>
      </Html>
    </group>
  );
}

function AccessoryManifold() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.08, 0.48, 0.58]} />
        <meshStandardMaterial color={partColors["hydraulic-manifold"]} metalness={0.3} roughness={0.34} wireframe />
      </mesh>
      <mesh position={[-0.36, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.5, 24]} />
        <meshStandardMaterial color="#ff5964" metalness={0.3} roughness={0.34} wireframe />
      </mesh>
      <mesh position={[0.36, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.5, 24]} />
        <meshStandardMaterial color="#ff5964" metalness={0.3} roughness={0.34} wireframe />
      </mesh>
      <mesh position={[0, -0.08, -0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.1, 24]} />
        <meshStandardMaterial color="#32f4ff" metalness={0.62} roughness={0.22} wireframe />
      </mesh>
      <mesh position={[-0.7, 0.04, -0.32]} rotation={[1.28, 0.25, 0.18]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.25, 14]} />
        <meshStandardMaterial color="#1f9fb6" metalness={0.38} roughness={0.28} wireframe />
      </mesh>
      <mesh position={[0.62, 0.1, -0.34]} rotation={[1.2, -0.32, -0.16]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.16, 14]} />
        <meshStandardMaterial color="#1f9fb6" metalness={0.38} roughness={0.28} wireframe />
      </mesh>
      <BoltRing x={0} radius={0.44} count={8} color="#f1c7c7" />
    </group>
  );
}

function AfterburnerPlume({ running }: { running: boolean }) {
  const pointsRef = useRef<Points>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 180 }, (_, index) => {
        const ring = index % 18;
        const band = Math.floor(index / 18);
        return {
          base: (index * 0.073) % 1,
          angle: (ring / 18) * Math.PI * 2 + band * 0.19,
          radius: 0.12 + ((index * 37) % 100) / 100 * 0.42,
          speed: 0.55 + ((index * 17) % 100) / 100 * 0.9
        };
      }),
    []
  );
  const positions = useMemo(() => {
    const data = new Float32Array(seeds.length * 3);

    seeds.forEach((seed, index) => {
      const travel = seed.base;
      const taper = 1 - travel * 0.72;
      data[index * 3] = 2.62 + travel * 3.28;
      data[index * 3 + 1] = Math.cos(seed.angle) * seed.radius * taper;
      data[index * 3 + 2] = Math.sin(seed.angle) * seed.radius * taper;
    });

    return data;
  }, [seeds]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) {
      return;
    }

    const attribute = pointsRef.current.geometry.getAttribute("position") as BufferAttribute;
    const data = attribute.array as Float32Array;
    const elapsed = clock.getElapsedTime();

    seeds.forEach((seed, index) => {
      const travel = running ? (seed.base + elapsed * 0.22 * seed.speed) % 1 : seed.base;
      const taper = 1 - travel * 0.72;
      const pulse = Math.sin(elapsed * 8 + index) * 0.035;

      data[index * 3] = 2.62 + travel * 3.28;
      data[index * 3 + 1] = Math.cos(seed.angle + elapsed * 0.35) * (seed.radius + pulse) * taper;
      data[index * 3 + 2] = Math.sin(seed.angle + elapsed * 0.35) * (seed.radius + pulse) * taper;
    });

    attribute.needsUpdate = true;
    pointsRef.current.rotation.x += running ? delta * 0.22 : 0;
  });

  return (
    <group>
      <mesh position={[2.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.56, 0.88, 48, 1, true]} />
        <meshStandardMaterial
          color="#3c52ff"
          emissive="#3c52ff"
          emissiveIntensity={0.72}
          transparent
          opacity={0.34}
          side={DoubleSide}
          wireframe
        />
      </mesh>
      <mesh position={[3.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.48, 1.45, 48, 1, true]} />
        <meshStandardMaterial
          color="#ffb02e"
          emissive="#ffb02e"
          emissiveIntensity={1.45}
          transparent
          opacity={running ? 0.42 : 0.16}
          side={DoubleSide}
          wireframe
        />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd36b"
          size={0.055}
          transparent
          opacity={running ? 0.92 : 0.28}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <Html position={[3.18, 0.72, 0.34]} center distanceFactor={6}>
        <div className="max-w-24 rounded-md border border-amber/70 bg-ink/90 px-2 py-1 text-[10px] font-bold leading-tight text-amber shadow-sm">
          live exhaust
        </div>
      </Html>
    </group>
  );
}

function EngineRing({ x, radius, tube, color }: { x: number; radius: number; tube: number; color: string }) {
  return (
      <mesh rotation={[0, Math.PI / 2, 0]} position={[x, 0, 0]} castShadow>
      <torusGeometry args={[radius, tube, 18, 80]} />
      <meshStandardMaterial color={color} metalness={0.55} roughness={0.24} wireframe />
    </mesh>
  );
}

function BoltRing({
  x,
  radius,
  count,
  color
}: {
  x: number;
  radius: number;
  count: number;
  color: string;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return (
          <mesh key={index} position={[x, Math.cos(angle) * radius, Math.sin(angle) * radius]} castShadow>
            <sphereGeometry args={[0.035, 12, 8]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} emissive={color} emissiveIntensity={0.28} />
          </mesh>
        );
      })}
    </group>
  );
}

function BladeRing({
  count,
  radius,
  bladeLength,
  chord,
  color,
  twist,
  offset = 0
}: {
  count: number;
  radius: number;
  bladeLength: number;
  chord: number;
  color: string;
  twist: number;
  offset?: number;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + offset;
        return (
          <mesh
            key={index}
            position={[0, Math.cos(angle) * radius, Math.sin(angle) * radius]}
            rotation={[angle, 0, twist]}
            castShadow
          >
            <boxGeometry args={[chord, bladeLength, chord * 1.6]} />
            <meshStandardMaterial color={color} metalness={0.58} roughness={0.24} wireframe />
          </mesh>
        );
      })}
    </group>
  );
}

function StatorRing({
  radius,
  count,
  color,
  offset = 0
}: {
  radius: number;
  count: number;
  color: string;
  offset?: number;
}) {
  return (
    <group>
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + offset;
        return (
          <mesh key={index} position={[0.08, Math.cos(angle) * radius, Math.sin(angle) * radius]} rotation={[angle, 0, -0.22]} castShadow>
            <boxGeometry args={[0.035, 0.32, 0.045]} />
            <meshStandardMaterial color={color} metalness={0.42} roughness={0.32} wireframe />
          </mesh>
        );
      })}
    </group>
  );
}

function SectionPlane() {
  return (
    <mesh position={[0.35, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[3.6, 3.2]} />
      <meshStandardMaterial color="#c98314" transparent opacity={0.18} side={DoubleSide} />
    </mesh>
  );
}

function MeasurementOverlay() {
  return (
    <group>
      <mesh position={[-1.45, -1.18, 1.38]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 2.9, 12]} />
        <meshStandardMaterial color="#23845c" />
      </mesh>
      <Html position={[-1.45, -1.18, 1.55]} center distanceFactor={8}>
        <div className="rounded-md border border-success bg-white px-2 py-1 text-xs font-bold text-success shadow-sm">
          OD 1280.4 mm
        </div>
      </Html>
      <Html position={[1.55, -0.85, -1.1]} center distanceFactor={8}>
        <div className="rounded-md border border-marine bg-white px-2 py-1 text-xs font-bold text-marine shadow-sm">
          Gap 0.35 mm
        </div>
      </Html>
    </group>
  );
}

function FaultMarkers() {
  return (
    <group>
      <Html position={[0.9, 0.08, 1.48]} center distanceFactor={7}>
        <div className="flex items-center gap-2 rounded-md border border-danger bg-white px-2 py-1 text-xs font-bold text-danger shadow-sm">
          <AlertTriangle aria-hidden="true" size={14} />
          Leak F-22
        </div>
      </Html>
      <Html position={[-0.9, 0.92, 0.82]} center distanceFactor={7}>
        <div className="flex items-center gap-2 rounded-md border border-amber bg-white px-2 py-1 text-xs font-bold text-amber shadow-sm">
          <Wrench aria-hidden="true" size={14} />
          Replace seal
        </div>
      </Html>
    </group>
  );
}
