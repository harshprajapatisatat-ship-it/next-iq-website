import styles from './TrustedBy.module.css';

/* Inline SVG helpers for small brand icons */
function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="2.25" fill="currentColor" />
    </svg>
  );
}

function TriangleIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
      <path d="M6.5 1L12 11H1L6.5 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <path d="M6 1L11 7L6 13L1 7L6 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PeakIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M1 11L5.5 3L8 7L10.5 4L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="4.5" height="4.5" rx="0.75" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="1" width="4.5" height="4.5" rx="0.75" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="7.5" width="4.5" height="4.5" rx="0.75" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="0.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface LogoDef {
  name: string;
  icon: React.ReactNode | null;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
}

const LOGOS: LogoDef[] = [
  { name: 'helios',   icon: <CircleIcon />,   fontSize: 17, fontWeight: 700, letterSpacing: '-0.04em' },
  { name: 'CASCADE',  icon: null,             fontSize: 12, fontWeight: 500, letterSpacing: '0.08em'  },
  { name: 'Vertex',   icon: <TriangleIcon />, fontSize: 18, fontWeight: 800, letterSpacing: '-0.05em' },
  { name: 'Meridian', icon: null,             fontSize: 16, fontWeight: 400, letterSpacing: '-0.02em' },
  { name: 'Artisan',  icon: <DiamondIcon />,  fontSize: 15, fontWeight: 600, letterSpacing: '-0.03em' },
  { name: 'NOMAD',    icon: null,             fontSize: 16, fontWeight: 900, letterSpacing: '-0.06em' },
  { name: 'Pinnacle', icon: <PeakIcon />,     fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' },
  { name: 'stratum',  icon: <GridIcon />,     fontSize: 13, fontWeight: 300, letterSpacing: '0.10em'  },
];

function LogoSlide({ logo }: { logo: LogoDef }) {
  return (
    <div className={styles.logoItem}>
      {logo.icon && (
        <span className={styles.logoIcon} aria-hidden="true">
          {logo.icon}
        </span>
      )}
      <span
        className={styles.logoLabel}
        style={{
          fontSize: logo.fontSize,
          fontWeight: logo.fontWeight,
          letterSpacing: logo.letterSpacing,
        }}
      >
        {logo.name}
      </span>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className={styles.section}>

      <div className={styles.inner}>
        <h2 className={styles.heading}>Trusted by 13,000+ businesses</h2>
        <p className={styles.subheading}>
          Teams use Nexiq to automate lead capture, CRM enrichment, support operations, and ERPNext workflows.
        </p>
      </div>

      <div className={styles.marqueeOuter}>
        <div className={styles.marqueeTrack}>
          {/* First set */}
          {LOGOS.map((logo, i) => (
            <LogoSlide key={`a-${i}`} logo={logo} />
          ))}
          {/* Duplicate for seamless loop */}
          {LOGOS.map((logo, i) => (
            <LogoSlide key={`b-${i}`} logo={logo} />
          ))}
        </div>
      </div>

    </section>
  );
}
