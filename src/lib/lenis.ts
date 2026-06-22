import Lenis from 'lenis'
import { ScrollTrigger } from './gsap'

export function createLenis(): Lenis {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  // Keep GSAP ScrollTrigger in sync with Lenis scroll position
  lenis.on('scroll', ScrollTrigger.update)

  return lenis
}

export { Lenis }
