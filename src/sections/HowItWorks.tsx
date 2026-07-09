'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HowItWorks.module.css';
import DotField from '@/components/DotField';
import VoiceOrbit from '@/components/VoiceOrbit';
import MagnetLines from '@/components/MagnetLines';
import TrueFocus from '@/components/TrueFocus';

// ── Shared browser chrome ─────────────────────────────────────────
function BrowserBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`${styles.barChrome} ${dark ? styles.barDark : ''}`}>
      <span className={styles.dot} style={{ background: '#ff5f57' }} />
      <span className={styles.dot} style={{ background: '#febc2e' }} />
      <span className={styles.dot} style={{ background: '#28c840' }} />
    </div>
  );
}

function NxMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="14" fill="#7c3aed" />
      <path
        d="M9 20V8l5 8 5-8v12"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ── Card 1 — live DotField + in-browser product-demo video ─────────
function Card1() {
  return (
    <div className={styles.card1}>
      <DotField
        dotRadius={1.2}
        dotSpacing={14}
        cursorRadius={500}
        bulgeOnly={true}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(255,255,255,0.55)"
        gradientTo="rgba(255,255,255,0.25)"
        glowColor="#A855F7"
      />

      {/* Product-demo video, filling a single browser window */}
      <div className={styles.c1Frame} aria-hidden="true">
        <div className={styles.c1Window}>
          <BrowserBar dark />
          <div className={styles.c1WinBody}>
            <video
              className={styles.c1WinVideo}
              src="/videos/face-voice-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card 2 — voice orbit (Hello ring + diagonal band + audio UI) ─
function Card2() {
  return (
    <div className={styles.card2}>
      <VoiceOrbit />
      <div className={styles.c2Heading}>
        <TrueFocus
          sentence="All Language Support"
          manualMode={false}
          blurAmount={3}
          borderColor="#7c3aed"
          glowColor="rgba(124, 58, 237, 0.6)"
          animationDuration={0.5}
          pauseBetweenAnimations={0.5}
          fontSize="22px"
        />
      </div>
    </div>
  );
}

// ── Card 3 — lavender, magnet-lines background, "Generate" UI ───
function Card3() {
  return (
    <div className={styles.card3}>
      <MagnetLines
        rows={11}
        columns={9}
        lineColor="rgba(76, 29, 149, 0.55)"
        lineWidth="3px"
        lineHeight="16px"
        baseAngle={-10}
        className={styles.c3MagnetBg}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Same in-browser window as Card 1, with its own demo video */}
      <div className={styles.c1Frame} aria-hidden="true">
        <div className={styles.c1Window}>
          <BrowserBar dark />
          <div className={styles.c1WinBody}>
            <video
              className={styles.c1WinVideo}
              src="/videos/card3-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step text panels ──────────────────────────────────────────────
function StepOne() {
  return (
    <>
      <p className={styles.stepNum}>1.</p>
      <p className={styles.stepBody}>
        Scan. Capture. Done. <br />
       
        <p className={styles.stepDim}>Business card details are instantly extracted and prepared for seamless CRM synchronization.</p>
      </p>
    </>
  );
}

function StepTwo() {
  return (
    <>
      <p className={styles.stepNum}>2.</p>
      <p className={styles.stepBody}>
        <span className={styles.hiGreen}>Break Language Barriers</span><br />

        <p className={styles.stepDim}>Automatically recognize and translate contact information from multiple languages into your preferred language.</p>
      </p>
    </>
  );
}

function StepThree() {
  return (
    <>
      <p className={styles.stepNum}>3.</p>
      <p className={styles.stepBody}>
        Automate CRM Sync <br />
        <span className={styles.hiPurple}>Instantly</span>
      </p>
    </>
  );
}

const STEP_PANELS = [StepOne, StepTwo, StepThree];
const CARDS       = [Card1, Card2, Card3];

// ── Main component ────────────────────────────────────────────────
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const slotRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const ratioRef  = useRef<number[]>([0, 0, 0]);

  /* Below 768px the sticky-left/scrolling-right layout is swapped for
     stacked step+card pairs (see the mobile branch of the JSX below).
     The sticky column has no spare room to actually stay pinned once
     it's a single grid row on a short mobile viewport, which meant
     the step text scrolled out of view before cards 2–3 came into
     view — so each card gets its own text instead. isMobileRef lets
     the IntersectionObserver below skip work when those cardSlot
     refs never mount. Desktop/tablet (≥768px) are unchanged. */
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (isMobileRef.current) return;
        // Update stored ratios for changed entries, then pick the most visible
        entries.forEach((e) => {
          const idx = slotRefs.current.findIndex((r) => r === e.target);
          if (idx >= 0) ratioRef.current[idx] = e.intersectionRatio;
        });
        const best = ratioRef.current.indexOf(Math.max(...ratioRef.current));
        if (best >= 0) setActive(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    slotRefs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const StepPanel = STEP_PANELS[active];

  return (
    <section id="how-it-works" className={styles.section}>

      {/* ── Heading block ────────────────────────────────────── */}
      <div className={styles.headBlock}>
        <h2 className={styles.headText}>
          How <span className={styles.headHighlight}>NextIQ</span>
          <br />works?
        </h2>
      </div>

      {isMobile ? (
        /* ── Mobile (<768px): each card paired with its own step text,
           stacked in the same 1-2-3 order. Same Card components (same
           animations/videos), same StepOne/Two/Three text — just laid
           out as self-contained, horizontally centered blocks instead
           of a shared sticky panel. */
        <div className={styles.mobileSteps}>
          {CARDS.map((Card, i) => {
            const Panel = STEP_PANELS[i];
            return (
              <div key={i} className={styles.mobileStepBlock}>
                <div className={styles.mobileStepText}>
                  <Panel />
                </div>
                <div className={styles.mobileCardWrap}>
                  <Card />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Tablet/Desktop (≥768px): unchanged sticky steps grid ── */
        <div className={styles.stepsGrid}>

          {/* Left: sticky step info */}
          <div className={styles.leftCol}>
            <div key={active} className={styles.stepContent}>
              <StepPanel />
            </div>
          </div>

          {/* Right: scrolling card stack */}
          <div className={styles.rightCol}>
            {CARDS.map((Card, i) => (
              <div
                key={i}
                className={styles.cardSlot}
                ref={(el) => { slotRefs.current[i] = el; }}
              >
                <Card />
              </div>
            ))}
          </div>

        </div>
      )}
    </section>
  );
}
