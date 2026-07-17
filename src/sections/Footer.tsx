"use client";
import { useEffect, useState } from "react";
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
/* Only Contact is linked — it scrolls to the booking form in
   BookDemoSection. The rest are plain text until those pages exist. */
const LEGAL_ITEMS = ["Privacy", "Terms", "Cookies"] as const;

export default function Footer() {
  /* Matches the 640px breakpoint in Footer.module.css. The curved input sizes
     itself from its measured width, so at phone widths its default 16px text
     and 64px height leave too little room between the icon chip and the
     button — the placeholder gets clipped. Step the geometry down instead. */
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const update = () => setIsPhone(window.innerWidth <= 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.bgWordWrap} aria-hidden="true">
        <span className={styles.bgWord}>NextIQ</span>
      </div>

      <div className={styles.curvedInputWrap}>
        {/* Colors are pinned to the site palette (zinc scale + white CTA)
            rather than the component's default purple "dark" theme. */}
        <CurvedInput
          placeholder="Enter your email"
          buttonText="Book a Demo"
          theme="dark"
          bend={isPhone ? 18 : 28}
          height={isPhone ? 54 : 64}
          fontSize={isPhone ? 13 : 16}
          width={450}
          backgroundColor="#18181b"
          textColor="#fafafa"
          placeholderColor="#a1a1aa"
          borderColor="#27272a"
          buttonColor="#fafafa"
          buttonTextColor="#09090b"
          iconColor="#3f3f46"
          shadowColor="#000000"
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
          {LEGAL_ITEMS.map((label) => (
            <span key={label} className={styles.legalItem}>
              <span className={styles.legalText}>{label}</span>
              <span className={styles.legalSep}>•</span>
            </span>
          ))}
          <span className={styles.legalItem}>
            <a
              href="#book-demo"
              className={styles.legalLink}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("book-demo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </a>
          </span>
        </div>

        <span className={styles.copyright}>Copyright © 2026 NextIQ</span>
      </div>
    </footer>
  );
}
