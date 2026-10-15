import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { timelineData } from '../utils/timelineData';

// CatmullRom Curve along all milestone points
export const timelineCurvePoints = timelineData.map(
  (item) => new THREE.Vector3(item.position.x, item.position.y, item.position.z)
);

export const timelineCurve = new THREE.CatmullRomCurve3(
  timelineCurvePoints,
  false,
  'catmullrom',
  0.15
);

// Holographic glowing pedestal under the model
function WalkingPedestal({ isWalking, color = '#FF9933' }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * (isWalking ? 2.5 : 0.6);
    }
  });

  return (
    <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Inner glowing core disc */}
      <mesh>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isWalking ? 0.45 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={isWalking ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Fallback stylized mesh if GLTF is loading
function StylizedModiFallback({ color = '#FF9933', isWalking }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFE0BD" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 1.3, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Saffron stole */}
      <mesh position={[0, 1.1, 0.2]}>
        <boxGeometry args={[0.7, 1.1, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0.2, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </group>
  );
}

// 3D Modi Model with Spline Curve Walking Animation
function ModiWalkingModel({ targetIndex, activeEvent }) {
  const modelGroupRef = useRef();
  const innerRigRef = useRef();
  const [isWalking, setIsWalking] = useState(false);
  const walkPhaseRef = useRef(0);
  const currentTRef = useRef(targetIndex / (timelineData.length - 1));
  const tweenRef = useRef(null);

  // Load GLTF model safely
  let gltf = null;
  try {
    gltf = useGLTF('/models/modi-model.glb');
  } catch (err) {
    console.warn('Error loading GLTF model:', err);
  }

  // Animate model along the 3D spline path when targetIndex changes
  useEffect(() => {
    const targetT = targetIndex / (timelineData.length - 1);
    const startT = currentTRef.current;
    const distance = Math.abs(targetT - startT);

    if (distance > 0.001) {
      setIsWalking(true);

      if (tweenRef.current) tweenRef.current.kill();

      const animObj = { t: startT };
      const duration = Math.max(1.4, Math.min(3.6, distance * 5));

      tweenRef.current = gsap.to(animObj, {
        t: targetT,
        duration: duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          currentTRef.current = animObj.t;
          updatePositionAndOrientation(animObj.t, targetT > startT);
        },
        onComplete: () => {
          currentTRef.current = targetT;
          setIsWalking(false);
          // Face slightly forward/camera when idle at milestone
          if (innerRigRef.current) {
            gsap.to(innerRigRef.current.rotation, {
              y: 0,
              x: 0,
              z: 0,
              duration: 0.8,
              ease: 'power2.out'
            });
            gsap.to(innerRigRef.current.position, {
              y: 0,
              duration: 0.5
            });
          }
        }
      });
    } else {
      updatePositionAndOrientation(targetT, true);
    }

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [targetIndex]);

  // Function to place and rotate model along the curve
  const updatePositionAndOrientation = (t, movingForward) => {
    if (!modelGroupRef.current) return;

    const clampedT = Math.max(0, Math.min(1, t));
    const point = timelineCurve.getPointAt(clampedT);
    const tangent = timelineCurve.getTangentAt(clampedT).normalize();

    // Position the parent group
    modelGroupRef.current.position.set(point.x, point.y, point.z);

    // Orient model towards the tangent (forward along the path)
    if (innerRigRef.current) {
      const lookTarget = point.clone().add(movingForward ? tangent : tangent.negate());
      innerRigRef.current.lookAt(lookTarget.x, point.y, lookTarget.z);
    }
  };

  // Frame loop for walking bob and idle breathing
  useFrame((state, delta) => {
    if (innerRigRef.current) {
      if (isWalking) {
        walkPhaseRef.current += delta * 12;
        // Subtle vertical bounce of walking
        const bounce = Math.abs(Math.sin(walkPhaseRef.current)) * 0.16;
        innerRigRef.current.position.y = bounce;

        // Subtle side-to-side natural sway
        const sway = Math.sin(walkPhaseRef.current) * 0.05;
        innerRigRef.current.rotation.z = sway;
      } else {
        // Idle gentle breathing
        const breathe = Math.sin(state.clock.elapsedTime * 1.8) * 0.03;
        innerRigRef.current.position.y = breathe;
      }
    }
  });

  return (
    <group ref={modelGroupRef} position={[timelineData[0].position.x, timelineData[0].position.y, timelineData[0].position.z]}>
      {/* Holographic Glowing Pedestal */}
      <WalkingPedestal isWalking={isWalking} color={activeEvent?.color || '#FF9933'} />

      {/* Model Inner Rig with automatic bottom alignment */}
      <group ref={innerRigRef}>
        {gltf && gltf.scene ? (
          <Center bottom position={[0, 0, 0]}>
            <primitive
              object={gltf.scene.clone()}
              scale={0.55}
              castShadow
            />
          </Center>
        ) : (
          <StylizedModiFallback color={activeEvent?.color} isWalking={isWalking} />
        )}
      </group>

      {/* Spotlight following the model */}
      <pointLight
        color={activeEvent?.color || '#FF9933'}
        intensity={3.5}
        distance={12}
        position={[0, 4, 3]}
      />
      <pointLight
        color="#ffffff"
        intensity={1.2}
        distance={8}
        position={[0, 2, -3]}
      />
    </group>
  );
}

// Glowing Curved Timeline Ribbon
function TimelineRibbon({ activeMarker }) {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(timelineCurve, 200, 0.2, 16, false);
  }, []);

  const glowGeometry = useMemo(() => {
    return new THREE.TubeGeometry(timelineCurve, 120, 0.45, 8, false);
  }, []);

  return (
    <group>
      {/* Core illuminated tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#FF9933"
          emissive="#FF7700"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer translucent energy field */}
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.16}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Milestone Checkpoint Markers along the path
function MilestoneMarkers({ onMarkerClick, activeMarker, filteredIds }) {
  return timelineData.map((item) => {
    const isFiltered = filteredIds && !filteredIds.includes(item.id);
    const isActive = activeMarker === item.id;

    return (
      <group
        key={item.id}
        position={[item.position.x, item.position.y, item.position.z]}
      >
        {/* Pulsing Interactive Orb */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onMarkerClick(item);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
          scale={isActive ? 1.5 : isFiltered ? 0.7 : 1.1}
        >
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.color}
            emissiveIntensity={isActive ? 1.4 : 0.5}
            roughness={0.1}
            metalness={0.8}
            transparent={isFiltered}
            opacity={isFiltered ? 0.35 : 1}
          />
        </mesh>

        {/* Milestone Badge in 3D Space */}
        <Html
          position={[0, 1.8, 0]}
          center
          distanceFactor={36}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(item);
            }}
            style={{
              background: isActive
                ? `linear-gradient(135deg, rgba(25, 30, 45, 0.95), rgba(45, 25, 15, 0.95))`
                : `rgba(12, 16, 22, 0.85)`,
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              fontFamily: "'Inter', sans-serif",
              border: isActive ? `1.5px solid ${item.color}` : '1px solid rgba(255,255,255,0.15)',
              boxShadow: isActive ? `0 0 24px ${item.color}88` : '0 4px 16px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isFiltered ? 0.4 : 1,
              pointerEvents: 'auto'
            }}
          >
            <div style={{ fontWeight: 800, color: item.color, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{item.year}</span>
              {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />}
            </div>
            <div style={{ fontSize: '11px', color: '#E2E8F0', marginTop: '2px', fontWeight: 500 }}>
              {item.title}
            </div>
          </div>
        </Html>
      </group>
    );
  });
}

// Atmospheric Tricolor Particles
function AtmosphericParticles() {
  const count = 350;
  const meshRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const saffron = new THREE.Color('#FF9933');
    const white = new THREE.Color('#FFFFFF');
    const green = new THREE.Color('#138808');
    const gold = new THREE.Color('#FFD700');
    const palette = [saffron, white, green, gold];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.25) * 170;
      pos[i * 3 + 1] = Math.random() * 32 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 65;

      const chosen = palette[i % palette.length];
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.45}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Smart Camera Choreographer ensuring the model is never hidden behind information panels
function SmartCameraController({ activeEvent, hasPopup, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!activeEvent) return;

    // When popup is open on the right, shift target slightly to the right so
    // the 3D model appears unobstructed in the open left 60% of the screen
    const xOffset = hasPopup ? 5.5 : 0;
    const targetX = activeEvent.position.x + xOffset;
    const targetY = activeEvent.position.y + 1.8;
    const targetZ = activeEvent.position.z;

    const camX = (activeEvent.cameraPosition?.x ?? activeEvent.position.x) + (hasPopup ? 4 : 0);
    const camY = activeEvent.cameraPosition?.y ?? (activeEvent.position.y + 9);
    const camZ = activeEvent.cameraPosition?.z ?? (activeEvent.position.z + 24);

    // Smoothly animate camera position
    gsap.to(camera.position, {
      x: camX,
      y: camY,
      z: camZ,
      duration: 2.2,
      ease: 'power3.inOut'
    });

    // Smoothly update OrbitControls center target
    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 2.2,
        ease: 'power3.inOut'
      });
    }
  }, [activeEvent, hasPopup, camera, controlsRef]);

  return null;
}

export default function Scene({ activeMarker, onMarkerClick, filteredIds, hasPopup }) {
  const controlsRef = useRef();

  const activeIndex = useMemo(() => {
    const idx = timelineData.findIndex((d) => d.id === activeMarker);
    return idx >= 0 ? idx : 0;
  }, [activeMarker]);

  const activeEvent = timelineData[activeIndex];

  return (
    <Canvas
      camera={{ position: [-30, 14, 38], fov: 46 }}
      style={{ width: '100%', height: '100vh', background: '#080a0f' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#080a0f']} />
      <fog attach="fog" args={['#080a0f', 55, 170]} />

      {/* Lighting Setup */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[25, 35, 25]} intensity={1.6} color="#fff6e8" castShadow />
      <pointLight position={[-35, 20, 15]} intensity={1.3} color="#FF9933" />
      <pointLight position={[55, 25, 15]} intensity={1.3} color="#138808" />

      {/* 3D Modi Model Walking Along the Timeline Spline Curve */}
      <ModiWalkingModel targetIndex={activeIndex} activeEvent={activeEvent} />

      {/* 3D Curved Glowing Timeline Ribbon */}
      <TimelineRibbon activeMarker={activeMarker} />

      {/* Interactive Milestone Checkpoints */}
      <MilestoneMarkers
        onMarkerClick={onMarkerClick}
        activeMarker={activeMarker}
        filteredIds={filteredIds}
      />

      {/* Ambient Tricolor Floating Atmosphere */}
      <AtmosphericParticles />

      {/* Smart Camera Framing that keeps Model Unobscured */}
      <SmartCameraController
        activeEvent={activeEvent}
        hasPopup={hasPopup}
        controlsRef={controlsRef}
      />

      {/* Interactive Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={6}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2 + 0.05}
        target={[activeEvent.position.x + (hasPopup ? 5.5 : 0), activeEvent.position.y + 1.8, activeEvent.position.z]}
      />

      {/* Ground Grid for Depth */}
      <gridHelper
        args={[240, 90, '#2d3748', '#141a24']}
        position={[25, -0.6, 0]}
      />
    </Canvas>
  );
}
