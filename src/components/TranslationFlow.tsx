'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/* ── Language pairs ───────────────────────────────────────────── */
const PAIRS = [
  { foreign: 'કેમ છો?',            english: 'How are you?',    lang: 'GU' },
  { foreign: 'नमस्ते',             english: 'Hello',            lang: 'HI' },
  { foreign: 'Buenos días',        english: 'Good morning',    lang: 'ES' },
  { foreign: 'Comment ça va?',     english: 'How are you?',    lang: 'FR' },
  { foreign: 'Wie geht es dir?',   english: 'How are you?',    lang: 'DE' },
  { foreign: 'こんにちは',          english: 'Hello',            lang: 'JA' },
  { foreign: 'مرحباً',            english: 'Hello',            lang: 'AR' },
];

const N           = PAIRS.length;
const LOOP_SECS   = 28;   // seconds for one full cycle
const EDGE_FRAC   = 0.08; // fraction of path to fade in / fade out
const XFADE_START = 0.43; // crossfade begins
const XFADE_END   = 0.57; // crossfade ends

export default function TranslationFlow() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const bgSvgRef   = useRef<SVGSVGElement>(null);
  const fgSvgRef   = useRef<SVGSVGElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const badgeRef   = useRef<SVGGElement>(null);

  useEffect(() => {
    const root   = rootRef.current;
    const bgSvg  = bgSvgRef.current;
    const fgSvg  = fgSvgRef.current;
    const pathEl = pathRef.current;
    const badge  = badgeRef.current;
    if (!root || !bgSvg || !fgSvg || !pathEl || !badge) return;

    /* ── Build S-curve geometry ─────────────────────────────── */
    const measure = () => {
      const W  = root.offsetWidth;
      const H  = root.offsetHeight;
      const CY = H / 2;
      const a  = H * 0.13; // vertical amplitude
      const d  =
        `M -220,${CY} ` +
        `C ${W * 0.2},${CY - a} ${W * 0.44},${CY + a} ${W * 0.5},${CY} ` +
        `C ${W * 0.56},${CY - a} ${W * 0.8},${CY + a} ${W + 220},${CY}`;
      pathEl.setAttribute('d', d);
      badge.setAttribute('transform', `translate(${W / 2},${CY})`);
      return pathEl.getTotalLength();
    };

    let totalLen = measure();

    /* ── Create phrase tokens ───────────────────────────────── */
    type Token = { wrap: HTMLDivElement; phrase: HTMLSpanElement; lang: HTMLSpanElement };
    const tokens: Token[] = [];

    for (let i = 0; i < N; i++) {
      const wrap = document.createElement('div');
      wrap.style.cssText = `
        position: absolute; top: 0; left: 0;
        pointer-events: none; user-select: none;
        white-space: nowrap; will-change: transform, opacity;
        text-align: center; transform-origin: center center;
        z-index: 2;
      `;

      const lang = document.createElement('span');
      lang.style.cssText = `
        display: block;
        color: rgba(168,85,247,0.75);
        font: 600 8.5px/1.6 system-ui, sans-serif;
        letter-spacing: 2px; text-transform: uppercase;
        margin-bottom: 4px;
      `;
      lang.textContent = PAIRS[i].lang;

      const phrase = document.createElement('span');
      phrase.style.cssText = `
        display: inline-block;
        font: 500 15px/1 system-ui, ui-sans-serif, sans-serif;
        padding: 8px 20px 9px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04);
        color: rgba(255,255,255,0.9);
        transition: color 0.1s linear, border-color 0.1s linear, background 0.1s linear;
      `;
      phrase.textContent = PAIRS[i].foreign;

      wrap.appendChild(lang);
      wrap.appendChild(phrase);
      // insertBefore fgSvg → tokens sit between bg path and fg badge
      root.insertBefore(wrap, fgSvg);
      tokens.push({ wrap, phrase, lang });
    }

    /* ── Ticker ─────────────────────────────────────────────── */
    let t0 = -1;

    const tick = (time: number) => {
      if (t0 < 0) t0 = time;
      const prog = ((time - t0) / LOOP_SECS) % 1;
      if (totalLen < 1) return;

      for (let i = 0; i < N; i++) {
        const { wrap, phrase } = tokens[i];
        const p = ((i / N) + prog) % 1;

        // Position along the S-curve
        const len  = p * totalLen;
        const pt   = pathEl.getPointAtLength(len);
        wrap.style.transform =
          `translate(${pt.x.toFixed(2)}px,${pt.y.toFixed(2)}px) translate(-50%,-50%)`;

        // Fade envelope at path edges
        const eIn  = Math.min(p / EDGE_FRAC, 1);
        const eOut = Math.min((1 - p) / EDGE_FRAC, 1);
        let   env  = Math.min(eIn, eOut);

        // Dip + crossfade near NEXTIQ badge (p ≈ 0.5)
        let showForeign: boolean;
        if (p >= XFADE_START && p <= XFADE_END) {
          const xT  = (p - XFADE_START) / (XFADE_END - XFADE_START); // 0→1
          const dip = 1 - Math.sin(xT * Math.PI) * 0.78;
          env *= dip;
          showForeign = xT < 0.5;
        } else {
          showForeign = p < 0.5;
        }

        wrap.style.opacity = env.toFixed(3);

        if (showForeign) {
          if (phrase.textContent !== PAIRS[i].foreign) phrase.textContent = PAIRS[i].foreign;
          phrase.style.color       = 'rgba(255,255,255,0.9)';
          phrase.style.borderColor = 'rgba(255,255,255,0.1)';
          phrase.style.background  = 'rgba(255,255,255,0.04)';
        } else {
          if (phrase.textContent !== PAIRS[i].english) phrase.textContent = PAIRS[i].english;
          phrase.style.color       = '#a3e635';
          phrase.style.borderColor = 'rgba(163,230,53,0.2)';
          phrase.style.background  = 'rgba(163,230,53,0.05)';
        }
      }
    };

    gsap.ticker.add(tick);

    const ro = new ResizeObserver(() => { totalLen = measure(); });
    ro.observe(root);

    return () => {
      gsap.ticker.remove(tick);
      tokens.forEach(({ wrap }) => wrap.remove());
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0 }}>

      {/* Background layer — dashed S-curve guide */}
      <svg
        ref={bgSvgRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible', zIndex: 1,
        }}
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="rgba(168,85,247,0.12)"
          strokeWidth="1.5"
          strokeDasharray="5 11"
        />
      </svg>

      {/* Foreground layer — NEXTIQ badge sits above phrase tokens */}
      <svg
        ref={fgSvgRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible', zIndex: 3,
        }}
      >
        <defs>
          <filter id="tf-badge-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Radial gradient to soften badge edges into black bg */}
          <radialGradient id="tf-badge-fade" cx="50%" cy="50%" r="50%">
            <stop offset="55%"  stopColor="#070012" stopOpacity="1" />
            <stop offset="100%" stopColor="#070012" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={badgeRef}>
          {/* Ambient glow rings */}
          <circle r="100" fill="rgba(168,85,247,0.025)" />
          <circle r="76"  fill="rgba(168,85,247,0.045)" />
          {/* Main disc */}
          <circle r="56"  fill="#070012" stroke="#a855f7" strokeWidth="1.5" filter="url(#tf-badge-glow)" />
          {/* Inner ring */}
          <circle r="48"  fill="none"   stroke="rgba(168,85,247,0.2)"  strokeWidth="0.5" />
          {/* Fade out ring to blend into black card */}
          <circle r="98"  fill="url(#tf-badge-fade)" />
          {/* Label */}
          <text
            textAnchor="middle" y="-8"
            fill="#c084fc" fontSize="9" fontWeight="700" letterSpacing="2.8"
            fontFamily="system-ui,ui-sans-serif,sans-serif"
          >NEXT</text>
          <text
            textAnchor="middle" y="12"
            fill="#ffffff" fontSize="14" fontWeight="800"
            fontFamily="system-ui,ui-sans-serif,sans-serif"
          >IQ</text>
        </g>
      </svg>
    </div>
  );
}
