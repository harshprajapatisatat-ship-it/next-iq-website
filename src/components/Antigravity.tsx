'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
}

function ParticleField({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#ffffff',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0.0012,
}: AntigravityProps) {
  const points  = useRef<THREE.Points>(null!);
  const posAttr = useRef<THREE.BufferAttribute | null>(null);
  const mouse   = useRef(new THREE.Vector3(99999, 99999, 0));
  const { camera, gl } = useThree();

  const { positions, originals } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originals = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r     = ringRadius + (Math.random() - 0.5) * particleVariance * 2;
      const x     = Math.cos(angle) * r;
      const y     = Math.sin(angle) * r;
      const z     = (Math.random() - 0.5) * particleVariance;
      positions[i * 3]     = originals[i * 3]     = x;
      positions[i * 3 + 1] = originals[i * 3 + 1] = y;
      positions[i * 3 + 2] = originals[i * 3 + 2] = z;
    }
    return { positions, originals };
  }, [count, ringRadius, particleVariance]);

  // Imperatively set the buffer geometry once positions are ready
  useEffect(() => {
    if (!points.current) return;
    const attr = new THREE.BufferAttribute(positions, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    points.current.geometry.setAttribute('position', attr);
    posAttr.current = attr;
  }, [positions]);

  // Track mouse in world-space coords relative to the canvas element
  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx   = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
      const ny   = ((e.clientY - rect.top)  / rect.height) * -2 + 1;
      const vec  = new THREE.Vector3(nx, ny, 0.5).unproject(camera as THREE.Camera);
      const dir  = vec.sub((camera as THREE.Camera).position).normalize();
      const t    = -(camera as THREE.Camera).position.z / dir.z;
      const pos  = (camera as THREE.Camera).position.clone().add(dir.multiplyScalar(t));
      mouse.current.set(pos.x, pos.y, 0);
    };

    const onLeave = () => mouse.current.set(99999, 99999, 0);

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [camera, gl]);

  useFrame(({ clock }) => {
    if (!points.current || !posAttr.current) return;
    const t   = clock.getElapsedTime();
    const arr = posAttr.current.array as Float32Array;
    const mx  = mouse.current.x;
    const my  = mouse.current.y;

    for (let i = 0; i < count; i++) {
      const oi = i * 3;
      const ox = originals[oi];
      const oy = originals[oi + 1];

      // Gentle wave offset from rest position
      const wave = Math.sin(t * waveSpeed + ox * 0.4) * waveAmplitude * 0.12;
      let tx = ox;
      let ty = oy + wave;

      // Antigravity — push particles away from cursor
      const dx   = arr[oi]     - mx;
      const dy   = arr[oi + 1] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < magnetRadius && dist > 0.001) {
        const force = (1 - dist / magnetRadius) * 4;
        tx += (dx / dist) * force;
        ty += (dy / dist) * force;
      }

      // Smooth lerp toward target
      arr[oi]     += (tx - arr[oi])     * lerpSpeed;
      arr[oi + 1] += (ty - arr[oi + 1]) * lerpSpeed;
    }

    posAttr.current.needsUpdate = true;

    if (autoAnimate) {
      points.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry />
      <pointsMaterial
        color={color}
        size={particleSize * 0.055}
        sizeAttenuation
        transparent
        opacity={0.88}
        depthWrite={false}
      />
    </points>
  );
}

// The component positions itself absolutely so it fills whatever
// `position: relative` container it is placed inside.
export default function Antigravity(props: AntigravityProps) {
  return (
    <div
      style={{
        position : 'absolute',
        inset    : 0,
        overflow : 'hidden',
        borderRadius: 'inherit',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ParticleField {...props} />
      </Canvas>
    </div>
  );
}
