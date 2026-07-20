"use client";

import { Zap, Users } from "lucide-react";
import styles from "./BookDemoSection.module.css";

const STEPS = [
  {
    num: "01",
    title: "Train AI",
    desc: "Upload business cards to train your AI.",
  },
  {
    num: "02",
    title: "Build Prompt",
    desc: "Create extraction prompts or use templates.",
  },
  {
    num: "03",
    title: "Review Results",
    desc: "Verify extracted contact information.",
  },
  {
    num: "04",
    title: "Sync to ERPNext",
    desc: "Automatically send contacts to ERPNext & CRM.",
  },
] as const;

const FEATURES = [
  {
    icon: Zap,
    title: "Fast onboarding.",
    desc: "Get started in minutes with zero technical setup.",
  },
  {
    icon: Users,
    title: "Built for teams.",
    desc: "Designed for sales teams, operations, and enterprise workflows.",
  },
] as const;

function StepDots({ filled }: { filled: number }) {
  return (
    <div className={styles.stepDots}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`${styles.dot} ${i < filled ? styles.dotActive : ""}`}
        />
      ))}
    </div>
  );
}

export default function BookDemoSection() {
  return (
    <section id="book-demo" className={styles.section}>
      <div className={styles.bgLayer} aria-hidden="true" />
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── Top step cards ─────────────────────────────────── */}
        <div className={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <div key={step.num} className={styles.stepCard}>
              <div className={styles.stepCardTop}>
                <StepDots filled={i + 1} />
                <span className={styles.stepNumber}>{step.num}</span>
              </div>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Main two-column content ───────────────────────── */}
        <div className={styles.mainGrid}>

          {/* Left — booking form card */}
          <div className={styles.formCard}>
            <div className={styles.formTag}>
              <span className={styles.tagDot} />
              Book a Demo
            </div>
            <h3 className={styles.formHeadline}>
              <span className={styles.headlineStrong}>30 mins</span> to automate your workflow.
            </h3>

            <form className={styles.form} onSubmit={async (e) => {
  e.preventDefault();

  const form = new FormData(e.currentTarget);

  const payload = {
    fullName: form.get("fullName"),
    company: form.get("company"),
    email: form.get("email"),
    phone: form.get("phone"),
    message: form.get("message"),
  };

  const res = await fetch("/api/book-demo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log(data);
}}>
              {/* <div className={styles.formRow}>
              </div> */}
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Full Name *</span>
                  <input className={styles.fieldInput} name="fullName" type="text" required />
                </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Company name *</span>
                <input className={styles.fieldInput} name="company" type="text" required />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email *</span>
                <input className={styles.fieldInput} name="email" type="email" required />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone</span>
                <input className={styles.fieldInput} name="" type="tel" />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Message</span>
                <input className={styles.fieldInput} name="message" type="text" />
              </label>

              <p className={styles.privacyText}>
                In order to provide you the content requested, we need to store and
                process your personal data. If you consent to us storing your
                personal data for this purpose, please tick the checkbox below.
              </p>

              <label className={styles.checkboxRow}>
                <input className={styles.checkbox} type="checkbox" />
                <span>
                  I agree to the collection of my information in accordance with
                  the privacy policy and I consent to receive marketing email from
                  NextIQ. I understand that I can unsubscribe at any time.
                </span>
              </label>

              <button type="submit" className={styles.submitBtn}>
                Book Demo
              </button>
            </form>
          </div>

          {/* Right — heading + supporting content */}
          <div className={styles.rightCol}>
            <h2 className={styles.talkHeading}>Let&apos;s talk.</h2>

            <p className={styles.talkParagraph}>
              Tell us about your business needs{" "}
              <span className={styles.talkDim}>
                and we&apos;ll show you how NextIQ automates contact capture, AI
                extraction, and ERPNext synchronization.
              </span>
            </p>

            <div className={styles.divider} />

            <div className={styles.featuresRow}>
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={styles.featureBlock}>
                  <div className={styles.featureHead}>
                    <Icon size={20} strokeWidth={1.5} />
                    <h5 className={styles.featureTitle}>{title}</h5>
                  </div>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
