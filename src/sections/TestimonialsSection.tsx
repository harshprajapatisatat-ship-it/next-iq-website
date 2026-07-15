"use client";

import styles from "./TestimonialsSection.module.css";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "kHETAN",
    // role: "Sales Director",
    quote:
      "Support bahut accha tha. Aapke jaise log aur team ho toh kaam aur bhi aasaan ho jata hai. Puri team ne har step par bahut accha support diya. Honestly, kisi bhi change ki zarurat nahi lagti. Sales team aur support team dono hi bahut achhi hain. Overall experience bahut badhiya raha.",
    initials: "K",
    color: "#09090b",
  },
  {
    name: "Priya Shah",
    // role: "Marketing Manager",
    quote:
      "We scan hundreds of business cards during exhibitions and every contact is automatically organized inside ERPNext.",
    initials: "PS",
    color: "#2563eb",
  },
  {
    name: "Wabsus",
    // role: "Business Development Head",
    quote:
      "We worked with Satat for HR module onboarding, including client portal setup, payroll management, advances, expense tracking, and compliance management. It was a great experience working with the Satat team on ERPNext implementation. Vraj was highly talented and provided excellent support throughout the project. The team took the time to understand our company's processes and requirements, ensuring the solution was aligned with our way of working. Overall, it was a smooth and positive experience.",
    initials: "W",
    color: "#059669",
  },
  {
    name: "Mehul Joshi",
    // role: "Operations Manager",
    quote:
      "The multilingual AI assistant saves hours every week and keeps our CRM perfectly updated.",
    initials: "MJ",
    color: "#dc2626",
  },
  {
    name: "HP Automation",
    // role: "Founder, GrowthLoop Agency",
    quote:
      "We have been using ERPNext for the last 8 years. While managing inventory, we faced several challenges and later expanded our usage to CRM, Buying, and HRMS modules. During this journey, we connected with Satat Technologies, and their domain expertise and service quality impressed us, leading to a successful collaboration. Satat has become a one-stop solution for our ERPNext needs. The team provides timely responses, handles queries efficiently, and consistently helps us find solutions to our business challenges. Their understanding of business processes and ERPNext has made our work significantly easier. The additional utilities and enhancements developed by Satat for ERPNext have also added great value to our operations. Overall satisfaction with ERPNext: 10/10 Overall satisfaction with Satat Technologies: 10/10.",
    initials: "HP",
    color: "#0ea5e9",
  },
  {
    name: "Vikram Rao",
    // role: "VP Sales",
    quote:
      "Our conversion rate from first call to demo jumped noticeably once every lead started arriving pre-qualified.",
    initials: "VR",
    color: "#3f3f46",
  },
  {
    name: "Neha Verma",
    // role: "Customer Success Lead",
    quote:
      "Support tickets about missing contacts dropped to zero after we switched to NextIQ's scanning workflow.",
    initials: "NV",
    color: "#65a30d",
  },
  {
    name: "Arjun Mehta",
    // role: "Regional Sales Manager",
    quote:
      "New hires are productive in days, not months — NextIQ hands them clean, ready-to-call leads from day one.",
    initials: "AM",
    color: "#d97706",
  },
  {
    name: "Devika Nair",
    // role: "Inside Sales Team Lead",
    quote:
      "Every trade show lead used to sit in someone's pocket for a week. Now it's in the CRM before the conversation even ends.",
    initials: "DN",
    color: "#be185d",
  },
];

const COLUMNS: Testimonial[][] = [
  [TESTIMONIALS[0], TESTIMONIALS[3], TESTIMONIALS[5]],
  [TESTIMONIALS[1], TESTIMONIALS[4], TESTIMONIALS[7]],
  [TESTIMONIALS[2], TESTIMONIALS[6], TESTIMONIALS[8]],
];

const COLUMN_DURATIONS = [34, 38, 30] as const;
const COLUMN_DELAYS = [0, -12, -22] as const;
const COLUMN_DIRECTIONS = ["up", "down", "up"] as const;

function Stars() {
  return (
    <div className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className={styles.card}>
      <Stars />
      <p className={styles.quote}>{t.quote}</p>
      <div className={styles.person}>
        <span className={styles.avatar} style={{ background: t.color }}>
          {t.initials}
        </span>
        <span className={styles.personText}>
          <span className={styles.personName}>{t.name}</span>
          <span className={styles.personRole}>{t.role}</span>
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.pill}>
            <span className={styles.pillDot} aria-hidden="true" />
            Reviews
          </div>
          <h2 className={styles.heading}>Sales Teams Love NextIQ</h2>
        </div>

        <button
          type="button"
          className={styles.ctaBtn}
          onClick={() => document.getElementById("book-demo")?.scrollIntoView({ behavior: "smooth" })}
        >
          Book a Demo Call
        </button>
      </div>

      <div className={styles.wall}>
        {COLUMNS.map((col, ci) => (
          <div className={styles.column} key={ci}>
            <div
              className={`${styles.track} ${COLUMN_DIRECTIONS[ci] === "down" ? styles.trackDown : styles.trackUp}`}
              style={{
                animationDuration: `${COLUMN_DURATIONS[ci]}s`,
                animationDelay: `${COLUMN_DELAYS[ci]}s`,
              }}
            >
              {[...col, ...col].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
