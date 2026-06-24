'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

const HEADLINES = [
  'ERPNext\nExperts',
  'AI-Powered\nAutomation',
  'Trusted\nEcosystem',
];

export default function Hero() {
  const heroRef        = useRef<HTMLElement>(null);
  const clipRef        = useRef<HTMLDivElement>(null);
  const fillRef        = useRef<HTMLDivElement>(null);
  const maskRef        = useRef<HTMLDivElement>(null);
  const footerOuterRef = useRef<HTMLDivElement>(null);
  const headlinesRef   = useRef<HTMLDivElement>(null);
  const headlineRefs   = useRef<(HTMLDivElement | null)[]>([]);

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
                <h1>Design&nbsp;+&nbsp;build partner<br />for funded startups</h1>
              </div>

              <p className={styles.subtext}>
                We help startups, AI companies, and product teams shape
                sharper brands, websites, products, and launch experiences.
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
                <a href="#" className={styles.btnSecondary}>Our services</a>
              </div>

            </div>
          </div>

          {/* Body: circular video preview */}
          <div className={styles.body}>
            <div className={styles.container}>
              <div className={styles.video}>
                <div className={styles.videoInner}>
                  <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={styles.videoSvg}>
                    <circle cx="100" cy="100" r="96" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="16" fill="rgba(255,255,255,0.15)" />
                    {[0, 72, 144, 216, 288].map((deg, i) => {
                      const rad = (deg - 90) * (Math.PI / 180);
                      const cx  = 100 + 60 * Math.cos(rad);
                      const cy  = 100 + 60 * Math.sin(rad);
                      const lx1 = 100 + 17 * Math.cos(rad);
                      const ly1 = 100 + 17 * Math.sin(rad);
                      const lx2 = cx - 11 * Math.cos(rad);
                      const ly2 = cy - 11 * Math.sin(rad);
                      return (
                        <g key={i}>
                          <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                          <circle cx={cx} cy={cy} r="9" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        </g>
                      );
                    })}
                    <text x="100" y="104" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">nIQ</text>
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
