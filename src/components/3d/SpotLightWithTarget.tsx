/**
 * SpotLightWithTarget Component
 *
 * PURPOSE:
 * A spotlight component that properly targets a specific 3D position in the scene.
 * Solves the common Three.js issue where spotlight targets don't update correctly
 * by manually managing the target object and its world matrix.
 *
 * HOW TO USE:
 * ```tsx
 * <SpotLightWithTarget
 *   position={[5, 5, 2]}
 *   targetPosition={[0, 0, 0]}
 *   intensity={10}
 *   angle={0.5}
 *   penumbra={0.5}
 *   color="#ffffff"
 * />
 * ```
 *
 * CUSTOMIZATION:
 * - position: Spotlight source position [x, y, z]
 * - targetPosition: Where the light points [x, y, z]
 * - intensity: Light brightness (higher = brighter)
 * - angle: Cone angle in radians (smaller = tighter beam)
 * - penumbra: Edge softness 0-1 (0 = hard edge, 1 = very soft)
 * - color: Light color (hex string or CSS color name)
 *
 * CAPABILITIES:
 * - Automatic target position management
 * - Shadow casting support
 * - Real-time target updates via useEffect
 * - Works with React Three Fiber's declarative API
 *
 * AVAILABLE PROPS (from Three.js SpotLight):
 * - position: Light source position [x, y, z]
 * - intensity: Light intensity (default: 1)
 * - distance: Maximum range (0 = infinite)
 * - angle: Cone angle in radians (default: Math.PI/3, max: Math.PI/2)
 * - penumbra: Edge softness 0-1 (default: 0)
 * - decay: Light falloff rate (default: 2)
 * - color: Light color (hex, rgb, or CSS name)
 * - castShadow: Enable shadow casting (boolean)
 * - shadow-bias: Shadow bias to prevent artifacts (default: 0)
 * - shadow-normalBias: Normal-based shadow bias
 * - shadow-mapSize: Shadow map resolution [width, height]
 * - shadow-camera-near: Shadow camera near plane
 * - shadow-camera-far: Shadow camera far plane
 * - shadow-camera-fov: Shadow camera field of view
 *
 * COMMON PATTERNS:
 * - Key light: position=[5, 5, 5], intensity=10-20, angle=0.3-0.5
 * - Rim light: position=[0, 3, -5], intensity=5-10, angle=0.5-0.8
 * - Fill light: position=[-3, 2, 3], intensity=3-8, angle=0.6-1.0
 * - Dramatic light: high intensity, small angle, low penumbra
 * - Soft light: medium intensity, large angle, high penumbra
 */

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SpotLightWithTargetProps {
  position: [number, number, number]
  targetPosition: [number, number, number]
  intensity: number
  angle: number
  penumbra: number
  color: string
}

export default function SpotLightWithTarget({
  position,
  targetPosition,
  intensity,
  angle,
  penumbra,
  color
}: SpotLightWithTargetProps) {
  const lightRef = useRef<THREE.SpotLight>(null)

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(...targetPosition)
      lightRef.current.target.updateMatrixWorld()
    }
  }, [targetPosition])

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        color={color}
        castShadow
      />
    </>
  )
}
