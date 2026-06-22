import styles from "./Hero.module.css";
import FallingText from "./FallingText";
import Particles from "./Particles";

export default function Hero() {
  return (
    <section className={styles.hero}>

      <Particles
        particleColors={['#2563EB', '#60A5FA', '#93C5FD']}
        particleCount={120}
        particleSpread={6}
        speed={0.015}
        particleBaseSize={4}
        sizeRandomness={0.4}
        moveParticlesOnHover={true}
        particleHoverFactor={0.2}
        alphaParticles={true}
        disableRotation={false}
      />

      <div className={styles.heroContent}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          Look like the company you&apos;re becoming
        </div>

        <h1 className={styles.heroHeading}>
          Design + build partner<br />
          for funded startups
        </h1>

        <p className={styles.heroSub}>
          We help startups, AI companies, and product teams shape sharper<br />
          brands, websites, products, and launch experiences.
        </p>

        <div className={styles.heroActions}>
          <a href="#" className={styles.btnPrimary}>Get a quote today</a>
          <a href="#" className={styles.btnGhost}>Our services</a>
        </div>
      </div>

      <FallingText />

    </section>
  );
}
