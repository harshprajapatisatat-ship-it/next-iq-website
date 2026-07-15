'use client';

import { useRef, useEffect } from 'react';

// Static composition — zero animation, zero GSAP
// Path traced from wisprflow.ai reference screenshot

const PHRASES = [
  'Apeksha sathe vaato karvaani chhe ...',
  'Kal ki meeting kaisi rahi thi ...',
  'Necesito terminar el informe hoy ...',
  'Pouvez-vous vérifier les notes ...',
  'Die Präsentation ist fertig ...',
  'Kaigi no junbi ga dekimashita ...',
  "Hal yumkinuka muraja'at al-taqrir ...",
];

// Phrase positions across path sections:
//   0-22%  sweep        → 4, 14   (text inverted, going right-to-left)
//   22-70% CCW loop     → 34, 46, 58
//   70-87% diagonal     → 76
//   87-100% exit        → 92
const STATIC_OFFSETS = [4, 14, 34, 46, 58, 76, 92];

// r=175, center=(55,153), k=97
// 12-o'clock: (55,-22)    → clips at card top
// 9-o'clock:  (-120,153)  → past left edge (phrase trails off-screen like reference)
// 3-o'clock:  (230,153)   → crossing, 33.8% from left
// 6-o'clock:  (55,328)    → 50.5% from top
// Node at 87% of path    → approx (391,458), 57.5% from left, 70.5% from top
const PATH_D = [
  'M 680,100',
  'C 510,90  330,110 265,120',
  'C 248,127 237,138 230,153',
  'C 230,56  152,-22  55,-22',
  'C -42,-22 -120,56  -120,153',
  'C -120,250 -42,328  55,328',
  'C 152,328 230,250  230,153',
  'C 258,195 312,378  370,442',
  'C 382,452 388,455  391,458',
  'C 470,456 600,454  680,454',
].join(' ');

const NODE_FRAC = 0.87;

export default function TranslationFlow() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const pathEl = svg.querySelector('#tf2-path') as SVGPathElement;
    const nodeEl = svg.querySelector('#tf2-node') as SVGGElement;
    if (!pathEl || !nodeEl) return;
    const len = pathEl.getTotalLength();
    const pt = pathEl.getPointAtLength(len * NODE_FRAC);
    nodeEl.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 680 650"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <defs>
          <path id="tf2-path" d={PATH_D} />

          <filter id="tf2-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="tf2-blend" cx="50%" cy="50%" r="50%">
            <stop offset="50%"  stopColor="#000" stopOpacity="1" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Purple dashed guide path */}
        <use
          href="#tf2-path"
          fill="none"
          stroke="rgba(253,207,0,0.25)"
          strokeWidth="1.5"
          strokeDasharray="5 10"
        />

        {/* Text flowing along path */}
        {PHRASES.map((phrase, i) => (
          <text
            key={i}
            fontSize="13"
            fontFamily="system-ui, ui-sans-serif, sans-serif"
            fontWeight="500"
            fill="rgba(255,255,255,0.82)"
          >
            <textPath href="#tf2-path" startOffset={`${STATIC_OFFSETS[i]}%`}>
              {'  ' + phrase + '  '}
            </textPath>
          </text>
        ))}

        {/* NEXTIQ node — positioned via useEffect */}
        <g id="tf2-node">
          <circle r="90" fill="rgba(253,207,0,0.05)" />
          <circle r="68" fill="rgba(253,207,0,0.08)" />
          <circle r="54" fill="none" stroke="#3f3f46" strokeWidth="1" opacity="0.45" />
          <circle r="50" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" filter="url(#tf2-glow)" />
          <circle r="42" fill="none" stroke="rgba(253,207,0,0.35)" strokeWidth="0.5" />
          <circle r="88" fill="url(#tf2-blend)" />
          <text
            textAnchor="middle" y="-8"
            fill="#71717a" fontSize="8.5" fontWeight="700" letterSpacing="2.6"
            fontFamily="system-ui,ui-sans-serif,sans-serif"
          >NEXT</text>
          <text
            textAnchor="middle" y="13"
            fill="#ffffff" fontSize="14" fontWeight="800"
            fontFamily="system-ui,ui-sans-serif,sans-serif"
          >IQ</text>
        </g>
      </svg>
    </div>
  );
}
