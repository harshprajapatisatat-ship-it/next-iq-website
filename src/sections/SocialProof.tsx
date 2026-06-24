'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './SocialProof.module.css';
import PhysicsPills from './PhysicsPills';

// ─── Word bubbles ─────────────────────────────────────────────
interface Bubble { text: string; bg: string; fg: string; flipped?: boolean }

const ROW1: Bubble[] = [
  { text: 'Incredible',    bg: '#d1fae5', fg: '#1f1f1f' },
  { text: 'Insane',        bg: '#ddd6fe', fg: '#1f1f1f' },
  { text: 'Whoa',          bg: '#fef3c7', fg: '#1f1f1f' },
  { text: 'Fantastic',     bg: '#fed7aa', fg: '#1f1f1f', flipped: true },
  { text: 'Super!',        bg: '#d1fae5', fg: '#1f1f1f', flipped: true },
  { text: 'Amazing!',      bg: '#ede9fe', fg: '#1f1f1f', flipped: true },
  { text: 'my superpower', bg: '#fce7f3', fg: '#1f1f1f' },
  { text: 'mind-blowing',  bg: '#f0fdf4', fg: '#1f1f1f' },
];

const ROW2: Bubble[] = [
  { text: 'mind-blowingly', bg: '#f1f5f9', fg: '#1f1f1f' },
  { text: 'Perfect!',       bg: '#ede9fe', fg: '#1f1f1f' },
  { text: 'Awesome!',       bg: '#1e2033', fg: '#ffffff' },
  { text: 'Next-level',     bg: '#fef9c3', fg: '#1f1f1f', flipped: true },
  { text: 'Unreal',         bg: '#ffedd5', fg: '#1f1f1f' },
  { text: 'CRAZY X2N',      bg: '#dcfce7', fg: '#1f1f1f', flipped: true },
  { text: 'Unbelievable',   bg: '#e0f2fe', fg: '#1f1f1f' },
  { text: 'No way!',        bg: '#fdf2f8', fg: '#1f1f1f' },
];

// ─── Testimonials ─────────────────────────────────────────────
interface Testimonial {
  id: number; initials: string; avatarBg: string;
  quote: string; link: string; name: string; role: string; logoEl: React.ReactNode;
}

function MeridianLogo() {
  return (
    <svg height="28" viewBox="0 0 110 28" fill="none" aria-hidden="true">
      <rect x="0" y="6" width="16" height="16" rx="3" fill="#1e3a8a"/>
      <text x="22" y="20" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#1e3a8a" letterSpacing="-0.3">Meridian</text>
    </svg>
  );
}
function BuildForwardLogo() {
  return (
    <svg height="28" viewBox="0 0 150 28" fill="none" aria-hidden="true">
      <polygon points="0,22 9,6 18,22" fill="#0284c7"/>
      <text x="24" y="20" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#0369a1" letterSpacing="-0.3">BuildForward</text>
    </svg>
  );
}
function CascadeLogo() {
  return (
    <svg height="28" viewBox="0 0 100 28" fill="none" aria-hidden="true">
      <rect x="0" y="4" width="5" height="20" rx="2.5" fill="#059669"/>
      <rect x="7" y="8" width="5" height="16" rx="2.5" fill="#059669"/>
      <rect x="14" y="12" width="5" height="12" rx="2.5" fill="#059669"/>
      <text x="25" y="20" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="600" fill="#065f46" letterSpacing="-0.3">Cascade</text>
    </svg>
  );
}
function ArtisanLogo() {
  return (
    <svg height="28" viewBox="0 0 100 28" fill="none" aria-hidden="true">
      <path d="M9 6L17 22H1L9 6Z" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
      <text x="22" y="20" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="600" fill="#4c1d95" letterSpacing="-0.3">Artisan</text>
    </svg>
  );
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1, initials: 'PK', avatarBg: '#4f46e5',
    quote: 'Nexiq completely transformed how our sales team captures leads. Our pipeline grew by 340% in just two months — ERPNext automation is now our unfair advantage.',
    link: '#', name: 'Priya Kapoor', role: 'VP of Sales, Meridian Distributors',
    logoEl: <MeridianLogo />,
  },
  {
    id: 2, initials: 'RN', avatarBg: '#0891b2',
    quote: 'We automated our entire CRM enrichment workflow with Nexiq. Support tickets that used to take 3 days now resolve in under 2 hours. It genuinely changed how we operate.',
    link: '#', name: 'Rohan Nair', role: 'COO, BuildForward Technologies',
    logoEl: <BuildForwardLogo />,
  },
  {
    id: 3, initials: 'AM', avatarBg: '#059669',
    quote: 'The ERPNext integration is flawless. Nexiq handles our inventory triggers, supplier notifications, and purchase order workflows — all without writing a line of code.',
    link: '#', name: 'Aditi Mehta', role: 'Operations Director, Cascade Manufact.',
    logoEl: <CascadeLogo />,
  },
  {
    id: 4, initials: 'TH', avatarBg: '#7c3aed',
    quote: 'Setting up customer support automation took 30 minutes. Chatbots, ticket routing, and SLA tracking all live in ERPNext via Nexiq. Our CSAT jumped from 72% to 94%.',
    link: '#', name: 'Tarun Hegde', role: 'Head of Customer Success, Artisan Labs',
    logoEl: <ArtisanLogo />,
  },
];

// ─── Logo strip ───────────────────────────────────────────────
interface LogoDef { name: string; color: string; accent: string }
const LOGOS: LogoDef[] = [
  { name: 'Meridian',     color: '#1e3a8a', accent: '#2563eb' },
  { name: 'BuildForward', color: '#0369a1', accent: '#0ea5e9' },
  { name: 'Cascade',      color: '#065f46', accent: '#059669' },
  { name: 'Artisan',      color: '#4c1d95', accent: '#7c3aed' },
  { name: 'Vertex',       color: '#1f2937', accent: '#374151' },
  { name: 'Nomad',        color: '#991b1b', accent: '#dc2626' },
  { name: 'Stratum',      color: '#374151', accent: '#6b7280' },
  { name: 'Pinnacle',     color: '#3f6212', accent: '#65a30d' },
];

// ─── Avatar stack component ───────────────────────────────────
function AvatarStack() {
  const avatars = [
    { initials: 'PK', bg: '#4f46e5' },
    { initials: 'RN', bg: '#c4733d' },
    { initials: 'AM', bg: '#059669' },
  ];
  return (
    <span className={styles.avatarStack} aria-hidden="true">
      {avatars.map((a, i) => (
        <span key={i} className={styles.avatar} style={{ background: a.bg, zIndex: 3 - i }}>
          {a.initials}
        </span>
      ))}
    </span>
  );
}

// ─── Bubble pill ──────────────────────────────────────────────
function Pill({ bubble }: { bubble: Bubble }) {
  return (
    <span
      className={styles.pill}
      style={{
        background: bubble.bg,
        color: bubble.fg,
        transform: bubble.flipped ? 'rotate(180deg)' : undefined,
      }}
    >
      {bubble.text}
    </span>
  );
}

// ─── Logo strip item ──────────────────────────────────────────
function LogoItem({ logo }: { logo: LogoDef }) {
  return (
    <span className={styles.logoItem}>
      <svg height="32" viewBox="0 0 180 32" fill="none" aria-label={logo.name}>
        <circle cx="14" cy="16" r="10" fill={logo.accent} opacity="0.15"/>
        <circle cx="14" cy="16" r="6"  fill={logo.accent}/>
        <text x="30" y="21" fontFamily="system-ui,sans-serif" fontSize="16" fontWeight="700" fill={logo.color} letterSpacing="-0.3">
          {logo.name}
        </text>
      </svg>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function SocialProof() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const maxIdx = total - 3; // 3 visible at a time on desktop

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx(i => Math.min(maxIdx, i + 1)), [maxIdx]);

  return (
    <section className={styles.section}>

      {/* ── Physics pill drop — triggered on scroll into view ── */}
      <PhysicsPills />

      {/* ── Heading ──────────────────────────────────────────── */}
      <div className={styles.headWrap}>
        <h2 className={styles.heading}>
          Trusted by 13,000+<br />
          businesses <AvatarStack />
        </h2>
      </div>

      {/* ── Word bubble marquee ───────────────────────────────── */}
      <div className={styles.bubblesOuter}>
        {/* Row 1: left */}
        <div className={styles.bubblesRow}>
          <div className={`${styles.bubblesTrack} ${styles.trackLeft}`}>
            {[...ROW1, ...ROW1].map((b, i) => <Pill key={i} bubble={b} />)}
          </div>
        </div>
        {/* Row 2: right (reverse) */}
        <div className={styles.bubblesRow}>
          <div className={`${styles.bubblesTrack} ${styles.trackRight}`}>
            {[...ROW2, ...ROW2].map((b, i) => <Pill key={i} bubble={b} />)}
          </div>
        </div>
      </div>

      {/* ── Testimonial carousel ─────────────────────────────── */}
      <div className={styles.carouselSection}>
        <div className={styles.carouselViewport}>
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(calc(-${idx} * (100% / 3 + 16px / 3)))` }}
          >
            {TESTIMONIALS.map(t => (
              <article key={t.id} className={styles.card}>
                {/* Avatar */}
                <div
                  className={styles.cardAvatar}
                  style={{ background: t.avatarBg }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                {/* Quote */}
                <p className={styles.cardQuote}>{t.quote}</p>
                {/* Link */}
                <a href={t.link} className={styles.cardLink}>Read case study here</a>
                {/* Attribution */}
                <p className={styles.cardAttrib}>
                  <strong>{t.name}</strong>, {t.role}
                </p>
                {/* Company logo */}
                <div className={styles.cardLogo}>{t.logoEl}</div>
              </article>
            ))}
          </div>
        </div>

        {/* Prev / Next */}
        <div className={styles.navRow}>
          <button
            className={styles.navBtn}
            onClick={prev}
            disabled={idx === 0}
            aria-label="Previous testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span className={styles.navDot} aria-hidden="true" />

          <button
            className={styles.navBtn}
            onClick={next}
            disabled={idx >= maxIdx}
            aria-label="Next testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Logo strip ────────────────────────────────────────── */}
      <div className={styles.logosOuter}>
        <div className={styles.logosTrack}>
          {[...LOGOS, ...LOGOS].map((logo, i) => <LogoItem key={i} logo={logo} />)}
        </div>
      </div>

    </section>
  );
}
