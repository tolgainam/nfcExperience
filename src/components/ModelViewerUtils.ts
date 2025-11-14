import { useGLTF } from '@react-three/drei'

// Preload model for better performance
export function preloadModel(url: string) {
  useGLTF.preload(url)
}
