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
  {
    question: "How long does it take to get started?",
    answer:
      "Minutes, with zero technical setup — there's no integration project and no IT ticket. You upload a few cards to train your AI, pick a ready-made extraction prompt or build your own, and you're scanning.",
  },
  {
    question: "Does NextIQ work with my CRM or ERPNext?",
    answer:
      "NextIQ is built for ERPNext and syncs scanned cards straight in as leads. Other CRM and ERPNext destinations go through the same sync step — book a demo and we'll confirm the fit for your setup.",
  },
  {
    question: "Which languages can NextIQ read?",
    answer:
      "NextIQ recognizes cards in multiple languages automatically — you never have to tell it which one you're scanning. It extracts the details as printed and translates them into your preferred language before they reach your CRM.",
  },
  {
    question: "What happens if the AI reads a card incorrectly?",
    answer:
      "Every scan goes through a review step, so you can check and correct the extracted details before they're sent on to your CRM. Errors get caught while they're still cheap to fix — not after they're in your pipeline.",
  },
  {
    question: "Can my whole team use NextIQ?",
    answer:
      "Yes — NextIQ is designed for sales teams, operations, and wider enterprise workflows. Contacts captured by anyone in the field land in the same CRM the rest of the team already works from.",
  },
  {
    question: "What is NextIQ Assist?",
    answer:
      "Assist is our next product: it resolves support tickets using AI and automates responses. It isn't live yet — book a demo and we'll keep you posted as it ships.",
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={styles.wrap}>
      <span className={`${styles.dot} ${styles.dotLeft}`} aria-hidden="true" />
      <span className={`${styles.dot} ${styles.dotRight}`} aria-hidden="true" />

      <h2 className={styles.heading}>
        <span className={styles.headingLine}>Frequently Asked</span>
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
