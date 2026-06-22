'use client';

import { useEffect, useRef } from 'react';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
}

function hexToVec3(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
}

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors = ['#ffffff'],
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 10,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrame: number;
    let teardown: (() => void) | undefined;

    import('ogl').then(({ Renderer, Camera, Geometry, Program, Mesh }) => {
      const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.style.display = 'block';
      container.appendChild(gl.canvas);

      const camera = new Camera(gl, { fov: 15 });
      camera.position.set(0, 0, cameraDistance);

      const resize = () => {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      };
      window.addEventListener('resize', resize, false);
      resize();

      // Compute world-space frustum dimensions at z=0 so particles fill the
      // entire canvas rather than clustering in the centre.
      // visH = full visible height in world units at the particle plane (z=0).
      const FOV_DEG = 15;
      const visH = 2 * Math.tan((FOV_DEG / 2) * (Math.PI / 180)) * cameraDistance;
      const aspect = container.offsetWidth / container.offsetHeight;
      // 20% bleed beyond edges so the boundary wrap is never visible.
      const sX = visH * aspect * 1.2;
      const sY = visH * 1.2;
      const sZ = 1.5; // very shallow depth — keeps dot sizes uniform

      type PData = { pos: [number, number, number]; vel: [number, number, number] };
      const pdata: PData[] = [];
      const positions = new Float32Array(particleCount * 3);
      const colors    = new Float32Array(particleCount * 3);
      const sizes     = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * sX;
        const y = (Math.random() - 0.5) * sY;
        const z = (Math.random() - 0.5) * sZ;
        pdata.push({
          pos: [x, y, z],
          vel: [
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed,
          ],
        });
        positions.set([x, y, z], i * 3);
        colors.set(
          hexToVec3(particleColors[Math.floor(Math.random() * particleColors.length)]),
          i * 3,
        );
        sizes[i] = particleBaseSize * (1 + (Math.random() - 0.5) * sizeRandomness);
      }

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        color:    { size: 3, data: colors },
        size:     { size: 1, data: sizes },
      });

      const vertex = /* glsl */ `
        attribute vec3 position;
        attribute vec3 color;
        attribute float size;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (20.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `;

      const fragment = /* glsl */ `
        precision highp float;
        varying vec3 vColor;
        uniform float uAlpha;
        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = length(uv);
          if (uAlpha < 0.5) {
            if (d > 0.5) discard;
            gl_FragColor = vec4(vColor, 0.4);
          } else {
            float a = (1.0 - smoothstep(0.3, 0.5, d)) * 0.5;
            gl_FragColor = vec4(vColor, a);
          }
        }
      `;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: { uAlpha: { value: alphaParticles ? 1.0 : 0.0 } },
        transparent: true,
        depthTest: false,
      });

      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (moveParticlesOnHover) window.addEventListener('mousemove', onMouseMove);

      const tick = () => {
        animFrame = requestAnimationFrame(tick);

        if (!disableRotation) {
          mesh.rotation.x -= 0.0002;
          mesh.rotation.y -= 0.0001;
        }
        if (moveParticlesOnHover) {
          mesh.rotation.x = -mouseY * particleHoverFactor * 0.1;
          mesh.rotation.y =  mouseX * particleHoverFactor * 0.1;
        }

        const pos = geometry.attributes.position.data as Float32Array;
        const hX = sX / 2, hY = sY / 2, hZ = sZ / 2;
        for (let i = 0; i < particleCount; i++) {
          const p = pdata[i];
          p.pos[0] += p.vel[0];
          p.pos[1] += p.vel[1];
          p.pos[2] += p.vel[2];
          if (p.pos[0] >  hX) p.pos[0] = -hX;
          if (p.pos[0] < -hX) p.pos[0] =  hX;
          if (p.pos[1] >  hY) p.pos[1] = -hY;
          if (p.pos[1] < -hY) p.pos[1] =  hY;
          if (p.pos[2] >  hZ) p.pos[2] = -hZ;
          if (p.pos[2] < -hZ) p.pos[2] =  hZ;
          pos[i * 3]     = p.pos[0];
          pos[i * 3 + 1] = p.pos[1];
          pos[i * 3 + 2] = p.pos[2];
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render({ scene: mesh, camera });
      };
      tick();

      teardown = () => {
        cancelAnimationFrame(animFrame);
        window.removeEventListener('resize', resize);
        if (moveParticlesOnHover) window.removeEventListener('mousemove', onMouseMove);
        if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    });

    return () => teardown?.();
  }, [
    particleCount, particleSpread, speed, particleColors,
    moveParticlesOnHover, particleHoverFactor, alphaParticles,
    particleBaseSize, sizeRandomness, cameraDistance, disableRotation,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
