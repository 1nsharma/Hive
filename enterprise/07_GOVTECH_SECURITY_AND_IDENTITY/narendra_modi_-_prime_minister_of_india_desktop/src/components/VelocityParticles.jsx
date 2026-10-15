import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function VelocityParticles({ scrollVelocity = 0, count = 250 }) {
  const pointsRef = useRef();

  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const saffron = new THREE.Color('#FF9933');
    const gold = new THREE.Color('#FFD700');
    const white = new THREE.Color('#FFFFFF');
    const green = new THREE.Color('#138808');
    const palette = [saffron, gold, white, green];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const chosen = palette[i % palette.length];
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;

      spd[i] = 0.5 + Math.random() * 1.5;
    }

    return [pos, col, spd];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // React to scroll velocity: higher velocity = faster drift & stretch
    const vel = Math.min(Math.abs(scrollVelocity) * 0.05, 4.0);
    const speedMultiplier = 1.0 + vel * 2.5;

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 * speedMultiplier;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;

    // Pulse size slightly with speed
    const mat = pointsRef.current.material;
    if (mat) {
      mat.size = 0.35 + vel * 0.15;
      mat.opacity = 0.55 + Math.min(vel * 0.2, 0.4);
    }
  });

  return (
    <points ref={pointsRef}>
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
        size={0.4}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
