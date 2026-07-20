"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Zap, Users, ChevronDown, Search } from "lucide-react";
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

// Real flag image (SVG) for a 2-letter ISO country code.
function flagUrl(iso2: string) {
  return `https://flagcdn.com/${iso2.toLowerCase()}.svg`;
}

const COUNTRY_CODES: { code: string; dial: string; name: string }[] = [
  { code: "AF", dial: "+93", name: "Afghanistan" },
  { code: "AL", dial: "+355", name: "Albania" },
  { code: "DZ", dial: "+213", name: "Algeria" },
  { code: "AD", dial: "+376", name: "Andorra" },
  { code: "AO", dial: "+244", name: "Angola" },
  { code: "AG", dial: "+1268", name: "Antigua and Barbuda" },
  { code: "AR", dial: "+54", name: "Argentina" },
  { code: "AM", dial: "+374", name: "Armenia" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "AT", dial: "+43", name: "Austria" },
  { code: "AZ", dial: "+994", name: "Azerbaijan" },
  { code: "BS", dial: "+1242", name: "Bahamas" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "BB", dial: "+1246", name: "Barbados" },
  { code: "BY", dial: "+375", name: "Belarus" },
  { code: "BE", dial: "+32", name: "Belgium" },
  { code: "BZ", dial: "+501", name: "Belize" },
  { code: "BJ", dial: "+229", name: "Benin" },
  { code: "BT", dial: "+975", name: "Bhutan" },
  { code: "BO", dial: "+591", name: "Bolivia" },
  { code: "BA", dial: "+387", name: "Bosnia and Herzegovina" },
  { code: "BW", dial: "+267", name: "Botswana" },
  { code: "BR", dial: "+55", name: "Brazil" },
  { code: "BN", dial: "+673", name: "Brunei" },
  { code: "BG", dial: "+359", name: "Bulgaria" },
  { code: "BF", dial: "+226", name: "Burkina Faso" },
  { code: "BI", dial: "+257", name: "Burundi" },
  { code: "KH", dial: "+855", name: "Cambodia" },
  { code: "CM", dial: "+237", name: "Cameroon" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "CV", dial: "+238", name: "Cape Verde" },
  { code: "CF", dial: "+236", name: "Central African Republic" },
  { code: "TD", dial: "+235", name: "Chad" },
  { code: "CL", dial: "+56", name: "Chile" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "CO", dial: "+57", name: "Colombia" },
  { code: "KM", dial: "+269", name: "Comoros" },
  { code: "CG", dial: "+242", name: "Congo" },
  { code: "CD", dial: "+243", name: "Congo (DRC)" },
  { code: "CR", dial: "+506", name: "Costa Rica" },
  { code: "CI", dial: "+225", name: "Côte d'Ivoire" },
  { code: "HR", dial: "+385", name: "Croatia" },
  { code: "CU", dial: "+53", name: "Cuba" },
  { code: "CY", dial: "+357", name: "Cyprus" },
  { code: "CZ", dial: "+420", name: "Czechia" },
  { code: "DK", dial: "+45", name: "Denmark" },
  { code: "DJ", dial: "+253", name: "Djibouti" },
  { code: "DM", dial: "+1767", name: "Dominica" },
  { code: "DO", dial: "+1809", name: "Dominican Republic" },
  { code: "EC", dial: "+593", name: "Ecuador" },
  { code: "EG", dial: "+20", name: "Egypt" },
  { code: "SV", dial: "+503", name: "El Salvador" },
  { code: "GQ", dial: "+240", name: "Equatorial Guinea" },
  { code: "ER", dial: "+291", name: "Eritrea" },
  { code: "EE", dial: "+372", name: "Estonia" },
  { code: "SZ", dial: "+268", name: "Eswatini" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "FJ", dial: "+679", name: "Fiji" },
  { code: "FI", dial: "+358", name: "Finland" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "GA", dial: "+241", name: "Gabon" },
  { code: "GM", dial: "+220", name: "Gambia" },
  { code: "GE", dial: "+995", name: "Georgia" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "GR", dial: "+30", name: "Greece" },
  { code: "GD", dial: "+1473", name: "Grenada" },
  { code: "GT", dial: "+502", name: "Guatemala" },
  { code: "GN", dial: "+224", name: "Guinea" },
  { code: "GW", dial: "+245", name: "Guinea-Bissau" },
  { code: "GY", dial: "+592", name: "Guyana" },
  { code: "HT", dial: "+509", name: "Haiti" },
  { code: "HN", dial: "+504", name: "Honduras" },
  { code: "HK", dial: "+852", name: "Hong Kong" },
  { code: "HU", dial: "+36", name: "Hungary" },
  { code: "IS", dial: "+354", name: "Iceland" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "IR", dial: "+98", name: "Iran" },
  { code: "IQ", dial: "+964", name: "Iraq" },
  { code: "IE", dial: "+353", name: "Ireland" },
  { code: "IL", dial: "+972", name: "Israel" },
  { code: "IT", dial: "+39", name: "Italy" },
  { code: "JM", dial: "+1876", name: "Jamaica" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "JO", dial: "+962", name: "Jordan" },
  { code: "KZ", dial: "+7", name: "Kazakhstan" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "KI", dial: "+686", name: "Kiribati" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "KG", dial: "+996", name: "Kyrgyzstan" },
  { code: "LA", dial: "+856", name: "Laos" },
  { code: "LV", dial: "+371", name: "Latvia" },
  { code: "LB", dial: "+961", name: "Lebanon" },
  { code: "LS", dial: "+266", name: "Lesotho" },
  { code: "LR", dial: "+231", name: "Liberia" },
  { code: "LY", dial: "+218", name: "Libya" },
  { code: "LI", dial: "+423", name: "Liechtenstein" },
  { code: "LT", dial: "+370", name: "Lithuania" },
  { code: "LU", dial: "+352", name: "Luxembourg" },
  { code: "MO", dial: "+853", name: "Macau" },
  { code: "MG", dial: "+261", name: "Madagascar" },
  { code: "MW", dial: "+265", name: "Malawi" },
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "MV", dial: "+960", name: "Maldives" },
  { code: "ML", dial: "+223", name: "Mali" },
  { code: "MT", dial: "+356", name: "Malta" },
  { code: "MH", dial: "+692", name: "Marshall Islands" },
  { code: "MR", dial: "+222", name: "Mauritania" },
  { code: "MU", dial: "+230", name: "Mauritius" },
  { code: "MX", dial: "+52", name: "Mexico" },
  { code: "FM", dial: "+691", name: "Micronesia" },
  { code: "MD", dial: "+373", name: "Moldova" },
  { code: "MC", dial: "+377", name: "Monaco" },
  { code: "MN", dial: "+976", name: "Mongolia" },
  { code: "ME", dial: "+382", name: "Montenegro" },
  { code: "MA", dial: "+212", name: "Morocco" },
  { code: "MZ", dial: "+258", name: "Mozambique" },
  { code: "MM", dial: "+95", name: "Myanmar" },
  { code: "NA", dial: "+264", name: "Namibia" },
  { code: "NR", dial: "+674", name: "Nauru" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "NL", dial: "+31", name: "Netherlands" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "NI", dial: "+505", name: "Nicaragua" },
  { code: "NE", dial: "+227", name: "Niger" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "KP", dial: "+850", name: "North Korea" },
  { code: "MK", dial: "+389", name: "North Macedonia" },
  { code: "NO", dial: "+47", name: "Norway" },
  { code: "OM", dial: "+968", name: "Oman" },
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "PW", dial: "+680", name: "Palau" },
  { code: "PS", dial: "+970", name: "Palestine" },
  { code: "PA", dial: "+507", name: "Panama" },
  { code: "PG", dial: "+675", name: "Papua New Guinea" },
  { code: "PY", dial: "+595", name: "Paraguay" },
  { code: "PE", dial: "+51", name: "Peru" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "PL", dial: "+48", name: "Poland" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "RO", dial: "+40", name: "Romania" },
  { code: "RU", dial: "+7", name: "Russia" },
  { code: "RW", dial: "+250", name: "Rwanda" },
  { code: "KN", dial: "+1869", name: "Saint Kitts and Nevis" },
  { code: "LC", dial: "+1758", name: "Saint Lucia" },
  { code: "VC", dial: "+1784", name: "Saint Vincent and the Grenadines" },
  { code: "WS", dial: "+685", name: "Samoa" },
  { code: "SM", dial: "+378", name: "San Marino" },
  { code: "ST", dial: "+239", name: "São Tomé and Príncipe" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "SN", dial: "+221", name: "Senegal" },
  { code: "RS", dial: "+381", name: "Serbia" },
  { code: "SC", dial: "+248", name: "Seychelles" },
  { code: "SL", dial: "+232", name: "Sierra Leone" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "SK", dial: "+421", name: "Slovakia" },
  { code: "SI", dial: "+386", name: "Slovenia" },
  { code: "SB", dial: "+677", name: "Solomon Islands" },
  { code: "SO", dial: "+252", name: "Somalia" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "SS", dial: "+211", name: "South Sudan" },
  { code: "ES", dial: "+34", name: "Spain" },
  { code: "LK", dial: "+94", name: "Sri Lanka" },
  { code: "SD", dial: "+249", name: "Sudan" },
  { code: "SR", dial: "+597", name: "Suriname" },
  { code: "SE", dial: "+46", name: "Sweden" },
  { code: "CH", dial: "+41", name: "Switzerland" },
  { code: "SY", dial: "+963", name: "Syria" },
  { code: "TW", dial: "+886", name: "Taiwan" },
  { code: "TJ", dial: "+992", name: "Tajikistan" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "TH", dial: "+66", name: "Thailand" },
  { code: "TL", dial: "+670", name: "Timor-Leste" },
  { code: "TG", dial: "+228", name: "Togo" },
  { code: "TO", dial: "+676", name: "Tonga" },
  { code: "TT", dial: "+1868", name: "Trinidad and Tobago" },
  { code: "TN", dial: "+216", name: "Tunisia" },
  { code: "TR", dial: "+90", name: "Turkey" },
  { code: "TM", dial: "+993", name: "Turkmenistan" },
  { code: "TV", dial: "+688", name: "Tuvalu" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "UA", dial: "+380", name: "Ukraine" },
  { code: "AE", dial: "+971", name: "United Arab Emirates" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "UY", dial: "+598", name: "Uruguay" },
  { code: "UZ", dial: "+998", name: "Uzbekistan" },
  { code: "VU", dial: "+678", name: "Vanuatu" },
  { code: "VA", dial: "+379", name: "Vatican City" },
  { code: "VE", dial: "+58", name: "Venezuela" },
  { code: "VN", dial: "+84", name: "Vietnam" },
  { code: "YE", dial: "+967", name: "Yemen" },
  { code: "ZM", dial: "+260", name: "Zambia" },
  { code: "ZW", dial: "+263", name: "Zimbabwe" },
];

const DEFAULT_COUNTRY =
  COUNTRY_CODES.find((c) => c.code === "IN") ?? COUNTRY_CODES[0];

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

function CountryCodeSelect() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] =
    useState<(typeof COUNTRY_CODES)[number]>(DEFAULT_COUNTRY);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Reset the search and focus the input each time the menu opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      searchRef.current?.focus();
    }
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q)
      )
    : COUNTRY_CODES;

  return (
    <div className={styles.countrySelect} ref={ref}>
      <input type="hidden" name="countryCode" value={selected.dial} />
      <button
        type="button"
        className={styles.countryTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Country code"
        aria-expanded={open}
      >
        <span>{selected.dial}</span>
        <ChevronDown className={styles.countryChevron} />
      </button>

      {open && (
        <div className={styles.countryMenu}>
          <div className={styles.countrySearch}>
            <Search className={styles.countrySearchIcon} />
            <input
              ref={searchRef}
              type="text"
              className={styles.countrySearchInput}
              placeholder="Search country or code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className={styles.countryList} role="listbox">
            {filtered.length === 0 ? (
              <li className={styles.countryEmpty}>No countries found</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    className={`${styles.countryOption} ${
                      c.code === selected.code ? styles.countryOptionActive : ""
                    }`}
                    onClick={() => {
                      setSelected(c);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={c.code === selected.code}
                  >
                    <span className={styles.countryOptionLabel}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={styles.countryFlag}
                        src={flagUrl(c.code)}
                        alt=""
                        width={22}
                        height={16}
                        loading="lazy"
                      />
                      <span className={styles.countryOptionName}>{c.name}</span>
                    </span>
                    <span className={styles.countryOptionDial}>{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

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

        <div className={styles.mainGrid}>
          <div className={styles.formCard}>
            <div className={styles.formTag}>
              <span className={styles.tagDot} />
              Book a Demo
            </div>

            <h3 className={styles.formHeadline}>
              <span className={styles.headlineStrong}>30 mins</span> to automate
              your workflow.
            </h3>

            <form
              className={styles.form}
              onSubmit={async (e) => {
                e.preventDefault();

                const formElement = e.currentTarget;
                const form = new FormData(formElement);

                const payload = {
                  fullName: form.get("fullName"),
                  company: form.get("company"),
                  email: form.get("email"),
                  phone: `${form.get("countryCode") ?? ""} ${form.get("phone") ?? ""}`.trim(),
                  message: form.get("message"),
                };

                try {
                  const res = await fetch("/api/book-demo", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  const data = await res.json();

                  if (res.ok && data.success) {
                    formElement.reset();

                    Swal.fire({
                      icon: "success",
                      title: "You're All Set! 🚀",
                      text: "Thank you for reaching out to NextIQ. Your demo request has been submitted successfully. One of our product experts will contact you shortly to schedule your personalized demo.",
                      confirmButtonText: "Got it",
                      confirmButtonColor: "#16a34a",
                    });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: data.message || "Something went wrong.",
                      confirmButtonText: "OK",
                    });
                  }
                } catch (error) {
                  console.error(error);

                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Unable to submit the form.",
                    confirmButtonText: "OK",
                  });
                }
              }}
            >
                            <label className={styles.field}>
                <span className={styles.fieldLabel}>Full Name *</span>
                <input
                  className={styles.fieldInput}
                  name="fullName"
                  type="text"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Company name *</span>
                <input
                  className={styles.fieldInput}
                  name="company"
                  type="text"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email *</span>
                <input
                  className={styles.fieldInput}
                  name="email"
                  type="email"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone *</span>
                <div className={styles.phoneRow}>
                  <CountryCodeSelect />
                  <input
                    className={`${styles.fieldInput} ${styles.phoneInput}`}
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Message</span>
                <input
                  className={styles.fieldInput}
                  name="message"
                  type="text"
                />
              </label>

              <p className={styles.privacyText}>
                In order to provide you the content requested, we need to store
                and process your personal data. If you consent to us storing
                your personal data for this purpose, please tick the checkbox
                below.
              </p>

              <label className={styles.checkboxRow}>
                <input className={styles.checkbox} type="checkbox" required />
                <span>
                  I agree to the collection of my information in accordance with
                  the privacy policy and I consent to receive marketing email
                  from NextIQ. I understand that I can unsubscribe at any time.
                </span>
              </label>

              <button type="submit" className={styles.submitBtn}>
                Book Demo
              </button>
            </form>
          </div>

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