"use client";

import { useRef } from "react";
import { ScanLine, RefreshCw } from "lucide-react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import styles from "./WhySection.module.css";

const CARDS = [
  {
    background: "#fde8d7",
    icon: ScanLine,
    iconColor: "#c4733d",
    heading: "Scan any business card, anywhere",
    body: "Point your camera at a card and get a clean, structured contact in seconds — no typing, no errors.",
  },
  {
    background: "#ece0fb",
    icon: RefreshCw,
    iconColor: "#7c3aed",
    heading: "Auto-synced straight to your CRM",
    body: "Every scanned contact flows directly into your CRM — no copy-paste, no double entry, no missed leads.",
  },
] as const;

export default function WhySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.innerWidth <= 800) return;

    gsap.to(track, {
      x: () => -(track.scrollWidth - section.offsetWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth - section.offsetWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  return (
    <div className={styles.wrap}>
      <section ref={sectionRef} className={styles.section}>
        <div ref={trackRef} className={styles.track}>
          <div className={`${styles.slide} ${styles.headingSlide}`}>
            <h2 className={styles.heading}>
              Why use
              <br />
              NextIQ?
            </h2>
          </div>

          {CARDS.map(({ background, icon: Icon, iconColor, heading, body }) => (
            <div key={heading} className={styles.slide} style={{ background }}>
              <div className={styles.iconWrap}>
                <Icon size={40} strokeWidth={1.5} color={iconColor} />
              </div>
              <h3 className={styles.cardHeading}>{heading}</h3>
              <p className={styles.cardBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
