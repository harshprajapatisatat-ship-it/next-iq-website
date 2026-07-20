'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanLine, Sparkles, Globe, RefreshCw, Lightbulb } from 'lucide-react';
import Carousel, { type CarouselItem } from './Carousel';
import SpecularButton from './SpecularButton';
import styles from './Hero.module.css';

// Rotating second headline line — cycles through phrases, revealing each
// character with a staggered upward roll (clipped by overflow-hidden).
const ROTATING_PHRASES = [
  'collect customers.',
  'collect deals.',
  'collect growth.',
  'collect relationships.',
];

function RotatingHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_PHRASES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const phrase = ROTATING_PHRASES[index];

  return (
    <span
      className="font-extrabold"
      style={{
        display: 'inline-flex',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        paddingBottom: '0.1em',
      }}
    >
      <AnimatePresence mode="wait">
        <span key={index} style={{ display: 'inline-flex' }}>
          {phrase.split('').map((ch, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-110%' }}
              transition={{ duration: 0.5, delay: i * 0.028, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </span>
      </AnimatePresence>
    </span>
  );
}

const HEADLINES = [
  'AI-Powered\nAutomation',
  'Seamless \nAI Integration\nWith ERPNext',
  'Secure\nData Handling',
];

const HERO_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'Scan Cards',
    description: 'Capture any business card instantly.',
    icon: <ScanLine className="h-[24px] w-[24px] text-white" />,
  },
  {
    id: 2,
    title: 'AI Extraction',
    description: 'Structured contact data in seconds.',
    icon: <Sparkles className="h-[24px] w-[24px] text-white" />,
  },
  {
    id: 3,
    title: 'Multilingual',
    description: 'Works in any language, automatically.',
    icon: <Globe className="h-[24px] w-[24px] text-white" />,
  },
  {
    id: 4,
    title: 'Auto-Sync',
    description: 'Straight into your CRM or ERPNext.',
    icon: <RefreshCw className="h-[24px] w-[24px] text-white" />,
  },
  {
    id: 5,
    title: 'Smart Insights',
    description: 'Follow-up suggestions, instantly.',
    icon: <Lightbulb className="h-[24px] w-[24px] text-white" />,
  },
];

export default function Hero() {
  const heroRef        = useRef<HTMLElement>(null);
  const clipRef        = useRef<HTMLDivElement>(null);
  const fillRef        = useRef<HTMLDivElement>(null);
  const maskRef        = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLDivElement>(null);
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

      /* ── Circle-mask reveal — crisp vector clip-path circle ──────────
         Instead of scaling a small raster div up ~30× (which the GPU
         rasterises once at ~100px then stretches, giving jagged, "cheap"
         edges), the mask now fills the whole clip zone and we animate a
         `clip-path: circle()` whose radius is driven by a CSS variable.
         clip-path is re-evaluated per frame, so the edge stays perfectly
         smooth at every size. The circle is centred on the carousel and
         grows until it covers the farthest corner. */
      const videoEl = videoRef.current!;

      const centreOf = () => {
        const c = clip.getBoundingClientRect();
        const v = videoEl.getBoundingClientRect();
        return {
          cx: v.left + v.width  / 2 - c.left,
          cy: v.top  + v.height / 2 - c.top,
          w : c.width,
          h : c.height,
        };
      };
      const applyCentre = () => {
        const { cx, cy } = centreOf();
        gsap.set(mask, { '--cx': `${cx}px`, '--cy': `${cy}px` });
      };
      const computeMaxR = () => {
        const { cx, cy, w, h } = centreOf();
        const dx = Math.max(cx, w - cx);
        const dy = Math.max(cy, h - cy);
        return Math.hypot(dx, dy) * 1.08;
      };

      const revealTl = gsap.timeline();
      revealTl.fromTo(mask,
        { '--r': '0px' },
        /* Function value so invalidateOnRefresh re-measures on resize */
        { '--r': () => `${computeMaxR()}px`, duration: 0.6, ease: 'none' },
        0,
      );
      revealTl.set(fill, { backgroundColor: '#09090b' }, 0.7);
      revealTl.set(mask, { display: 'none' }, 0.7);
      revealTl.add(() => {}, 1);

      ScrollTrigger.create({
        animation: revealTl,
        trigger: clip,
        start: 'top top',
        end: () => 2 * window.innerHeight,
        scrub: window.innerWidth < 1024 ? 0.5 : 0.3,
        invalidateOnRefresh: true,
        onRefresh: applyCentre,
      });
      applyCentre();

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
                <h1>Don't collect cards,<br /><RotatingHeadline /></h1>
              </div>

              <p className={styles.subtext}>
                Scan business cards, enrich contact data with AI, and sync qualified leads directly into ERPNext in seconds.


              </p>

              <div className={styles.action}>
                <SpecularButton
                  size="lg"
                  className="origin-center duration-300 ease-out hover:-rotate-6 hover:translate-y-[3px]"
                  radius={999}
                  tint="#111111"
                  tintOpacity={1}
                  blur={0}
                  textColor="#f5f5f5"
                  lineColor="#ffffff"
                  baseColor="#525252"
                  intensity={1}
                  shineSize={10}
                  shineFade={40}
                  thickness={1}
                  speed={0.35}
                  followMouse
                  proximity={250}
                  autoAnimate={false}
                  onClick={() =>
                    document.getElementById('book-demo')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    Get a Quote Today
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </SpecularButton>
                {/* <a href="#" className={styles.btnSecondary}>Our services</a> */}
              </div>

            </div>
          </div>

          {/* Body: circular video preview */}
          <div className={styles.body}>
            <div className={styles.container}>
              <div className={styles.videoWrap}>
                <div ref={videoRef} className={styles.video}>
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
                {/* Slowly-rotating white dashed ring, drawn on top of the dark
                    circle near its rim (thin stroke, long dashes) */}
                <div className={styles.videoRing} aria-hidden="true">
                  <svg className={styles.videoRingSvg} viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="43"
                      fill="none"
                      stroke="rgba(255,255,255,0.75)"
                      strokeWidth="0.3"
                      strokeDasharray="2.4 2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
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
