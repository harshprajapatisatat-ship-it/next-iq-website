import * as THREE from 'three'

export { THREE }

export type RendererConfig = {
  canvas?: HTMLCanvasElement
  antialias?: boolean
  alpha?: boolean
}

export function createRenderer(config: RendererConfig = {}): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas: config.canvas,
    antialias: config.antialias ?? true,
    alpha: config.alpha ?? true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  return renderer
}

export function createPerspectiveCamera(fov = 75, aspect = 1): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000)
}

export function createScene(): THREE.Scene {
  return new THREE.Scene()
}
