'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhysicsPills.module.css';

const PILL_H = 38;

interface PillDef {
  text: string;
  bg: string;
  fg: string;
  w: number;
}

// Same pills as SocialProof marquee — they "fall" from the Hero transition
const PILLS: PillDef[] = [
  { text: 'Fantastic',      bg: '#ff894a', fg: '#18181b', w: 115 },
  { text: 'Next-level',     bg: '#fdcf00', fg: '#18181b', w: 122 },
  { text: 'mind-blowingly', bg: '#f4f4f5', fg: '#18181b', w: 172 },
  { text: 'Whoa',           bg: '#fdcf00', fg: '#18181b', w: 83  },
  { text: 'my superpower',  bg: '#f2d4da', fg: '#18181b', w: 160 },
  { text: 'Awesome!',       bg: '#09090b', fg: '#ffffff', w: 118 },
  { text: 'Insane',         bg: '#d9c9ff', fg: '#18181b', w: 93  },
  { text: 'Amazing!',       bg: '#f4f4f5', fg: '#18181b', w: 112 },
  { text: 'Unreal',         bg: '#ff894a', fg: '#18181b', w: 93  },
  { text: 'Super!',         bg: '#5adba5', fg: '#18181b', w: 88  },
  { text: 'Incredible',     bg: '#5adba5', fg: '#18181b', w: 116 },
  { text: 'Perfect!',       bg: '#f4f4f5', fg: '#18181b', w: 104 },
];

export default function PhysicsPills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const cleanupRef   = useRef<(() => void) | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let started = false;

    const run = async () => {
      if (started) return;
      started = true;

      const container = containerRef.current;
      if (!container) return;

      // Dynamic import keeps matter-js out of the server bundle
      const M = await import('matter-js');

      const W = container.offsetWidth || window.innerWidth;
      const H = container.offsetHeight;

      const engine = M.Engine.create({
        gravity: { x: 0, y: 1.4 },
        enableSleeping: true,
      });
      const runner = M.Runner.create();

      // Floor at overlay y=420 → ~270px below section top
      const floor = M.Bodies.rectangle(W / 2, 420, W + 200, 40, {
        isStatic: true, friction: 0.5, restitution: 0.2,
      });
      // Side walls prevent pills leaving the viewport horizontally
      const wallL = M.Bodies.rectangle(-30, 200, 60, 800, { isStatic: true });
      const wallR = M.Bodies.rectangle(W + 30, 200, 60, 800, { isStatic: true });
      M.Composite.add(engine.world, [floor, wallL, wallR]);

      const bodies: Matter.Body[] = [];
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      PILLS.forEach((pill, i) => {
        // Spawn above the overlay (negative y), random horizontal spread
        const spawnX    = 70 + Math.random() * Math.max(W - 140, 80);
        const spawnY    = -(60 + Math.random() * 100);
        const initAngle = (Math.random() - 0.5) * 0.55;

        const body = M.Bodies.rectangle(spawnX, spawnY, pill.w, PILL_H, {
          restitution: 0.3,
          friction: 0.2,
          frictionAir: 0.022,
          density: 0.0018,
          angle: initAngle,
          chamfer: { radius: PILL_H / 2 },
          sleepThreshold: 60,
        });

        M.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2.2,
          y: 0.8 + Math.random() * 1.2,
        });
        M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.07);

        // Stagger drops: one pill every ~200ms with small jitter
        const delay = i * 210 + Math.floor(Math.random() * 90);
        const t = setTimeout(() => {
          M.Composite.add(engine.world, body);
          const el = pillRefs.current[i];
          if (el) {
            el.style.transition = 'opacity 0.12s ease';
            el.style.opacity    = '1';
          }
        }, delay);

        timeouts.push(t);
        bodies.push(body);
      });

      M.Runner.run(runner, engine);

      // rAF loop: sync Matter.js body positions to DOM pill divs
      let rafId: number;
      const sync = () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          const { x, y } = body.position;
          const hw = PILLS[i].w / 2;
          el.style.transform = `translate(${x - hw}px, ${y - PILL_H / 2}px) rotate(${body.angle}rad)`;
        });
        rafId = requestAnimationFrame(sync);
      };
      rafId = requestAnimationFrame(sync);

      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        timeouts.forEach(clearTimeout);
        M.Runner.stop(runner);
        M.World.clear(engine.world, false);
        M.Engine.clear(engine);
      };
    };

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: run,
    });

    return () => {
      st.kill();
      cleanupRef.current?.();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.overlay} aria-hidden="true">
      {PILLS.map((pill, i) => (
        <div
          key={i}
          ref={(el) => { pillRefs.current[i] = el; }}
          className={styles.pill}
          style={{ background: pill.bg, color: pill.fg, width: pill.w }}
        >
          {pill.text}
        </div>
      ))}
    </div>
  );
}
