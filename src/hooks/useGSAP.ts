'use client'

import { useEffect, useRef, type DependencyList } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useGSAP(
  callback: (context: gsap.Context) => void,
  deps: DependencyList = []
) {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    contextRef.current = gsap.context(callback)
    return () => {
      contextRef.current?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return contextRef
}

export { gsap, ScrollTrigger }
