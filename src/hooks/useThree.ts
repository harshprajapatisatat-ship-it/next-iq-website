'use client'

import { useEffect, useRef } from 'react'
import { THREE, createRenderer, createPerspectiveCamera, createScene } from '@/lib/three'

type UseThreeOptions = {
  antialias?: boolean
  alpha?: boolean
  fov?: number
}

export function useThree(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseThreeOptions = {}
) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = createRenderer({
      canvas,
      antialias: options.antialias,
      alpha: options.alpha,
    })
    const scene = createScene()
    const camera = createPerspectiveCamera(
      options.fov,
      canvas.clientWidth / canvas.clientHeight
    )

    rendererRef.current = renderer
    sceneRef.current = scene
    cameraRef.current = camera

    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)
    onResize()

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return { rendererRef, sceneRef, cameraRef }
}
