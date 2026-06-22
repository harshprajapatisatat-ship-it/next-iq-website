'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createLenis, Lenis } from '@/lib/lenis'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = createLenis()
    lenisRef.current = lenis

    // Drive Lenis via GSAP ticker so it stays in sync with ScrollTrigger
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
