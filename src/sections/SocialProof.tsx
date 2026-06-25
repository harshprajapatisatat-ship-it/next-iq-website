'use client';

import { useEffect, useRef } from 'react';
import styles from './SocialProof.module.css';

const PILL_H      = 52;
const FONT_SZ     = '22px';
const PILL_PAD    = '14px 24px';
const OVERLAY_TOP = 150; // overlay starts this many px above the section top

interface Pill    { text: string; bg: string; fg: string; w: number }
interface LogoDef { name: string; color: string; accent: string }

const PILLS: Pill[] = [
  { text: 'Fantastic',      bg: '#fed7aa', fg: '#1f1f1f', w: 156 },
  { text: 'Next-level',     bg: '#fef9c3', fg: '#1f1f1f', w: 163 },
  { text: 'mind-blowingly', bg: '#f1f5f9', fg: '#1f1f1f', w: 218 },
  { text: 'Whoa',           bg: '#fef3c7', fg: '#1f1f1f', w: 116 },
  { text: 'my superpower',  bg: '#fce7f3', fg: '#1f1f1f', w: 222 },
  { text: 'Awesome!',       bg: '#1e2033', fg: '#ffffff', w: 158 },
  { text: 'Insane',         bg: '#ddd6fe', fg: '#1f1f1f', w: 124 },
  { text: 'Amazing!',       bg: '#ede9fe', fg: '#1f1f1f', w: 149 },
  { text: 'Unreal',         bg: '#ffedd5', fg: '#1f1f1f', w: 124 },
  { text: 'Super!',         bg: '#d1fae5', fg: '#1f1f1f', w: 122 },
  { text: 'Incredible',     bg: '#d1fae5', fg: '#1f1f1f', w: 156 },
  { text: 'Perfect!',       bg: '#ede9fe', fg: '#1f1f1f', w: 139 },
  { text: 'No way!',        bg: '#fdf2f8', fg: '#1f1f1f', w: 139 },
  { text: 'Unbelievable',   bg: '#e0f2fe', fg: '#1f1f1f', w: 186 },
  { text: 'mind-blowing',   bg: '#f0fdf4', fg: '#1f1f1f', w: 198 },
  { text: 'Game-changer',   bg: '#fef3c7', fg: '#1f1f1f', w: 206 },
];

const LOGOS: LogoDef[] = [
  { name: 'PandaDoc',    color: '#1e3a8a', accent: '#2563eb' },
  { name: 'Orum',        color: '#0369a1', accent: '#0ea5e9' },
  { name: 'Opensense',   color: '#065f46', accent: '#059669' },
  { name: 'AppsFlyer',   color: '#4c1d95', accent: '#7c3aed' },
  { name: 'SAP',         color: '#1f2937', accent: '#374151' },
  { name: 'CaptivateIQ', color: '#991b1b', accent: '#dc2626' },
  { name: 'Collective',  color: '#374151', accent: '#6b7280' },
  { name: 'MaintainX',   color: '#3f6212', accent: '#65a30d' },
];

function LogoItem({ logo }: { logo: LogoDef }) {
  return (
    <span className={styles.logoItem}>
      <svg height="56" viewBox="0 0 180 32" fill="none" aria-label={logo.name}>
        <circle cx="14" cy="16" r="10" fill={logo.accent} opacity="0.15" />
        <circle cx="14" cy="16" r="6"  fill={logo.accent} />
        <text
          x="30" y="21"
          fontFamily="system-ui,sans-serif"
          fontSize="16"
          fontWeight="700"
          fill={logo.color}
          letterSpacing="-0.3"
        >
          {logo.name}
        </text>
      </svg>
    </span>
  );
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logosRef   = useRef<HTMLDivElement>(null);
  const pillRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let started   = false;
    let cleanupFn: (() => void) | null = null;

    const runPhysics = async () => {
      const overlay = overlayRef.current;
      const logos   = logosRef.current;
      if (!overlay || !logos) return;

      const M = await import('matter-js');
      const W = overlay.offsetWidth || window.innerWidth;

      // Physics y=0 is the overlay top (OVERLAY_TOP px above the section top).
      // Floor: 30px above the logo separator line, converted to overlay coords.
      const floorSectionY = logos.offsetTop - 30;
      const FLOOR_Y       = floorSectionY + OVERLAY_TOP;

      const engine = M.Engine.create({ gravity: { x: 0, y: 1.8 } });
      const runner  = M.Runner.create();

      const floor = M.Bodies.rectangle(W / 2, FLOOR_Y, W + 200, 20, {
        isStatic: true, friction: 0.6, restitution: 0.15,
      });
      const wallL = M.Bodies.rectangle(-30,    FLOOR_Y / 2, 60, FLOOR_Y * 2, { isStatic: true });
      const wallR = M.Bodies.rectangle(W + 30, FLOOR_Y / 2, 60, FLOOR_Y * 2, { isStatic: true });
      M.Composite.add(engine.world, [floor, wallL, wallR]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodies: any[] = [];
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      let addedCount = 0;
      let allAdded   = false;
      let settled    = false;
      let rafId      = 0;
      let cleared    = false;

      const clearEngine = () => {
        if (cleared) return;
        cleared = true;
        cancelAnimationFrame(rafId);
        timeouts.forEach(clearTimeout);
        M.Runner.stop(runner);
        M.World.clear(engine.world, false);
        M.Engine.clear(engine);
      };

      // Register cleanup before any async timing so unmount is always safe.
      cleanupFn = clearEngine;

      PILLS.forEach((pill, i) => {
        // Spawn above the overlay top (negative y in overlay coords).
        const spawnX    = 80 + Math.random() * Math.max(W - 160, 100);
        const spawnY    = -(80 + Math.random() * 120);
        const initAngle = (Math.random() - 0.5) * 0.6;

        const body = M.Bodies.rectangle(spawnX, spawnY, pill.w, PILL_H, {
          restitution: 0.25,
          friction   : 0.3,
          frictionAir: 0.018,
          density    : 0.002,
          angle      : initAngle,
          chamfer    : { radius: PILL_H / 2 },
        });
        M.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2.5,
          y: 1.2 + Math.random() * 1.5,
        });
        M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);

        const delay = i * 150 + Math.floor(Math.random() * 60);
        const t = setTimeout(() => {
          M.Composite.add(engine.world, body);
          addedCount++;
          if (addedCount === PILLS.length) allAdded = true;
          const el = pillRefs.current[i];
          if (el) { el.style.transition = 'opacity 0.12s ease'; el.style.opacity = '1'; }
        }, delay);
        timeouts.push(t);
        bodies.push(body);
      });

      M.Runner.run(runner, engine);

      const sync = () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (!el) return;
          const { x, y } = body.position;
          const hw = PILLS[i].w / 2;
          el.style.transform =
            `translate(${x - hw}px, ${y - PILL_H / 2}px) rotate(${body.angle}rad)`;
        });

        // Only check for settlement after every pill has been added to the world.
        if (allAdded && !settled) {
          const done = bodies.every(
            b =>
              Math.abs(b.velocity.x)      < 0.1 &&
              Math.abs(b.velocity.y)      < 0.1 &&
              Math.abs(b.angularVelocity) < 0.02,
          );
          if (done) {
            settled = true;
            clearEngine(); // stop physics — pills remain frozen at their final transforms
            return;        // exit rAF loop
          }
        }

        rafId = requestAnimationFrame(sync);
      };
      rafId = requestAnimationFrame(sync);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) { started = true; runPhysics(); }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { observer.disconnect(); cleanupFn?.(); };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* Physics overlay — pills spawn above the section and fall to the floor.
          Positioned OVERLAY_TOP px above section top; overflow: visible so pills
          that spawn above the overlay itself are still rendered. */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position     : 'absolute',
          top          : `-${OVERLAY_TOP}px`,
          left         : 0,
          width        : '100%',
          height       : '900px',
          pointerEvents: 'none',
          zIndex       : 5,
          overflow     : 'visible',
        }}
      >
        {PILLS.map((pill, i) => (
          <div
            key={i}
            ref={(el) => { pillRefs.current[i] = el; }}
            style={{
              position      : 'absolute',
              top           : 0,
              left          : 0,
              height        : `${PILL_H}px`,
              width         : `${pill.w}px`,
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              borderRadius  : '9999px',
              background    : pill.bg,
              color         : pill.fg,
              fontFamily    : 'var(--font-matter)',
              fontSize      : FONT_SZ,
              fontWeight    : 500,
              whiteSpace    : 'nowrap',
              opacity       : 0,
              willChange    : 'transform',
              userSelect    : 'none',
              padding       : PILL_PAD,
              boxSizing     : 'border-box',
              lineHeight    : 1,
            }}
          >
            {pill.text}
          </div>
        ))}
      </div>

      {/* Heading — z-index 20, always rendered above the pills layer */}
      <div className={styles.headWrap}>
        <h2 className={styles.heading}>
          Trusted by 13,000+<br />businesses
        </h2>
      </div>

      {/* Flex spacer — pushes logo strip to the section bottom */}
      <div style={{ flex: 1, minHeight: 32 }} aria-hidden="true" />

      {/* Logo marquee strip */}
      <div ref={logosRef} className={styles.logosOuter}>
        <div className={styles.logosTrack}>
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <LogoItem key={i} logo={logo} />
          ))}
        </div>
      </div>

    </section>
  );
}
