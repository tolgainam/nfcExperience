/**
 * Model Component
 *
 * PURPOSE:
 * Loads and renders 3D GLTF/GLB models with scroll-controlled animations.
 * Automatically converts database transform values (degrees, database paths) to
 * Three.js format. Supports embedded animations that sync with scroll progress.
 *
 * HOW TO USE:
 * ```tsx
 * <Model
 *   modelUrl="/models/product.glb"
 *   campaignColor="#0066CC"
 *   scrollYProgress={scrollYProgress}
 *   modelScale={10}
 *   modelPositionX={0}
 *   modelPositionY={-1}
 *   modelPositionZ={0}
 *   modelRotationX={0}
 *   modelRotationY={45}
 *   modelRotationZ={0}
 *   onFrameUpdate={(frame, total, time, duration) => {
 *     console.log(`Frame ${frame}/${total}`)
 *   }}
 * />
 * ```
 *
 * CUSTOMIZATION:
 * Transform Properties (from database):
 * - modelScale: Uniform scale multiplier (default: 10)
 * - modelPositionX/Y/Z: Position offset in world space (default: 0, 0, 0)
 * - modelRotationX/Y/Z: Rotation in DEGREES (default: 0, 0, 0)
 *   Note: Automatically converted to radians internally
 *
 * Animation Control:
 * - scrollYProgress: Framer Motion scroll value (0-1)
 * - Maps scroll progress to animation timeline
 * - onFrameUpdate: Callback for current animation frame info
 *
 * CAPABILITIES:
 * - Automatic GLTF/GLB loading with @react-three/drei
 * - Scroll-driven animation playback (manual time control)
 * - Database path conversion (/models/ → /src/assets/models/)
 * - Degrees to radians conversion for rotations
 * - Shadow casting and receiving support
 * - Multiple animation clip support
 * - Animation mixer with manual time control
 * - Frame-by-frame callback system
 *
 * ANIMATION SYSTEM:
 * - Uses THREE.AnimationMixer for animation control
 * - Sets loop mode to LoopOnce with clampWhenFinished
 * - Manually sets animation time based on scroll (0-duration)
 * - Updates mixer with minimal delta (0.0001) to apply time changes
 * - Supports multiple animation clips playing simultaneously
 *
 * MODEL REQUIREMENTS:
 * - Format: GLTF (.gltf) or GLB (.glb)
 * - Recommended size: < 5MB for web performance
 * - Animations: Optional, embedded in GLTF/GLB file
 * - Optimization: Use gltf-pipeline or Draco compression
 *
 * COMMON SCALE VALUES:
 * - scale=1: Very small (original model size)
 * - scale=5: Small, ~1/3 viewport
 * - scale=10: Medium, ~2/3 viewport (default)
 * - scale=15: Large, fills viewport
 * - scale=20+: Very large, may overflow
 *
 * ROTATION TIPS:
 * - Use multiples of 15° for clean angles (15, 30, 45, 60, 90)
 * - X rotation: Pitch (tilt forward/backward)
 * - Y rotation: Yaw (rotate left/right)
 * - Z rotation: Roll (lean sideways)
 *
 * DEBUGGING:
 * - Console logs transform values on mount
 * - Console logs mixer initialization with clip count
 * - Warns if mixer has no actions
 * - Frame callback provides current animation state
 */

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MotionValue } from 'framer-motion'

// Helper function to convert degrees to radians
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180

interface ModelProps {
  modelUrl?: string
  campaignColor: string
  scrollYProgress: MotionValue<number>
  modelScale?: number
  modelPositionX?: number
  modelPositionY?: number
  modelPositionZ?: number
  modelRotationX?: number
  modelRotationY?: number
  modelRotationZ?: number
  onFrameUpdate?: (frame: number, totalFrames: number, time: number, duration: number) => void
}

export default function Model({
  modelUrl,
  scrollYProgress,
  modelScale = 10,
  modelPositionX = 0,
  modelPositionY = 0,
  modelPositionZ = 0,
  modelRotationX = 0,
  modelRotationY = 0,
  modelRotationZ = 0,
  onFrameUpdate
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  // Convert database path to actual asset path
  // Database: /models/iluma-i-prime.glb -> Assets: /src/assets/models/iluma-i-prime.glb
  let effectiveModelUrl = '/src/assets/models/sample3d.glb' // fallback

  if (modelUrl) {
    // If database has /models/..., convert to /src/assets/models/...
    effectiveModelUrl = modelUrl.replace('/models/', '/src/assets/models/')
  }

  // Load the GLTF model with animations
  const { scene, animations } = useGLTF(effectiveModelUrl)

  // Track initialization to prevent re-running setup
  const initializedRef = useRef(false)

  // Log database values for debugging (only once)
  useEffect(() => {
    console.log('📊 Database Transform Values:', {
      scale: modelScale,
      position: { x: modelPositionX, y: modelPositionY, z: modelPositionZ },
      rotation: { x: modelRotationX, y: modelRotationY, z: modelRotationZ }
    })
  }, [modelScale, modelPositionX, modelPositionY, modelPositionZ, modelRotationX, modelRotationY, modelRotationZ])

  // Initialize scene and animation mixer when loaded (only once)
  useEffect(() => {
    if (!initializedRef.current && scene && animations) {
      // Enable shadow casting
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Initialize animation mixer
      if (animations.length > 0) {
        const mixer = new THREE.AnimationMixer(scene)
        mixerRef.current = mixer

        // Create actions for manual time control
        animations.forEach((clip) => {
          const action = mixer.clipAction(clip)
          action.setLoop(THREE.LoopOnce, 1)
          action.clampWhenFinished = true
          action.timeScale = 1 // Keep at 1, we'll control via time property
          action.play()
          console.log('✓ Animation clip loaded:', clip.name, 'duration:', clip.duration.toFixed(2) + 's')
        })

        console.log('✓ Mixer initialized with', animations.length, 'clips')
      } else {
        console.warn('⚠️ Model has no animations embedded')
      }

      initializedRef.current = true
    }

    return () => {
      // Reset on cleanup so it can reinitialize if component remounts
      initializedRef.current = false
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
        mixerRef.current = null
      }
    }
  }, [scene, animations])

  // Update animation based on scroll progress
  useFrame(() => {
    if (groupRef.current) {
      // Static rotation from database (convert degrees to radians)
      groupRef.current.rotation.x = degreesToRadians(modelRotationX)
      groupRef.current.rotation.y = degreesToRadians(modelRotationY)
      groupRef.current.rotation.z = degreesToRadians(modelRotationZ)
    }

    // Control animation time based on scroll progress
    if (scrollYProgress) {
      const scrollProgress = scrollYProgress.get() // 0 to 1

      if (mixerRef.current && mixerRef.current._actions) {
        const actions = mixerRef.current._actions

        if (actions && actions.length > 0) {
          // Control ALL animations (not just first)
          actions.forEach((action) => {
            if (action && action.getClip()) {
              const clip = action.getClip()
              const duration = clip.duration

              // Map scroll progress (0-1) to animation time (0-duration)
              const targetTime = Math.max(0, Math.min(scrollProgress * duration, duration - 0.001))

              // Manually control animation time via scroll
              action.enabled = true
              action.time = targetTime
              action.weight = 1
            }
          })

          // Force update with tiny delta to apply time changes
          mixerRef.current.update(0.0001)

          // Calculate frame info for display (using first animation)
          if (onFrameUpdate && actions[0] && actions[0].getClip()) {
            const clip = actions[0].getClip()
            const duration = clip.duration
            const targetTime = Math.max(0, Math.min(scrollProgress * duration, duration - 0.001))
            const fps = 30 // Assume 30 fps
            const currentFrame = Math.floor((targetTime / duration) * (duration * fps))
            const totalFrames = Math.floor(duration * fps)
            onFrameUpdate(currentFrame, totalFrames, targetTime, duration)
          }
        }
      } else {
        // No animations - still call onFrameUpdate with 0 values
        if (onFrameUpdate) {
          onFrameUpdate(0, 0, 0, 0)
        }
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* 3D Model */}
      <primitive
        object={scene}
        scale={modelScale}
        position={[modelPositionX, modelPositionY, modelPositionZ]}
        castShadow
        receiveShadow
      />
    </group>
  )
}

// Preload models for better performance
useGLTF.preload('/src/assets/models/sample3d.glb')
useGLTF.preload('/src/assets/models/iluma-i-prime.glb')
