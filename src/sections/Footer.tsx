"use client";

import TextPressure from "@/components/TextPressure";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Our Products", href: "#our-products" },
  { label: "Features", href: "#features" },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.addressCol}>
          <p className={styles.tagline}>
            Building the AI layer
            <br />
            for modern sales teams.
          </p>

          <div className={styles.pills}>
            <a href="mailto:hello@nextiq.app" className={styles.pill}>
              <span className={styles.pillDot} aria-hidden="true" />
              hello@nextiq.app
            </a>
            <a href="#contact" className={styles.pill}>
              Get In Touch
            </a>
          </div>
        </div>

        <nav className={styles.navCol}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.wordmark}>
        <TextPressure
          text="nextiq"
          flex
          alpha={false}
          stroke={false}
          width
          weight
          italic={false}
          textColor="#ffffff"
          strokeColor="#7c3aed"
          minFontSize={64}
          weightRange={[600, 300]}
          widthRange={[80, 70]}
        />
      </div>

      <p className={styles.copyright}>© 2026 NextIQ. All rights reserved.</p>
    </footer>
  );
}
