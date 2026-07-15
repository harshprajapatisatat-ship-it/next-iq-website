"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ScanLine, Bot } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   SVG icons
───────────────────────────────────────────────────────────── */

function StarIcon({ id }: { id: string }) {
  const filterId = `ticker-star-filter-${id}`;
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <g filter={`url(#${filterId})`}>
        <path d="M5.44591 9.26754C4.39059 10.3229 2.67959 10.3229 1.62427 9.26754L0.202621 7.8459C-0.0675402 7.57574 -0.0675402 7.13772 0.202621 6.86756L1.62427 5.44591C2.67959 4.39059 4.39059 4.39059 5.44591 5.44591L7.35673 7.35673L5.44591 9.26754Z" fill="#18181b" />
        <path d="M5.44591 13.0892C4.39059 12.0339 4.39059 10.3229 5.44591 9.26754L7.35673 7.35673L9.26754 9.26754C10.3229 10.3229 10.3229 12.0339 9.26754 13.0892L7.35673 15L5.44591 13.0892Z" fill="#18181b" />
        <path d="M5.44591 5.44591C4.39059 4.39059 4.39059 2.67959 5.44591 1.62427L6.86756 0.202621C7.13772 -0.0675402 7.57573 -0.0675402 7.84589 0.202621L9.26754 1.62427C10.3229 2.67959 10.3229 4.39059 9.26754 5.44591L7.35673 7.35673L5.44591 5.44591Z" fill="#18181b" />
        <path d="M13.0892 9.26754C12.0339 10.3229 10.3229 10.3229 9.26754 9.26754L7.35673 7.35673L9.26754 5.44591C10.3229 4.39059 12.0339 4.39059 13.0892 5.44591L15 7.35672L13.0892 9.26754Z" fill="#18181b" />
      </g>
      <defs>
        <filter id={filterId} x="0" y="0" width="15" height="15" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
      </defs>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* Desktop: removed. Mobile menu chevron — 16×16, stroke-1.5, opacity-40 */
function MobileChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-40 shrink-0">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* × close icon for open mobile menu */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Announcement bar content
───────────────────────────────────────────────────────────── */

function NewBadge() {
  return (
    <span className="px-2 py-0.5 border rounded-full font-matter font-semibold text-[10px] leading-none shrink-0 bg-[#18181b1a] border-[#18181b33] text-[#18181b]">
      NEW
    </span>
  );
}

function AnnouncementLink() {
  return (
    <a
      href="/introducing-erpnext-automation"
      className="flex items-center gap-1.5 font-matter font-medium text-[#18181b] hover:text-[#52525b] text-[14px] tracking-wide whitespace-nowrap transition-colors"
    >
      Nexiq introduces ERPNext Automation for modern businesses
      <ArrowRightIcon />
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   CTA buttons
───────────────────────────────────────────────────────────── */

function LogInButton({ size = "base" }: { size?: "base" | "sm" }) {
  const sizeClasses = size === "sm"
    ? "min-h-[44px] px-5 py-3 text-[15px]"
    : "min-h-[44px] px-6 py-3 text-base";

  return (
    <a href="/dashboard" target="_blank" rel="noopener noreferrer">
      <button
        className={`group relative inline-flex items-center justify-center cursor-pointer font-matter font-medium overflow-hidden rounded-full touch-manipulation text-white hover:brightness-125 active:scale-[0.97] active:duration-150 transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)] w-fit text-nowrap ${sizeClasses}`}
        style={{ background: "linear-gradient(to bottom, #27272a 0%, #09090b 100%)" }}
      >
        <span className="relative z-10 flex items-center gap-2">Log in</span>
      </button>
    </a>
  );
}

function ContactUsButton({ size = "base" }: { size?: "base" | "sm" }) {
  const sizeClasses = size === "sm"
    ? "min-h-[44px] px-5 py-3 text-[15px]"
    : "min-h-[44px] px-6 py-3 text-base";

  return (
    <button
      onClick={() => document.getElementById("book-demo")?.scrollIntoView({ behavior: "smooth" })}
      className={`group relative inline-flex items-center justify-center cursor-pointer font-matter font-medium rounded-full touch-manipulation overflow-hidden text-[#09090b] active:scale-[0.97] active:duration-150 transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)] w-fit text-nowrap ${sizeClasses}`}
      style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #f4f4f5 100%)",
        boxShadow: "inset 0 0 0 1px rgba(30,32,51,0.14)",
      }}
    >
      <span className="relative z-10 flex items-center gap-2">Contact Us</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Platform mega menu
───────────────────────────────────────────────────────────── */

const PLATFORM_PRODUCTS = [
  {
    icon: ScanLine,
    iconColor: "text-[#09090b]",
    label: "Nexiq Scan",
    description: "Scan business visiting cards and instantly create ERPNext leads.",
    href: "/platform/scan",
  },
  {
    icon: Bot,
    iconColor: "text-[#15803d]",
    label: "Nexiq Assist",
    description: "Resolve support tickets using AI and automate responses.",
    href: "/platform/assist",
  },
] as const;

function PlatformMegaMenu({ onMouseEnter }: { onMouseEnter: () => void }) {
  return (
    <motion.div
      className="hidden lg:block w-full overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={onMouseEnter}
    >
      <div className="border-t border-[#e4e4e7] px-10 pt-12 pb-14 w-full">
        {/* 3-column grid: products span-1, hero span-2 → ~35/65 proportions */}
        <div className="grid grid-cols-3 gap-10 mx-auto max-w-5xl">

          {/* ── Left column: Products (Se "simple" type) ──────── */}
          <div className="flex flex-col gap-8">
            <h4 className="font-matter font-medium text-[#18181b] text-xs uppercase leading-snug tracking-[0.5px]">
              Products
            </h4>
            <div className="flex flex-col gap-5">
              {PLATFORM_PRODUCTS.map((product) => {
                const Icon = product.icon;
                return (
                  <a
                    key={product.href}
                    href={product.href}
                    className="group flex items-start gap-4 hover:bg-[#f4f4f5] -m-1 p-1 rounded-xl transition-all duration-200"
                  >
                    {/* Icon container — white box with light border */}
                    <div className="flex justify-center items-center bg-white border border-[#e4e4e7]/50 rounded-lg w-[44px] h-[44px] transition-all duration-200 shrink-0">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className={`${product.iconColor} transition-colors duration-200`}
                      />
                    </div>
                    {/* Label + subtitle */}
                    <div className="flex flex-col gap-0.5 min-w-0 mt-[3px]">
                      <h5 className="font-matter font-medium text-[16px] text-[#52525b] group-hover:text-[#18181b] leading-[1.3] transition-colors duration-200">
                        {product.label}
                      </h5>
                      <p className="font-matter text-[#71717a] text-[13px] leading-snug">
                        {product.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Right column: Hero preview card — col-span-2 for 65% width ── */}
          <a
            href="/platform"
            className="col-span-2 group block bg-[#fafafa] border border-[#e4e4e7] p-1.5 rounded-2xl h-fit overflow-hidden"
          >
            <div className="flex flex-row bg-white rounded-xl overflow-hidden">
              {/* Visual panel — flex-1 so it grows to fill ~50% of the 670px card */}
              <div className="relative flex flex-col justify-center items-center rounded-lg flex-1 min-h-[200px] overflow-hidden">
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,1) 0.38%, rgba(254,228,208,1) 100%)" }}
                />
                {/* Decorative dashboard preview elements */}
                <div className="relative z-10 w-full px-3 flex flex-col gap-2">
                  <div className="h-[6px] w-14 rounded-full bg-[#e4e4e7]/80" />
                  <div className="h-[6px] w-10 rounded-full bg-[#e4e4e7]/60" />
                  <div className="mt-2 h-7 w-full rounded-md bg-white/70 border border-[#e4e4e7]/50" />
                  <div className="h-7 w-full rounded-md bg-white/70 border border-[#e4e4e7]/50" />
                  <div className="h-7 w-full rounded-md bg-white/70 border border-[#e4e4e7]/50" />
                </div>
              </div>
              {/* Text content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-col justify-between gap-2.5 h-full">
                  <h3 className="font-matter font-medium text-[18px] text-[#18181b]">
                    Nexiq Platform
                  </h3>
                  <p className="font-matter text-[14px] text-[#71717a]">
                    AI-powered business automation for ERPNext. Scan visiting cards, create leads, enrich contacts, and resolve support tickets from a single platform.
                  </p>
                </div>
              </div>
            </div>
          </a>

        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Products" },
  { label: "Our Clients", sectionId: "our-clients" },
  { label: "Featurs", sectionId: "how-it-works" },
  { label: "FAQ", sectionId: "faq" },
] as const;

/* Mobile-menu-only submenu shown under "Products" — see the
   mobileProductsOpen expand/collapse in the mobile nav below. */
const MOBILE_PRODUCT_ITEMS = [
  { label: "NextIQ", href: "#nextiq" },
  { label: "ERPNext", href: "#erpnext" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) setMobileProductsOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="top-0 right-0 left-0 fixed w-full" style={{ zIndex: 10000 }}>

      {/* ── Announcement banner ────────────────────────────────
          Collapses from h-8 (32px) to 0 when page is scrolled.
          Exact classes + inline styles from the live source.   */}
      
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: scrolled ? 0 : 32 }}
      >
        <div
          className="relative flex justify-center items-center h-8 overflow-hidden"
          style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          {/* Desktop: star · badge · link · star — gap-8 between items,
              badge carries -mr-6 to close the gap to the link text     */}
          <div className="relative z-10 hidden lg:flex items-center gap-8">
            <StarIcon id="d1" />
            <span className="-mr-6"><NewBadge /></span>
            <AnnouncementLink />
            <StarIcon id="d2" />
          </div>

          {/* Mobile: infinite marquee ticker */}
          <div className="relative z-10 flex lg:hidden items-center w-full overflow-hidden">
            <div className="animate-ticker-marquee flex items-center min-w-max">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4">
                  <StarIcon id={`m${i}a`} />
                  <a href="/announcing-series-b" className="flex items-center gap-1.5 ml-3">
                    <NewBadge />
                    <span className="font-matter font-medium text-[14px] tracking-wide whitespace-nowrap text-[#18181b]">
                      Nexiq introduces ERPNext Automation for modern businesses
                    </span>
                    <ArrowRightIcon />
                  </a>
                  <StarIcon id={`m${i}b`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Gradient fade strip ────────────────────────────────
          Exact from source: fafafa→transparent, side-masked.
          Appears behind the pill when announcement collapses.  */}
      <div
        className="absolute top-0 left-0 right-0 h-8 lg:h-10 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: scrolled ? 1 : 0,
          // background: "linear-gradient(to bottom, #fafafa 40%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      />

      {/* ── Outer positioning shell ────────────────────────────
          max-w-[1400px], px-2 pt-2 / lg:px-8 lg:pt-3          */}
      <div className="relative mx-auto w-full max-w-[1400px] px-2 pt-2 lg:px-8 lg:pt-3">

        {/* ── Pill container ──────────────────────────────────
            rounded-[34px], frosted glass, exact inline styles  */}
        <div
          data-menu-open={menuOpen}
          className="rounded-[34px] overflow-hidden"
          style={{
            backgroundColor: activeMenu || menuOpen ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.55)",
            border: `1px solid rgba(220, 220, 220, ${activeMenu || menuOpen ? 0.8 : 0.4})`,
            backdropFilter: activeMenu || menuOpen ? "none" : "blur(24px) saturate(1.3) brightness(1.04)",
            WebkitBackdropFilter: activeMenu || menuOpen ? "none" : "blur(24px) saturate(1.3) brightness(1.04)",
            boxShadow: `0 2px 24px rgba(0,0,0,${activeMenu || menuOpen ? 0.08 : 0.02}), inset 0 1px 3px rgba(0,0,0,0.04)`,
            transition: "background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, box-shadow 0.4s ease",
          }}
          onMouseLeave={() => { if (!menuOpen) setActiveMenu(null); }}
        >

          {/* ── Desktop nav ──────────────────────────────────
              py-2.5 pr-2.5 pl-9 exactly from source           */}
          <nav className="hidden lg:flex items-center py-2.5 pr-2.5 pl-9 w-full">
            {/* Three-column flex: logo(flex-1) | links(flex-[2]) | ctas(flex-1) */}
            <div className="flex flex-1 items-center justify-between w-full">

              {/* Logo — h-4.5 = 18px, exact from source */}
              <a href="/" className="flex flex-1 items-center gap-2 transition-opacity ">
                {/* <Image
                  src="NEXTIQ.png"
                  alt="Nexiq"
                  width={202}
                  height={32}
                  className="w-auto h-[18px]"
                  priority
                  unoptimized
                /> */}
              <h1
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "34px",
                  fontWeight: 400,
                  // lineHeight: 0.95,
                  letterSpacing: "0.03em",
                }}
              >
                NEXTiQ
              </h1>
              </a>

              {/* Nav links — centered, gap-4, flex-[2] */}
              <div className="flex flex-[2] justify-center items-center gap-4">
                {NAV_ITEMS.map((item) => {
                  const menuKey = item.label.toLowerCase();
                  const isActive = activeMenu === menuKey;
                  const sectionId = "sectionId" in item ? item.sectionId : undefined;
                  return (
                    <button
                      key={item.label}
                      onMouseEnter={() => setActiveMenu(menuKey === "products" ? "products" : null)}
                      onClick={() => {
                        if (sectionId) {
                          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${isActive ? "bg-black/5" : "hover:bg-black/5"}`}
                    >
                      <span className="font-matter font-medium text-xs uppercase tracking-[1px] text-black">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CTAs — both always visible on desktop, grouped right */}
              <div className="flex flex-1 justify-end items-center gap-3">
                <LogInButton />
                <ContactUsButton />
              </div>

            </div>
          </nav>

          {/* ── Desktop mega menu ───────────────────────────── */}
          <AnimatePresence initial={false}>
            {activeMenu === "products" && (
              <PlatformMegaMenu
                key="products-menu"
                onMouseEnter={() => setActiveMenu("products")}
              />
            )}
          </AnimatePresence>

          {/* ── Mobile nav ─────────────────────────────────── */}
          <div className="lg:hidden flex flex-col">

            {/* Top row — two states */}
            {menuOpen ? (
              /* Open: Logo (left) | Log in pill (center) | × (right) */
              <div className="grid grid-cols-[150fr_auto_1fr] items-center pl-5 pr-4 py-[10px]">
                <a href="/" className="flex items-center">
                  <Image
                    src="NEXTIQ.png"
                    alt="Nexiq"
                    width={202}
                    height={32}
                    className="w-auto h-4"
                    priority
                    unoptimized
                  />
                </a>

                {/* Small outlined Log in pill, centered */}
                {/* <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                  <button
                    className="font-matter font-medium text-[#09090b] text-[13px] px-[14px] py-[7px] rounded-full transition-all duration-200 active:scale-[0.97]"
                    style={{
                      background: "linear-gradient(to bottom, #ffffff 0%, #f4f4f5 100%)",
                      boxShadow: "inset 0 0 0 1px rgba(30,32,51,0.14)",
                    }}
                  >
                    Log in
                  </button>
                </a> */}

                {/* × close */}
                <div className="flex justify-end">
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors focus:outline-none text-[#18181b]"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            ) : (
              /* Closed: Logo | scroll-triggered Contact Us | Hamburger */
              <div className="flex justify-between items-center pl-5 pr-4 py-2">
                <a href="/" className="relative flex items-center gap-2">
                  <Image
                    src="NEXTIQ.png"
                    alt="Nexiq"
                    width={202}
                    height={32}
                    className="w-auto h-4"
                    priority
                    unoptimized
                  />
                </a>

                <div className="flex items-center gap-3">
                  <div className={`transition-opacity duration-150 ${scrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <ContactUsButton size="sm" />
                  </div>

                  {/* Hamburger */}
                  <button
                    className="flex flex-col justify-center items-center focus:outline-none w-7 h-7 gap-0"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen(true)}
                  >
                    <span className="w-[18px] h-[1.5px] bg-black block" />
                    <span className="w-[18px] h-[1.5px] bg-black block mt-[3px]" />
                    <span className="w-[18px] h-[1.5px] bg-black block mt-[3px]" />
                  </button>
                </div>
              </div>
            )}

            {/* Expandable menu content — max-height transition */}
            <div
              className="overflow-hidden"
              style={{
                maxHeight: menuOpen ? 600 : 0,
                transition: "max-height 0.4s cubic-bezier(0.2,0,0,1)",
              }}
            >
              {/* Nav items with dividers */}
              <div className="pt-1">
                {NAV_ITEMS.map((item) => {
                  const isProducts = item.label === "Products";
                  const sectionId = "sectionId" in item ? item.sectionId : undefined;
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          if (isProducts) {
                            setMobileProductsOpen((v) => !v);
                            return;
                          }
                          if (sectionId) {
                            setMenuOpen(false);
                            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="flex w-full items-center justify-between px-6 py-[18px] hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left"
                      >
                        <span className="font-matter font-medium text-xs uppercase tracking-[1px] text-[#18181b]">
                          {item.label}
                        </span>
                        {isProducts && <MobileChevronIcon />}
                      </button>

                      {isProducts && (
                        <div
                          className="overflow-hidden"
                          style={{
                            maxHeight: mobileProductsOpen ? 200 : 0,
                            transition: "max-height 0.4s cubic-bezier(0.2,0,0,1)",
                          }}
                        >
                          <div className="pb-2">
                            {MOBILE_PRODUCT_ITEMS.map((product) => (
                              <a
                                key={product.label}
                                href={product.href}
                                onClick={() => setMenuOpen(false)}
                                className="block px-6 py-3 pl-10 font-matter font-medium text-[13px] text-[#52525b] hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors"
                              >
                                {product.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="h-px bg-black/[0.06]" />
                    </div>
                  );
                })}
              </div>

              {/* Full-width CTA buttons stacked */}
              <div className="px-4 pt-6 pb-5 flex flex-col gap-3">
                <a href="/dashboard" target="_blank" rel="noopener noreferrer" className="w-full">
                  <button
                    className="w-full font-matter font-medium text-white py-4 rounded-[24px] text-base transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]"
                    style={{ background: "linear-gradient(to bottom, #27272a 0%, #09090b 100%)" }}
                  >
                    Log in
                  </button>
                </a>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById("book-demo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full font-matter font-medium text-[#09090b] py-4 rounded-[24px] text-base transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(to bottom, #ffffff 0%, #f4f4f5 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(30,32,51,0.14)",
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Desktop backdrop ─────────────────────────────────
          Covers page content below navbar when mega menu is open.
          z-index: -1 places it behind the pill (in header's stacking context)
          but above page content (header is z-index: 10000).            */}
      <AnimatePresence>
        {activeMenu && !menuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block fixed inset-0 bg-black/30 backdrop-blur-sm"
            style={{ zIndex: -1 }}
            onMouseEnter={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

    </header>
  );
}
