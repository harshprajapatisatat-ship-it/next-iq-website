'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './SocialProof.module.css';

const PILL_H      = 52;
const FONT_SZ     = 22;   // px — scaled by pillScale for narrow viewports
const PILL_PAD_V  = 14;   // px — scaled by pillScale for narrow viewports
const PILL_PAD_H  = 24;   // px — scaled by pillScale for narrow viewports
const OVERLAY_TOP = 150; // overlay starts this many px above the section top

interface Pill    { text: string; bg: string; fg: string; w: number }
/* w/h are the file's intrinsic pixels — next/image needs them to reserve
   space; the rendered size comes from .logoImg in the stylesheet. */
interface LogoDef { name: string; src: string; w: number; h: number }

const PILLS: Pill[] = [
  { text: 'Fantastic',      bg: '#ff894a', fg: '#18181b', w: 156 },
  { text: 'Next-level',     bg: '#fdcf00', fg: '#18181b', w: 163 },
  { text: 'mind-blowingly', bg: '#f4f4f5', fg: '#18181b', w: 218 },
  { text: 'Whoa',           bg: '#fdcf00', fg: '#18181b', w: 116 },
  { text: 'my superpower',  bg: '#f2d4da', fg: '#18181b', w: 222 },
  { text: 'Awesome!',       bg: '#09090b', fg: '#ffffff', w: 158 },
  { text: 'Insane',         bg: '#d9c9ff', fg: '#18181b', w: 124 },
  { text: 'Amazing!',       bg: '#f4f4f5', fg: '#18181b', w: 149 },
  { text: 'Unreal',         bg: '#ff894a', fg: '#18181b', w: 124 },
  { text: 'Super!',         bg: '#5adba5', fg: '#18181b', w: 122 },
  { text: 'Incredible',     bg: '#5adba5', fg: '#18181b', w: 156 },
  { text: 'Perfect!',       bg: '#f4f4f5', fg: '#18181b', w: 139 },
  { text: 'No way!',        bg: '#f2d4da', fg: '#18181b', w: 139 },
  { text: 'Unbelievable',   bg: '#8ebfe1', fg: '#18181b', w: 186 },
  { text: 'mind-blowing',   bg: '#5adba5', fg: '#18181b', w: 198 },
  { text: 'Game-changer',   bg: '#fdcf00', fg: '#18181b', w: 206 },
];

/* Real customer logos, in the order supplied. Files live in public/logos/. */
const LOGOS: LogoDef[] = [
  { name: 'Wabsus InfraTech Private Limited', src: '/logos/wabsus.png',       w: 1028, h: 300 },
  { name: 'Khetan Udyog',                     src: '/logos/khetan-udyog.jpg', w: 200,  h: 200 },
  { name: 'Krian Pharma',                     src: '/logos/kriam-pharma.png', w: 668,  h: 190 },
  { name: 'H. P. Automation Pvt. Ltd.',       src: '/logos/hp-automation.jpg', w: 200, h: 200 },
  { name: 'SMVS',                             src: '/logos/smvs.jpg',         w: 447,  h: 447 },
];

/* Same pill component/physics on every breakpoint. The only viewport-
   dependent knob is this scale factor (1 = desktop, untouched) — it
   shrinks pill geometry slightly on narrow screens so the same engine
   doesn't need as many stacked rows to fit everyone in. Everything
   else (gravity, restitution, friction, spawn randomness, stagger,
   collision, the single scroll-triggered run) is identical code. */
function pillScaleFor(width: number) {
  if (width < 480) return 0.72;
  if (width < 768) return 0.88;
  return 1;
}

function LogoItem({ logo }: { logo: LogoDef }) {
  /* Wide wordmark vs square mark — drives which height it gets (see the CSS). */
  const isWordmark = logo.w / logo.h >= 2;
  return (
    <span className={styles.logoItem}>
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.w}
        height={logo.h}
        className={`${styles.logoImg} ${isWordmark ? styles.logoWide : styles.logoMark}`}
      />
    </span>
  );
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logosRef   = useRef<HTMLDivElement>(null);
  const pillRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const [pillScale, setPillScale] = useState(1);
  const pillScaleRef = useRef(1);

  useEffect(() => {
    const update = () => {
      const s = pillScaleFor(window.innerWidth);
      pillScaleRef.current = s;
      setPillScale(s);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let started   = false;
    let cleanupFn: (() => void) | null = null;

    const runPhysics = async () => {
      const overlay = overlayRef.current;
      const logos   = logosRef.current;
      if (!overlay || !logos) return;

      const scale = pillScaleRef.current;
      const pillH = PILL_H * scale;

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
        const pillW = pill.w * scale;

        // Spawn above the overlay top (negative y in overlay coords).
        const spawnX    = 80 + Math.random() * Math.max(W - 160, 100);
        const spawnY    = -(80 + Math.random() * 120);
        const initAngle = (Math.random() - 0.5) * 0.6;

        const body = M.Bodies.rectangle(spawnX, spawnY, pillW, pillH, {
          restitution: 0.25,
          friction   : 0.3,
          frictionAir: 0.018,
          density    : 0.002,
          angle      : initAngle,
          chamfer    : { radius: pillH / 2 },
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
          const hw = (PILLS[i].w * scale) / 2;
          el.style.transform =
            `translate(${x - hw}px, ${y - pillH / 2}px) rotate(${body.angle}rad)`;
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
    <section ref={sectionRef} id="our-clients" className={styles.section}>

      {/* Physics overlay — pills spawn above the section and fall to the floor.
          Positioned OVERLAY_TOP px above section top; overflow: visible so pills
          that spawn above the overlay itself are still rendered. Same component
          and physics on every breakpoint — pillScale (1 on desktop) is the only
          viewport-dependent value, applied to geometry only. */}
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
              height        : `${PILL_H * pillScale}px`,
              width         : `${pill.w * pillScale}px`,
              display       : 'flex',
              alignItems    : 'center',
              justifyContent: 'center',
              borderRadius  : '9999px',
              background    : pill.bg,
              color         : pill.fg,
              fontFamily    : 'var(--font-matter)',
              fontSize      : `${FONT_SZ * pillScale}px`,
              fontWeight    : 500,
              whiteSpace    : 'nowrap',
              opacity       : 0,
              willChange    : 'transform',
              userSelect    : 'none',
              padding       : `${PILL_PAD_V * pillScale}px ${PILL_PAD_H * pillScale}px`,
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
          13,000+ Professionals Scan<br /> with NextIQ
        </h2>
      </div>

      {/* Flex spacer — pushes logo strip to the section bottom */}
      <div className={styles.spacer} style={{ flex: 1, minHeight: 32 }} aria-hidden="true" />

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
