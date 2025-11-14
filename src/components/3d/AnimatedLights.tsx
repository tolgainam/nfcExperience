/**
 * AnimatedLights Components
 *
 * PURPOSE:
 * Provides point lights and spotlights that animate their position, intensity, and
 * target position based on scroll progress. Creates dynamic lighting effects that
 * enhance 3D model presentation during scroll-based animations.
 *
 * COMPONENTS:
 * 1. AnimatedPointLight - Omnidirectional light that animates position and intensity
 * 2. AnimatedSpotLight - Directional cone light with animated position, target, and intensity
 *
 * HOW TO USE:
 * ```tsx
 * // Animated Point Light
 * <AnimatedPointLight
 *   scrollYProgress={scrollYProgress}
 *   basePosition={[2, 3, 4]}
 *   baseIntensity={1}
 *   animateX={-2}
 *   animateY={1}
 *   animateIntensity={2}
 *   color="#ffffff"
 * />
 *
 * // Animated Spot Light
 * <AnimatedSpotLight
 *   scrollYProgress={scrollYProgress}
 *   basePosition={[5, 5, 2]}
 *   baseTargetPosition={[0, 0, 0]}
 *   baseIntensity={10}
 *   animateIntensity={50}
 *   angle={0.5}
 *   penumbra={0.5}
 *   color="#ff0000"
 *   castShadow
 * />
 * ```
 *
 * CUSTOMIZATION:
 * - basePosition: Starting position [x, y, z]
 * - animateX/Y/Z: Amount to move on each axis (added to base during scroll)
 * - baseIntensity: Starting light intensity
 * - animateIntensity: Intensity change during scroll (added to base)
 * - For SpotLight: baseTargetPosition + animateTargetX/Y/Z for target movement
 *
 * CAPABILITIES:
 * - Smooth linear interpolation based on scroll progress (0-1)
 * - Per-frame updates using @react-three/fiber's useFrame
 * - Support for all Three.js light properties (color, distance, decay, etc.)
 * - Shadow casting support (SpotLight)
 *
 * AVAILABLE PROPS (from Three.js lights):
 * PointLight:
 * - color: Light color (hex or string, default: #ffffff)
 * - intensity: Light intensity (default: 1)
 * - distance: Maximum range (0 = infinite)
 * - decay: Light falloff rate (default: 2)
 *
 * SpotLight:
 * - color: Light color (hex or string)
 * - intensity: Light intensity
 * - distance: Maximum range
 * - angle: Cone angle in radians (default: Math.PI/3)
 * - penumbra: Edge softness 0-1 (default: 0)
 * - decay: Light falloff rate
 * - castShadow: Enable shadow casting (boolean)
 * - shadow-mapSize: Shadow map resolution [width, height]
 */

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

interface AnimatedPointLightProps {
  scrollYProgress: any
  basePosition: [number, number, number]
  animateX?: number
  animateY?: number
  animateZ?: number
  animateIntensity?: number
  baseIntensity?: number
  [key: string]: any
}

export function AnimatedPointLight({
  scrollYProgress,
  basePosition,
  animateX = 0,
  animateY = 0,
  animateZ = 0,
  animateIntensity = 0,
  baseIntensity = 0,
  ...props
}: AnimatedPointLightProps) {
  const ref = useRef<any>(null)

  useFrame(() => {
    if (ref.current && scrollYProgress) {
      const p = scrollYProgress.get()
      ref.current.position.x = basePosition[0] + animateX * p
      ref.current.position.y = basePosition[1] + animateY * p
      ref.current.position.z = basePosition[2] + animateZ * p
      ref.current.intensity = baseIntensity + animateIntensity * p
    }
  })

  return <pointLight ref={ref} position={basePosition} intensity={baseIntensity} {...props} />
}

interface AnimatedSpotLightProps {
  scrollYProgress: any
  basePosition: [number, number, number]
  baseTargetPosition: [number, number, number]
  animateX?: number
  animateY?: number
  animateZ?: number
  animateTargetX?: number
  animateTargetY?: number
  animateTargetZ?: number
  animateIntensity?: number
  baseIntensity?: number
  [key: string]: any
}

export function AnimatedSpotLight({
  scrollYProgress,
  basePosition,
  baseTargetPosition,
  animateX = 0,
  animateY = 0,
  animateZ = 0,
  animateTargetX = 0,
  animateTargetY = 0,
  animateTargetZ = 0,
  animateIntensity = 0,
  baseIntensity = 0,
  ...props
}: AnimatedSpotLightProps) {
  const [light, setLight] = useState<any>()

  useFrame(() => {
    if (light && scrollYProgress) {
      const p = scrollYProgress.get()

      // Animate light position
      light.position.x = basePosition[0] + animateX * p
      light.position.y = basePosition[1] + animateY * p
      light.position.z = basePosition[2] + animateZ * p

      // Animate intensity
      light.intensity = baseIntensity + animateIntensity * p

      // Animate target position
      if (light.target) {
        light.target.position.x = baseTargetPosition[0] + animateTargetX * p
        light.target.position.y = baseTargetPosition[1] + animateTargetY * p
        light.target.position.z = baseTargetPosition[2] + animateTargetZ * p
      }
    }
  })

  return (
    <>
      <spotLight
        ref={setLight}
        position={basePosition}
        intensity={baseIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-fov={50}
        {...props}
      />
      {light && <primitive object={light.target} position={baseTargetPosition} />}
    </>
  )
}
