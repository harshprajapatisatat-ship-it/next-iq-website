"use client";

import { useState } from "react";
import styles from "./FAQSection.module.css";

const FAQS = [
  {
    question: "What is NextIQ and how does it work?",
    answer:
      "NextIQ is an AI-powered tool that scans business cards with your phone camera and instantly turns them into clean, structured CRM contacts — no manual typing required.",
  },
  {
    question: "What is the difference between manual entry and AI-powered scanning in NextIQ?",
    answer:
      "Manual entry means typing out every contact by hand, which is slow and error-prone. NextIQ's AI scanning reads the card, extracts the name, title, and contact details automatically, and syncs them straight to your CRM in seconds.",
  },
  {
    question: "Is NextIQ easy to use?",
    answer:
      "Yes — just point your camera at a business card and NextIQ handles the rest. No setup, no training, and no learning curve.",
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.wrap}>
      <span className={`${styles.dot} ${styles.dotLeft}`} aria-hidden="true" />
      <span className={`${styles.dot} ${styles.dotRight}`} aria-hidden="true" />

      <h2 className={styles.heading}>
        <span className={styles.headingLine}>Frequently</span>
        <span className={styles.headingLine}>Asked</span>
        <span className={styles.headingLine}>Questions</span>
      </h2>

      <div className={styles.list}>
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.question} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className={styles.iconWrap} aria-hidden="true">
                  <span className={styles.bar1} />
                  <span className={styles.bar2} />
                </span>
                <span className={styles.question}>{faq.question}</span>
              </button>

              <div className={styles.answerWrap}>
                <div className={styles.answerInner}>
                  <p className={styles.answer}>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
