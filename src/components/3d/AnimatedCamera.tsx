/**
 * AnimatedCamera Component
 *
 * PURPOSE:
 * Provides a camera that smoothly animates its position based on scroll progress.
 * Uses threshold-based animation to create dramatic camera movements during specific
 * scroll ranges, perfect for cinematic product reveals.
 *
 * HOW TO USE:
 * ```tsx
 * <AnimatedCamera scrollYProgress={scrollYProgress} />
 * ```
 *
 * CUSTOMIZATION:
 * Modify the camera path by editing:
 * - startPos: Initial camera position (x, y, z)
 * - endPos: Final camera position (x, y, z)
 * - cameraStartThreshold: When to start moving (0-1, default 0.3 = 30% scroll)
 * - cameraEndThreshold: When to finish moving (0-1, default 1.0 = 100% scroll)
 *
 * CAPABILITIES:
 * - Smooth interpolation between start and end positions
 * - Threshold-based animation for controlled timing
 * - Always looks at scene center (0, 0, 0)
 * - Built on @react-three/drei PerspectiveCamera
 *
 * AVAILABLE PROPS (from PerspectiveCamera):
 * - fov: Field of view (default: 30)
 * - near: Near clipping plane (default: 0.1)
 * - far: Far clipping plane (default: 1000)
 * - position: Initial position [x, y, z] (default: [0, 0, 5])
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface AnimatedCameraProps {
  scrollYProgress: any
}

export default function AnimatedCamera({ scrollYProgress }: AnimatedCameraProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (cameraRef.current && scrollYProgress) {
      const scrollProgress = scrollYProgress.get() // 0 to 1

      // Define camera path
      const startPos = { x: -0.1, y: -0.2, z: 5 }
      const endPos = { x: 0, y: 0, z: 7 }

      // Camera animation range thresholds
      const cameraStartThreshold = 0.0 // Start moving at 0% scroll
      const cameraEndThreshold = 1.0   // Finish moving at 100% scroll

      // Calculate camera progress with threshold
      let cameraProgress = 0
      if (scrollProgress < cameraStartThreshold) {
        cameraProgress = 0
      } else if (scrollProgress >= cameraEndThreshold) {
        cameraProgress = 1
      } else {
        cameraProgress = (scrollProgress - cameraStartThreshold) / (cameraEndThreshold - cameraStartThreshold)
      }

      // Interpolate position based on camera progress
      const targetX = startPos.x + (endPos.x - startPos.x) * cameraProgress
      const targetY = startPos.y + (endPos.y - startPos.y) * cameraProgress
      const targetZ = startPos.z + (endPos.z - startPos.z) * cameraProgress

      // Apply position directly
      cameraRef.current.position.x = targetX
      cameraRef.current.position.y = targetY
      cameraRef.current.position.z = targetZ

      // Look at the center (slightly offset to avoid gimbal lock when camera is at origin)
      cameraRef.current.lookAt(0, 0.1, 0.1)
}
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[-0.1, -0.2, 5]} fov={50} near={0.1} far={1000} />
}
