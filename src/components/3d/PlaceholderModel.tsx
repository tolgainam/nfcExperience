/**
 * PlaceholderModel Component
 *
 * PURPOSE:
 * Complete 3D scene wrapper that includes Canvas setup, lighting, camera, environment,
 * and the 3D model. Provides a ready-to-use 3D viewer with scroll-based animation
 * and a debug overlay showing scroll progress and animation frames.
 *
 * HOW TO USE:
 * ```tsx
 * <PlaceholderModel
 *   campaignColor="#0066CC"
 *   modelUrl="/models/product.glb"
 *   scrollYProgress={scrollYProgress}
 *   modelScale={10}
 *   modelPositionX={0}
 *   modelPositionY={0}
 *   modelPositionZ={0}
 *   modelRotationX={0}
 *   modelRotationY={0}
 *   modelRotationZ={0}
 * />
 * ```
 *
 * CUSTOMIZATION:
 * Model Transform:
 * - All modelScale, modelPosition*, modelRotation* props passed to Model component
 * - See Model.tsx documentation for details
 *
 * Lighting Setup (modify in component):
 * - Ambient light: Global illumination (currently 0.01)
 * - Directional lights: 3 lights for key/fill/back lighting
 * - Spotlights: 3 spotlights (currently disabled with intensity=0)
 * - Environment: HDR environment map (preset: "sunset")
 *
 * Background:
 * - Fog: Atmospheric depth effect (color: #000000, near: 40, far: 250)
 * - Background color: #0a0a0a (dark gray)
 *
 * CAPABILITIES:
 * - Complete Canvas setup with shadows and antialiasing
 * - Scroll progress tracking with visual debug overlay
 * - Animation frame counter and timeline display
 * - Suspense loading state for model
 * - HDR environment lighting for realistic materials
 * - Atmospheric fog for depth perception
 * - Three-point lighting setup (key, fill, back)
 * - Optional spotlights for dramatic effects
 *
 * CANVAS CONFIGURATION:
 * - Shadows: Enabled with PCFSoftShadowMap (soft shadows)
 * - Antialiasing: Enabled for smooth edges
 * - Alpha: Enabled for transparency support
 * - Size: 100% width and height (fills container)
 *
 * LIGHTING SETUP:
 * Current configuration:
 * - Ambient: 0.01 intensity (very dark, lets directional lights dominate)
 * - Key Light: [5, 5, 5], intensity 15, red tint (#ff0000)
 * - Fill Light: [-3, 3, 2], intensity 0.08, white (#ffffff)
 * - Back Light: [0, 3, 3], intensity 0.6, magenta (#ff00ff)
 * - Spotlights: Disabled (intensity 0), ready to enable for effects
 *
 * ENVIRONMENT SETTINGS:
 * - Preset: "sunset" (warm lighting, good for product shots)
 * - Background: false (doesn't replace scene background)
 * - Intensity: 0.02 (subtle environmental reflections)
 *
 * Other presets available:
 * - "apartment", "city", "dawn", "forest", "lobby", "night", "park",
 *   "studio", "sunset", "warehouse"
 *
 * FOG CONFIGURATION:
 * - Type: Linear fog (fades linearly between near and far)
 * - Color: #000000 (black, matches dark background)
 * - Near: 40 (starts fading at distance 40)
 * - Far: 250 (fully faded at distance 250)
 *
 * DEBUG OVERLAY:
 * Shows in top-left corner:
 * - Scroll percentage (0-100%)
 * - Current animation frame / total frames
 * - Current time / total duration (seconds)
 * - Animation progress percentage
 *
 * To disable: Remove or comment out the debug overlay div
 *
 * PERFORMANCE TIPS:
 * - Reduce shadow-mapSize for better performance
 * - Disable shadows if not needed (remove castShadow props)
 * - Lower environment intensity or disable Environment
 * - Use simpler lighting (fewer lights = better performance)
 * - Optimize 3D models (< 5MB recommended)
 */

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { MotionValue } from 'framer-motion'
import Model from './Model'
import AnimatedCamera from './AnimatedCamera'
import SpotLightWithTarget from './SpotLightWithTarget'

interface PlaceholderModelProps {
  campaignColor: string
  modelUrl?: string
  scrollYProgress: MotionValue<number>
  modelScale?: number
  modelPositionX?: number
  modelPositionY?: number
  modelPositionZ?: number
  modelRotationX?: number
  modelRotationY?: number
  modelRotationZ?: number
}

export default function PlaceholderModel({
  campaignColor,
  modelUrl,
  scrollYProgress,
  modelScale,
  modelPositionX,
  modelPositionY,
  modelPositionZ,
  modelRotationX,
  modelRotationY,
  modelRotationZ
}: PlaceholderModelProps) {
  // Track scroll progress for debugging
  useEffect(() => {
    if (scrollYProgress) {
      const unsubscribe = scrollYProgress.on('change', () => {
        // Scroll tracking can be added here if needed
      })
      return () => unsubscribe()
    }
  }, [scrollYProgress])

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0a', position: 'relative' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        shadows={{ enabled: true, type: THREE.PCFSoftShadowMap }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Fog - Creates atmospheric depth and mist effect */}
       {/* <fog attach="fog" args={['#ffffff', 100, 250]} /> */}

        <AnimatedCamera scrollYProgress={scrollYProgress} />

        {/* Scene Lighting - Static (no scroll animation) */}
        <ambientLight intensity={32.1} />

        {/* Key Light - Main light from front-top */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={25}
          color="#FFFFED"
          castShadow
        />

        {/* Fill Light - Softer light from opposite side */}
        <directionalLight
          position={[-3, 3, 2]}
          intensity={1.08}
          color="#ffffff"
        />

        {/* Back Light - Rim lighting to separate object from background */}
        <directionalLight
          position={[0, 5, -3]}
          intensity={20.6}
          color="#ffffED"
        />

        {/* Colored spotlights for dramatic effect */}
        <SpotLightWithTarget
          position={[5, 5, -2]}
          targetPosition={[0, 0, 0]}
          intensity={20}
          angle={1.5}
          penumbra={1.5}
          color="#ff00ff"
        />

        <SpotLightWithTarget
          position={[0, 5, -2]}
          targetPosition={[0, 0, 0]}
          intensity={20}
          angle={3.5}
          penumbra={0.5}
          color="#ff00ff"
        />

        <SpotLightWithTarget
          position={[0, -5, 2]}
          targetPosition={[0, 0, 0]}
          intensity={0}
          angle={0.6}
          penumbra={0.5}
          color="#00ffff"
        />

        {/* Environment - Creates realistic scene lighting and reflections */}
        <Environment preset="sunset" background={false} environmentIntensity={0.5} />

        {/* 3D Model with Suspense for loading */}
        <Suspense fallback={null}>
          <Model
            modelUrl={modelUrl}
            campaignColor={campaignColor}
            scrollYProgress={scrollYProgress}
            modelScale={modelScale}
            modelPositionX={modelPositionX}
            modelPositionY={modelPositionY}
            modelPositionZ={modelPositionZ}
            modelRotationX={modelRotationX}
            modelRotationY={modelRotationY}
            modelRotationZ={modelRotationZ}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
