'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanLine, Sparkles, Globe, RefreshCw, Lightbulb } from 'lucide-react';
import Carousel, { type CarouselItem } from './Carousel';
import styles from './Hero.module.css';

const HEADLINES = [
  'AI-Powered\nAutomation',
  'Simless \nAI Integration\nWith ERP',
  'Secure\nData Handling',
];

const HERO_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'Scan Cards',
    description: 'Capture any business card instantly.',
    icon: <ScanLine className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 2,
    title: 'AI Extraction',
    description: 'Structured contact data in seconds.',
    icon: <Sparkles className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 3,
    title: 'Multilingual',
    description: 'Works in any language, automatically.',
    icon: <Globe className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 4,
    title: 'Auto-Sync',
    description: 'Straight into your CRM or ERP.',
    icon: <RefreshCw className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 5,
    title: 'Smart Insights',
    description: 'Follow-up suggestions, instantly.',
    icon: <Lightbulb className="h-[16px] w-[16px] text-white" />,
  },
];

export default function Hero() {
  const heroRef        = useRef<HTMLElement>(null);
  const clipRef        = useRef<HTMLDivElement>(null);
  const fillRef        = useRef<HTMLDivElement>(null);
  const maskRef        = useRef<HTMLDivElement>(null);
  const footerOuterRef = useRef<HTMLDivElement>(null);
  const headlinesRef   = useRef<HTMLDivElement>(null);
  const headlineRefs   = useRef<(HTMLDivElement | null)[]>([]);

  /* Responsive carousel size — mirrors the .video breakpoints in Hero.module.css.
     Below 768px the pagination dots also move inline (below the description,
     inside the circle's own centered flex column) instead of the absolutely-
     positioned overlay desktop/tablet use — see Carousel's dotsInline prop. */
  const [carouselSize, setCarouselSize] = useState(494);
  const [dotsInline, setDotsInline] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 768) { setCarouselSize(256); setDotsInline(true); }  // ~28% larger than the original 200px on mobile
      else if (w < 1600) { setCarouselSize(395); setDotsInline(false); }
      else { setCarouselSize(494); setDotsInline(false); }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /* GSAP scroll animations */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const clip     = clipRef.current!;
      const fill     = fillRef.current!;
      const mask     = maskRef.current!;
      const footOuter = footerOuterRef.current!;
      const hls      = headlinesRef.current!;

      /* ── Circle-mask reveal (SendPotion: magicScroll / tlScroll) ── */
      /* Use hero.clientHeight (includes footer) so scale is large   */
      /* enough to cover all four clip corners — same as SendPotion  */
      /* which uses wrapRef.clientHeight (also includes footer).     */
      const hero = heroRef.current!;
      const computeScale = () => {
        const maskW = (gsap.getProperty(mask, 'width') as number) || 100;
        const mult  = window.innerWidth > 767 ? 1.5 : 1.2;
        return Math.max(
          hero.clientWidth  / maskW * mult,
          hero.clientHeight / maskW * mult,
        );
      };

      const revealTl = gsap.timeline();
      revealTl.fromTo(mask,
        { scale: 0.1 },
        /* Pass as function so invalidateOnRefresh re-evaluates on resize */
        { scale: () => computeScale(), duration: 0.6, ease: 'none', force3D: false },
        0,
      );
      revealTl.set(fill, { backgroundColor: '#1e2033' }, 0.7);
      revealTl.set(mask, { display: 'none' }, 0.7);
      revealTl.add(() => {}, 1);

      ScrollTrigger.create({
        animation: revealTl,
        trigger: clip,
        start: 'top top',
        end: () => 2 * window.innerHeight,
        scrub: window.innerWidth < 1024 ? 0.5 : 0.3,
        invalidateOnRefresh: true,
      });

      /* ── Headline animations (SendPotion: magicHeadline) ── */
      mm.add('(max-width: 1199px)', () => {
        headlineRefs.current.forEach((el, t) => {
          if (!el) return;
          const cfg: ScrollTrigger.Vars = {
            trigger: el,
            start: t === 0 ? 'top bottom' : t === 2 ? 'top bottom-=300' : 'top bottom-=200',
            toggleClass: { targets: el, className: styles.headlineActive },
          };
          /* First two headlines deactivate after passing; last stays on */
          if (t === 0) cfg.end = 'bottom+=200 bottom';
          if (t === 1) cfg.end = 'bottom+=300 bottom';
          ScrollTrigger.create(cfg);
        });
      });

      /* Desktop: CSS sticky + GSAP x-translate (avoids GSAP pin DOM conflict) */
      mm.add('(min-width: 1200px)', () => {
        /* SendPotion: tlHeadlineRoll — x: -2 * headlines.offsetWidth */
        const carouselTl = gsap.timeline();
        carouselTl.set(hls, { willChange: 'transform' }, 0);
        carouselTl.to(hls, {
          x: () => -2 * hls.offsetWidth,
          duration: 1,
          ease: 'none',
          invalidateOnRefresh: true,
        }, 0);

        /* Exact opacity timing from SendPotion's tlHeadlineRoll */
        const refs = headlineRefs.current;
        if (refs[0]) carouselTl.fromTo(refs[0], { opacity: 1 }, { opacity: 0.6, duration: 0.1, ease: 'none' }, 0.2);
        if (refs[1]) {
          carouselTl.fromTo(refs[1], { opacity: 0.6 }, { opacity: 1,   duration: 0.1, ease: 'none' }, 0.3);
          carouselTl.fromTo(refs[1], { opacity: 1   }, { opacity: 0.6, duration: 0.1, ease: 'none' }, 0.63);
        }
        if (refs[2]) carouselTl.fromTo(refs[2], { opacity: 0.6 }, { opacity: 1, duration: 0.1, ease: 'none' }, 0.75);
        carouselTl.set(hls, { willChange: 'auto' });

        ScrollTrigger.create({
          animation: carouselTl,
          trigger: footOuter,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.1,
          invalidateOnRefresh: true,
        });
      });

    }, heroRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <header ref={heroRef} className={styles.hero}>

      {/* ── Clip zone: overflow:hidden clips the mask circle ── */}
      <div ref={clipRef} className={styles.clip}>

        {/* Fill: #fafafa background with rounded bottom corners */}
        <div ref={fillRef} className={styles.fill} />

        {/* Masks wrapper: own overflow:hidden + border-radius for rounded reveal */}
        <div className={styles.masks}>
          <div ref={maskRef} className={styles.mask} />
        </div>

        {/* Content: head + body, scrolls naturally */}
        <div className={styles.content}>

          {/* Head: 100vh centred heading */}
          <div className={styles.head}>
            <div className={styles.container}>

              <div className={styles.header}>
                <h1>Don't collect cards,<br /><span className="font-extrabold">collect customers.</span></h1>
              </div>

              <p className={styles.subtext}>
                Scan business cards, enrich contact data with AI, and sync qualified leads directly into ERPNext in seconds.


              </p>

              <div className={styles.action}>
                <a href="#" className={styles.btn}>
                  <span className={styles.btnRipple} />
                  <span className={styles.btnRipple2} />
                  <span className={styles.btnInner}>
                    <em><span>Get a quote today</span></em>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
                {/* <a href="#" className={styles.btnSecondary}>Our services</a> */}
              </div>

            </div>
          </div>

          {/* Body: circular video preview */}
          <div className={styles.body}>
            <div className={styles.container}>
              <div className={styles.video}>
                <Carousel
                  items={HERO_CAROUSEL_ITEMS}
                  baseWidth={carouselSize}
                  autoplay
                  autoplayDelay={3000}
                  pauseOnHover={false}
                  loop
                  round
                  dotsInline={dotsInline}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer: OUTSIDE clip, so CSS sticky works ── */}
      {/* Desktop: 400vh tall outer → 300vh sticky pin  */}
      <div ref={footerOuterRef} className={styles.footerOuter}>
        <div className={styles.footer}>
          <div className={styles.container}>
            <div ref={headlinesRef} className={styles.headlines}>
              {HEADLINES.map((h, i) => (
                <div
                  key={h}
                  ref={(el) => { headlineRefs.current[i] = el; }}
                  className={styles.headline}
                >
                  <h2>
                    {h.split('\n').map((line, j) => (
                      <span key={j}>{j > 0 && <br />}{line}</span>
                    ))}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}
