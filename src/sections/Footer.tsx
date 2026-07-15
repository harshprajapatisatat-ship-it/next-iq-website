"use client";
import styles from "./Footer.module.css";
import CurvedInput from "@/components/CurvedInput";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
const LEGAL_LINKS = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Cookies", href: "#cookies" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bgWordWrap} aria-hidden="true">
        <span className={styles.bgWord}>NextIQ</span>
      </div>

      <div className={styles.curvedInputWrap}>
        <CurvedInput
          placeholder="Enter your email"
          buttonText="Book a Demo"
          theme="dark"
          bend={28}
          height={64}
          width={450}
          onSubmit={() => document.getElementById("book-demo")?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      <div className={styles.hero}>
        <div className={styles.globeGlow} aria-hidden="true" />
        <div className={styles.globe} aria-hidden="true">
          <div className={styles.globeDots} />
          <div className={styles.globeRingH} />
          <div className={styles.globeRingV} />
        </div>

        <div className={styles.content}>
          <div className={styles.pill}>
            <span aria-hidden="true">✨</span>
            AI Powered Business Automation
          </div>

          <h2 className={styles.heading}>
            Your <span className={styles.italic}>smarter</span> AI-powered
            <br />
            <span className={styles.headingDim}>Business Assistant</span>
          </h2>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.socials}>
          <a href="#" aria-label="Instagram" className={styles.socialLink}>
             <InstagramIcon />
          </a>
          <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
            <LinkedinIcon />
         </a>
        </div>

        <div className={styles.legalRow}>
          {LEGAL_LINKS.map(({ label, href }, i) => (
            <span key={label} className={styles.legalItem}>
              <a href={href} className={styles.legalLink}>{label}</a>
              {i < LEGAL_LINKS.length - 1 && <span className={styles.legalSep}>•</span>}
            </span>
          ))}
        </div>

        <span className={styles.copyright}>Copyright © 2026 NextIQ</span>
      </div>
    </footer>
  );
}
