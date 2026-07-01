'use client';

// Loop/knot just left of chip (chip now at y=470). Knot crosses ~(150,400).
const CURVE1 =
  'M -100,250 C 30,290 80,460 160,420 C 230,380 270,280 210,240 C 155,200 70,330 130,440 C 155,490 190,482 212,470';

// Band exits chip, sweeps up-right and off the top of the card (far end at y=-550).
const CURVE2 =
  'M 360,468 C 600,400 470,50 900,500 C 640,-400 700,-490 750,-550';

const RAW_TEXT =
  "Umm, so at my last role I was kind of leading this project and, like, we had to build a new feature and I think we shipped it on time, mostly, but I'm not totally sure what the actual impact was... you know what I mean? " .repeat(6);

const CLEAN_TEXT =
  'I led a cross-functional team to design and ship a high-impact product feature on schedule, driving significant user engagement and measurable business growth. ' .repeat(7);

const WAVE_BARS = [3, 5, 9, 14, 20, 25, 30, 34, 30, 25, 34, 30, 25, 20, 14, 9, 5, 3];
const WAVE_CX = 300, WAVE_CY = 470;
const BAR_SPAN = (WAVE_BARS.length - 1) * 9 + 5.5;
const BAR_X0 = WAVE_CX - BAR_SPAN / 2;

export default function VoiceOrbit() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f0edd8', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <defs>
          <path id="vo-curve1" d={CURVE1} />
          <path id="vo-curve2" d={CURVE2} />
        </defs>

        {/* Raw speech — wavy path scrolling INTO the chip from the left */}
        <text
          fontSize="12.5"
          fontFamily="system-ui, ui-sans-serif, sans-serif"
          fontWeight="400"
          fill="rgba(26,26,26,0.40)"
        >
          <textPath href="#vo-curve1">{RAW_TEXT}</textPath>
          <animate
            attributeName="x"
            values="-2400;0"
            dur="35s"
            repeatCount="indefinite"
          />
        </text>

        {/* Black band — thick stroke emerging from the chip to the right */}
        <path d={CURVE2} fill="none" stroke="#1a1a1a" strokeWidth="52" strokeLinecap="round" />

        {/* Clean speech — bold white marquee on the band */}
        <text
          fontSize="13"
          fontFamily="system-ui, ui-sans-serif, sans-serif"
          fontWeight="600"
          fill="#fff"
        >
          <textPath href="#vo-curve2">{CLEAN_TEXT}</textPath>
          <animate
            attributeName="x"
            values="-2000;0"
            dur="50s"
            repeatCount="indefinite"
          />
        </text>

        {/* Audio waveform pill — clean sharp border, no halo */}
        <rect
          x={WAVE_CX - 88} y={WAVE_CY - 24}
          width="176" height="48"
          rx="24"
          fill="#fff" stroke="#1a1a1a" strokeWidth="3"
        />
        {WAVE_BARS.map((h, i) => (
          <rect
            key={i}
            x={BAR_X0 + i * 9}
            y={WAVE_CY - h / 2}
            width="5.5"
            height={h}
            rx="2.75"
            fill="#1a1a1a"
          >
            <animate
              attributeName="height"
              values={`${h};${Math.max(2, Math.round(h * 0.2))};${h}`}
              dur="1.1s"
              begin={`${(i * 0.055).toFixed(3)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${WAVE_CY - h / 2};${WAVE_CY - Math.max(1, Math.round(h * 0.1))};${WAVE_CY - h / 2}`}
              dur="1.1s"
              begin={`${(i * 0.055).toFixed(3)}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
}
