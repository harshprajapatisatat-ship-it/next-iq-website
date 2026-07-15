import styles from './CtaSection.module.css';

// ── 3D-style illustration: phone scanning a business card → CRM contact ──
function ScanIllustration() {
  return (
    <div className={styles.illoWrap} aria-hidden="true">
      <div className={styles.illoFloat}>
        <div className={styles.shadow} />

        <div className={styles.phone}>
          <div className={styles.phoneNotch} />
          <div className={styles.phoneScreen}>
            <span className={`${styles.corner} ${styles.cornerTl}`} />
            <span className={`${styles.corner} ${styles.cornerTr}`} />
            <span className={`${styles.corner} ${styles.cornerBl}`} />
            <span className={`${styles.corner} ${styles.cornerBr}`} />
            <div className={styles.scanBeam} />

            <div className={styles.miniCard}>
              <div className={styles.miniCardTop}>
                <span className={styles.miniCardLogo} />
                <span className={styles.miniCardWordmark}>NextIQ</span>
              </div>

              <span className={styles.miniCardName}>Alexa Morgan</span>
              <span className={styles.miniCardTitle}>Product Designer</span>

              <div className={styles.miniCardDivider} />

              <span className={styles.miniCardContact}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="4.5" width="20" height="15" rx="2.5" stroke="currentColor" strokeWidth="2.4" />
                  <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                alexa@nimbuslabs.io
              </span>
              <span className={styles.miniCardContact}>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 4h3.5l1.5 5-2.3 1.6a11 11 0 0 0 5.7 5.7L14.5 14l5 1.5V19a2 2 0 0 1-2.2 2C10.6 20.4 4.6 14.4 3 7.7A2 2 0 0 1 5 4Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
                +1 415 555 0192
              </span>
            </div>
          </div>
          <div className={styles.phoneHomeBar} />
        </div>

        <div className={styles.crmChip}>
          <span className={styles.crmChipCheck}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5l5 5L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <div className={styles.crmChipTitle}>Contact added</div>
            <div className={styles.crmChipSub}>Synced to CRM</div>
          </div>
        </div>

        <span className={`${styles.dot} ${styles.dot1}`} />
        <span className={`${styles.dot} ${styles.dot2}`} />
        <span className={`${styles.dot} ${styles.dot3}`} />
      </div>
    </div>
  );
}

export default function CtaSection() {
  return (
    <section className={styles.wrap}>
      <div className={styles.box}>
        <div className={styles.textCol}>
          <h2 className={styles.heading}>
            <span className={styles.line}>Turn Business Cards</span>
            <span className={styles.line}>into <span className={styles.highlight}>CRM Contacts</span></span>
            <span className={styles.line}>Instantly.</span>
          </h2>

          <a className={styles.button} href="#">
            Try NextIQ Free <span aria-hidden="true">→</span>
          </a>
        </div>

        <ScanIllustration />
      </div>
    </section>
  );
}
