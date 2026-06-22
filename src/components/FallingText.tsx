'use client';

import { useEffect, useRef } from 'react';

// 8 visual variants matching the reference pastel palette
// One dark accent (violet-700 / white) — the rest are soft pastels with coloured text
type ChipVariant =
  | 'accent'   // dark violet  — solid, most prominent
  | 'green'    // emerald-100  — light green + dark green text
  | 'lavender' // violet-200   — soft purple + violet text
  | 'mint'     // teal-100     — light teal + teal text
  | 'yellow'   // amber-100    — cream/yellow + amber text
  | 'pink'     // rose-200     — blush + rose text
  | 'sky'      // sky-100      — light blue + sky text
  | 'gray';    // gray-100     — off-white + gray text

interface WordChip {
  text: string;
  variant: ChipVariant;
}

const WORD_CHIPS: WordChip[] = [
  { text: 'AI Powered',        variant: 'accent'   },
  { text: 'Smart OCR',         variant: 'mint'     },
  { text: 'ERPNext Native',    variant: 'green'    },
  { text: 'Voice Commands',    variant: 'lavender' },
  { text: 'CRM Ready',         variant: 'yellow'   },
  { text: 'Lead Enrichment',   variant: 'pink'     },
  { text: 'Instant Sync',      variant: 'sky'      },
  { text: 'Zero Manual Entry', variant: 'gray'     },
  { text: 'Faster Follow-ups', variant: 'yellow'   },
  { text: 'Qualified Leads',   variant: 'mint'     },
  { text: 'Business Cards',    variant: 'green'    },
  { text: 'Automation First',  variant: 'accent'   },
];

// Pastel palette — matches the reference screenshot exactly
const VARIANT_CLASSES: Record<ChipVariant, string> = {
  accent:   'bg-violet-700  text-white        border border-violet-600  shadow-md  shadow-violet-700/20',
  green:    'bg-emerald-100 text-emerald-700  border border-emerald-200 shadow-sm  shadow-emerald-100/60',
  lavender: 'bg-violet-200  text-violet-800   border border-violet-300  shadow-sm  shadow-violet-200/60',
  mint:     'bg-teal-100    text-teal-700     border border-teal-200    shadow-sm  shadow-teal-100/60',
  yellow:   'bg-amber-100   text-amber-700    border border-amber-200   shadow-sm  shadow-amber-100/60',
  pink:     'bg-rose-200    text-rose-700     border border-rose-300    shadow-sm  shadow-rose-200/60',
  sky:      'bg-sky-100     text-sky-700      border border-sky-200     shadow-sm  shadow-sky-100/60',
  gray:     'bg-gray-100    text-gray-600     border border-gray-200    shadow-sm  shadow-gray-100/60',
};

export default function FallingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipsRef     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId: number;
    let stopFn: (() => void) | undefined;

    import('matter-js').then((mod) => {
      const Matter = mod.default;
      const { Engine, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter;

      const width  = container.offsetWidth;
      const height = container.offsetHeight;

      const engine = Engine.create({ gravity: { x: 0, y: 0.5 } });

      // Static walls + floor — floor sits just inside the hero bottom
      const ground    = Bodies.rectangle(width / 2,   height + 30,  width + 200, 60,       { isStatic: true, friction: 0.7, restitution: 0.2 });
      const leftWall  = Bodies.rectangle(-30,          height / 2,   60,          height * 3, { isStatic: true });
      const rightWall = Bodies.rectangle(width + 30,   height / 2,   60,          height * 3, { isStatic: true });
      World.add(engine.world, [ground, leftWall, rightWall]);

      const bodies: Matter.Body[] = [];

      chipsRef.current.forEach((chip, i) => {
        if (!chip) return;

        const w = chip.offsetWidth  || 160;
        const h = chip.offsetHeight || 52;

        const x = 80 + Math.random() * Math.max(1, width - 160);
        const y = -h - i * 80 - Math.random() * 50;

        const physicsBody = Bodies.rectangle(x, y, w, h, {
          restitution: 0.38,
          friction:    0.3,
          frictionAir: 0.01,
          density:     0.0012,
          angle: (Math.random() - 0.5) * 0.4,
          label: `chip-${i}`,
        });

        Body.setVelocity(physicsBody, {
          x: (Math.random() - 0.5) * 6,
          y: Math.random() * 1.5,
        });

        World.add(engine.world, physicsBody);
        bodies.push(physicsBody);
      });

      // ── Smooth drag-and-throw ──
      // Zero out air friction on the body being dragged so movement tracks the cursor
      // perfectly with no drag lag; restore it on release.
      const mouse = Mouse.create(container);
      const mc    = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.35,  // crisp tracking
          damping:   0.2,   // kills oscillation → feels smooth
          render: { visible: false },
        },
      });
      World.add(engine.world, mc);

      let draggedBody: Matter.Body | null = null;
      let savedFrictionAir = 0.01;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Events.on(mc, 'startdrag', (e: any) => {
        draggedBody = e.body as Matter.Body | null;
        if (draggedBody) {
          savedFrictionAir = draggedBody.frictionAir;
          Body.set(draggedBody, 'frictionAir', 0); // no air drag while held
        }
        container.style.cursor = 'grabbing';
      });

      Events.on(mc, 'enddrag', () => {
        if (draggedBody) {
          Body.set(draggedBody, 'frictionAir', savedFrictionAir);
          draggedBody = null;
        }
        container.style.cursor = 'default';
      });

      // ── Scroll-gravity effect ──
      let lastScrollY = window.scrollY;
      const onScroll = () => {
        const delta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (Math.abs(delta) < 1) return;
        const abs = Math.abs(delta);
        bodies.forEach((b) => {
          Body.applyForce(b, b.position, {
            x: (Math.random() - 0.5) * 0.003 * abs,
            y: delta > 0 ? -0.005 * abs : 0.002 * abs,
          });
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // Reveal chips
      chipsRef.current.forEach((c) => { if (c) c.style.opacity = '1'; });

      const runner = Runner.create();
      Runner.run(runner, engine);

      // Per-frame DOM sync
      const tick = () => {
        bodies.forEach((b, i) => {
          const chip = chipsRef.current[i];
          if (!chip) return;
          const x = b.position.x - chip.offsetWidth  / 2;
          const y = b.position.y - chip.offsetHeight / 2;
          chip.style.transform = `translate(${x}px, ${y}px) rotate(${b.angle}rad)`;
        });
        animFrameId = requestAnimationFrame(tick);
      };
      tick();

      stopFn = () => {
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(animFrameId);
        Runner.stop(runner);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => { stopFn?.(); };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ cursor: 'default', zIndex: 0 }}
    >
      {WORD_CHIPS.map((chip, i) => (
        <div
          key={chip.text}
          ref={(el) => { chipsRef.current[i] = el; }}
          className={[
            'absolute top-0 left-0 select-none whitespace-nowrap',
            'px-7 py-3.5 rounded-full text-base font-semibold',
            'cursor-grab active:cursor-grabbing transition-none',
            VARIANT_CLASSES[chip.variant],
          ].join(' ')}
          style={{ opacity: 0, willChange: 'transform', touchAction: 'none' }}
        >
          {chip.text}
        </div>
      ))}
    </div>
  );
}
