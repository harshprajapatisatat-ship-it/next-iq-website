'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HowItWorks.module.css';
import DotField from '@/components/DotField';
import TranslationFlow from '@/components/TranslationFlow';

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

function NxMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
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

// ── Card 1 — live DotField ────────────────────────────────────────
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
    </div>
  );
}

// ── Card 2 — live translation flow ───────────────────────────────
function Card2() {
  return (
    <div className={styles.card2}>
      <TranslationFlow />
    </div>
  );
}

// ── Card 3 — lavender, bracket pattern, "Generate" UI ────────────
function Card3() {
  return (
    <div className={styles.card3}>
      <div className={styles.card3Inner}>
        <BrowserBar />
        <div className={styles.c3Body}>
          <div className={styles.c3TopBar}>
            <NxMark />
          </div>
          <div className={styles.c3Grid}>
            {Array.from({ length: 6 }).map((_, i) => {
              const hues = ['#3b0764','#4c1d95','#312e81','#1e3a5f','#3b0764','#312e81'];
              return (
                <div key={i} className={styles.c3Thumb}>
                  <svg viewBox="0 0 100 72" fill="none" className={styles.c3ThumbSvg}>
                    <rect width="100" height="72" fill={hues[i]} />
                    {/* Background blur suggestion */}
                    <rect x="20" y="10" width="60" height="40" rx="4" fill="rgba(255,255,255,0.05)" />
                    {/* Head */}
                    <ellipse cx="50" cy="28" rx="14" ry="16" fill="#f5d0a9" />
                    {/* Shoulders */}
                    <ellipse cx="50" cy="62" rx="26" ry="18" fill="#e8c99a" />
                    {/* Hair */}
                    <ellipse cx="50" cy="18" rx="14" ry="10" fill="#5c3317" />
                    {/* Shirt */}
                    <rect x="32" y="52" width="36" height="20" rx="4" fill="#f0f0f0" />
                  </svg>
                </div>
              );
            })}
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
        Train <span className={styles.recDot} aria-hidden="true" /><br />
        your AI<br />
        <span className={styles.stepDim}>(Takes 5 mins)</span>
      </p>
    </>
  );
}

function StepTwo() {
  return (
    <>
      <p className={styles.stepNum}>2.</p>
      <p className={styles.stepBody}>
        <span className={styles.hiGreen}>Build your prompt</span><br />
        or choose a<br />
        template
      </p>
    </>
  );
}

function StepThree() {
  return (
    <>
      <p className={styles.stepNum}>3.</p>
      <p className={styles.stepBody}>
        Get answers ✨<br />
        in your own<br />
        <span className={styles.hiPurple}>unique style</span>
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

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
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
    <section className={styles.section}>

      {/* ── Heading block ────────────────────────────────────── */}
      <div className={styles.headBlock}>
        <h2 className={styles.headText}>
          How <span className={styles.headHighlight}>NextIQ</span>
          <br />works
        </h2>
      </div>

      {/* ── Steps grid ───────────────────────────────────────── */}
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
    </section>
  );
}
