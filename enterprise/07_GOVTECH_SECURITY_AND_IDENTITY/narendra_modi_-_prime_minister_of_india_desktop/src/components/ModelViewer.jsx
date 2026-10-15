import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import VelocityParticles from './VelocityParticles';

// Fallback stylized representation
function FallbackModel() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFE0BD" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 1.3, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0.2]}>
        <boxGeometry args={[0.65, 1.0, 0.15]} />
        <meshStandardMaterial color="#E67E22" roughness={0.5} />
      </mesh>
      <mesh position={[-0.2, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, 0.35, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

export default function ModelViewer({ currentSectionData, scrollVelocity = 0 }) {
  const modelGroupRef = useRef();
  const innerRigRef = useRef();
  const { camera } = useThree();

  // Load GLTF model safely
  let gltf = null;
  try {
    gltf = useGLTF('/models/modi-model.glb', true);
  } catch (err) {
    console.warn('GLTF loading fallback:', err);
  }

  // Smooth lerp on every frame with epsilon throttling to save GPU/CPU cycles
  useFrame((state, delta) => {
    if (!currentSectionData) return;

    // Smoothly lerp camera position
    const camPos = currentSectionData.cameraPosition || { x: 0, y: 1.8, z: 7 };
    const camDist = camera.position.distanceTo(new THREE.Vector3(camPos.x, camPos.y, camPos.z));
    if (camDist > 0.0003) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camPos.x, 3.2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camPos.y, 3.2, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camPos.z, 3.2, delta);
    }

    // Smoothly lerp model group position with idle gating
    if (modelGroupRef.current) {
      const targetPos = currentSectionData.modelPosition || { x: 0, y: 0, z: 0 };
      const modelDist = modelGroupRef.current.position.distanceTo(
        new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
      );

      if (modelDist > 0.0003) {
        modelGroupRef.current.position.x = THREE.MathUtils.damp(modelGroupRef.current.position.x, targetPos.x, 3.6, delta);
        modelGroupRef.current.position.y = THREE.MathUtils.damp(modelGroupRef.current.position.y, targetPos.y, 3.6, delta);
        modelGroupRef.current.position.z = THREE.MathUtils.damp(modelGroupRef.current.position.z, targetPos.z, 3.6, delta);
      }
    }

    // Smoothly lerp model rotation & idle breathing
    if (innerRigRef.current) {
      const targetRot = currentSectionData.modelRotation || { x: 0, y: 0, z: 0 };
      const rotDiff = Math.abs(innerRigRef.current.rotation.y - targetRot.y);

      if (rotDiff > 0.0003) {
        innerRigRef.current.rotation.y = THREE.MathUtils.damp(innerRigRef.current.rotation.y, targetRot.y, 3.6, delta);
      }

      // Subtle breathing idle animation
      const breath = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      innerRigRef.current.position.y = breath;
    }
  });

  const chapterColor = currentSectionData?.chapterColor || '#E67E22';

  return (
    <>
      <group ref={modelGroupRef} position={[0, -0.2, 0]}>
        {/* Three-Point Cinematic Lighting Setup */}
        {/* 1. Warm Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          color="#FFF5E8"
          castShadow
        />

        {/* 2. Dramatic Saffron Rim Light */}
        <spotLight
          position={[-6, 6, -4]}
          intensity={3.5}
          color={chapterColor}
          angle={0.65}
          penumbra={0.7}
        />

        {/* 3. Emerald Green Soft Fill Light */}
        <pointLight
          position={[5, 2, -3]}
          intensity={1.4}
          color="#138808"
          distance={12}
        />

        {/* Golden Base Ambient Reflection Disc */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.45, 32]} />
          <meshBasicMaterial
            color={chapterColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 3D Model with Auto-Centering */}
        <group ref={innerRigRef}>
          {gltf && gltf.scene ? (
            <Center bottom position={[0, 0, 0]}>
              <primitive
                object={gltf.scene.clone()}
                scale={0.58}
              />
            </Center>
          ) : (
            <FallbackModel />
          )}
        </group>

        {/* Realistic Contact Shadows for Grounding */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.68}
          scale={10}
          blur={1.8}
          far={4}
          resolution={512}
          color="#000000"
        />
      </group>

      {/* Scroll-Velocity Reactive Atmosphere Particles */}
      <VelocityParticles scrollVelocity={scrollVelocity} count={220} />

      {/* Post-Processing Effects: Bloom & Vignette for Cinematic Glow */}
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.9}
          intensity={0.55}
          mipmapBlur
        />
        <Vignette
          offset={0.28}
          darkness={0.65}
          eskil={false}
        />
      </EffectComposer>
    </>
  );
}
