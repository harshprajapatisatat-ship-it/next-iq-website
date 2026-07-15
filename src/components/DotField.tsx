'use client';

import { useRef, useEffect } from 'react';

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

// Parse "rgba(r,g,b,a)" or "#rrggbb" → [r,g,b,a]
function parseColor(str: string): [number, number, number, number] {
  const rgba = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (rgba) return [+rgba[1], +rgba[2], +rgba[3], rgba[4] !== undefined ? +rgba[4] : 1];
  const hex = str.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
    1,
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function DotField({
  dotRadius     = 1.2,
  dotSpacing    = 14,
  cursorRadius  = 500,
  bulgeOnly     = true,
  bulgeStrength = 67,
  glowRadius    = 160,
  sparkle       = false,
  waveAmplitude = 0,
  gradientFrom  = 'rgba(255,255,255,0.55)',
  gradientTo    = 'rgba(255,255,255,0.25)',
  glowColor     = '#3f3f46',
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -99999, y: -99999 });
  const rafRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fromC = parseColor(gradientFrom);
    const toC   = parseColor(gradientTo);
    const glowC = parseColor(glowColor);

    let dots: { bx: number; by: number }[] = [];

    const buildGrid = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      dots = [];
      for (let y = dotSpacing / 2; y < h; y += dotSpacing) {
        for (let x = dotSpacing / 2; x < w; x += dotSpacing) {
          dots.push({ bx: x, by: y });
        }
      }
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasPointer = mx > -9000;

      // Purple glow halo beneath the dots near the cursor
      if (hasPointer && glowRadius > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        grd.addColorStop(0, `rgba(${glowC[0]},${glowC[1]},${glowC[2]},0.22)`);
        grd.addColorStop(1, `rgba(${glowC[0]},${glowC[1]},${glowC[2]},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      for (const { bx, by } of dots) {
        const dx   = bx - mx;
        const dy   = by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // t = 1 at cursor, 0 at cursorRadius edge
        const t = hasPointer && dist < cursorRadius
          ? Math.max(0, 1 - dist / cursorRadius)
          : 0;

        // Bulge: push dot away from cursor
        let px = bx;
        let py = by;
        if (t > 0 && dist > 0) {
          if (!bulgeOnly || dx * dx + dy * dy > 0) {
            const push = t * bulgeStrength;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }

        // Interpolate color: toC (far/dim) → fromC (near/bright)
        const r = lerp(toC[0], fromC[0], t);
        const g = lerp(toC[1], fromC[1], t);
        const b = lerp(toC[2], fromC[2], t);
        const a = lerp(toC[3], fromC[3], t);

        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -99999, y: -99999 }; };

    const ro = new ResizeObserver(() => {
      buildGrid();
    });

    buildGrid();
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    ro.observe(canvas);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotRadius, dotSpacing, cursorRadius, bulgeOnly, bulgeStrength, glowRadius,
      sparkle, waveAmplitude, gradientFrom, gradientTo, glowColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position    : 'absolute',
        inset       : 0,
        width       : '100%',
        height      : '100%',
        display     : 'block',
        borderRadius: 'inherit',
      }}
    />
  );
}
