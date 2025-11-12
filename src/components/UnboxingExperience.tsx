import { useRef, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useGLTF, Environment } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { PCFSoftShadowMap } from 'three'
import type { UnitWithRelations } from '../types/database'
import UnboxingContentCards from './UnboxingContentCards'

// Helper function to convert degrees to radians
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180

// Animated PointLight component for scroll-based animations
function AnimatedPointLight({
  scrollYProgress,
  basePosition,
  animateX = 0,
  animateY = 0,
  animateZ = 0,
  animateIntensity = 0,
  baseIntensity = 0,
  ...props
}: any) {
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

// Animated SpotLight component for scroll-based animations
function AnimatedSpotLight({
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
}: any) {
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

interface UnboxingExperienceProps {
  unitData: UnitWithRelations
}

export default function UnboxingExperience({ unitData }: UnboxingExperienceProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

  // Scroll progress for hero fade
  const { scrollYProgress: containerScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', '100vh start']
  })

  const heroOpacity = useTransform(containerScrollProgress, [0, 0.5], [1, 0])

  // Static scroll progress for 3D model (no rotation based on scroll)
  const { scrollYProgress: rotationScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Handle card visibility changes
  const handleCardInView = (cardIndex: number | null) => {
    setActiveCardIndex(cardIndex)
  }

  return (
    <div ref={containerRef} className="relative" style={{ position: 'relative', background: '#0a0a0a', width: '100%', minHeight: '100vh' }}>
      {/* Fixed 3D Canvas Background - stays static and visible */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <PlaceholderModel
            campaignColor={unitData.campaigns.theme_primary}
            modelUrl={unitData.products.model_url || undefined}
            scrollYProgress={rotationScrollProgress}
            activeCardIndex={activeCardIndex}
            modelScale={unitData.products.model_scale}
            modelPositionX={unitData.products.model_position_x}
            modelPositionY={unitData.products.model_position_y}
            modelPositionZ={unitData.products.model_position_z}
            modelRotationX={unitData.products.model_rotation_x}
            modelRotationY={unitData.products.model_rotation_y}
            modelRotationZ={unitData.products.model_rotation_z}
          />
        </motion.div>
      </div>

      {/* Hero Section - initial view */}
      <motion.section
        style={{
          opacity: heroOpacity,
          position: 'relative',
          zIndex: 10
        }}
        className="h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Hero Text Overlay */}
        <div className="relative text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-6xl md:text-8xl font-bold mb-4"
              style={{ color: 'var(--campaign-primary)' }}
            >
              {t('welcome.title', { productName: unitData.products.name })}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              {t('welcome.subtitle')}
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-sm text-gray-400"
            >
              {t('unboxing.scrollToExplore', { defaultValue: 'Scroll to explore' })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2"
            style={{ borderColor: 'var(--campaign-primary)' }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--campaign-primary)' }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Content Cards - scroll over 3D layer */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <UnboxingContentCards unitData={unitData} t={t} onCardInView={handleCardInView} />
      </div>
    </div>
  )
}

// Indicator Dot component - appears on model at specific locations
function IndicatorDot({ position, visible }: { position: [number, number, number]; visible: boolean }) {
  const dotRef = useRef<any>(null)

  useFrame(() => {
    if (dotRef.current) {
      // Pulsing animation
      const scale = visible ? 1 + Math.sin(Date.now() * 0.003) * 0.3 : 0
      dotRef.current.scale.setScalar(scale)
    }
  })

  if (!visible) return null

  return (
    <group position={position}>
      {/* Outer glow ring */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
        />
      </mesh>
      {/* Outer pulse ring */}
      <mesh>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>
    </group>
  )
}

function Model({
  modelUrl,
  campaignColor,
  scrollYProgress,
  activeCardIndex,
  modelScale = 10,
  modelPositionX = 0,
  modelPositionY = 0,
  modelPositionZ = 0,
  modelRotationX = 0,
  modelRotationY = 0,
  modelRotationZ = 0
}: {
  modelUrl?: string;
  campaignColor: string;
  scrollYProgress: any;
  activeCardIndex: number | null;
  modelScale?: number;
  modelPositionX?: number;
  modelPositionY?: number;
  modelPositionZ?: number;
  modelRotationX?: number;
  modelRotationY?: number;
  modelRotationZ?: number;
}) {
  const groupRef = useRef<any>(null)
  const meshRefs = useRef<any[]>([])

  // Convert database path to actual asset path
  // Database: /models/iluma-i-prime.glb -> Assets: /src/assets/models/iluma-i-prime.glb
  let effectiveModelUrl = '/src/assets/models/sample3d.glb' // fallback

  if (modelUrl) {
    // If database has /models/..., convert to /src/assets/models/...
    effectiveModelUrl = modelUrl.replace('/models/', '/src/assets/models/')
  }

  console.log('Loading 3D model from:', effectiveModelUrl)
  console.log('Model transform:', {
    scale: modelScale,
    position: [modelPositionX, modelPositionY, modelPositionZ],
    rotation: [modelRotationX, modelRotationY, modelRotationZ],
    rotationUnit: 'degrees'
  })

  // Load the GLTF model
  const { scene } = useGLTF(effectiveModelUrl)

  // Log model info for debugging
  console.log('Model loaded:', scene)
  console.log('Model bounding box:', scene.children)

  // Enable shadow casting and collect meshes with positions
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      meshRefs.current.push(child)
    }
  })

  // Define indicator dot positions for each card (relative to model)
  // Customize these positions to point at specific features
  const dotPositions: Record<number, [number, number, number]> = {
    0: [0, 3.5, 2.5],    // Card 0 - Premium Design (top)
    1: [0, 0, 0.8],      // Card 1 - Advanced Technology (front center)
    2: [0.6, 0.5, 0.3],  // Card 2 - Smart Features (side)
    3: [0, -0.5, 0.5],   // Card 3 - Easy to Use (button area)
    4: [-0.5, 0, 0.3],   // Card 4 - Technical Specs (left side)
    5: [0, -1.2, 0.3],   // Card 5 - What's in Box (bottom)
    6: [0, 0.8, 0.5],    // Card 6 - Getting Started (upper area)
    7: [0.4, -0.8, 0.3], // Card 7 - Support (lower right)
  }

  // Rotate model based on scroll + base rotation from database
  useFrame(() => {
    if (groupRef.current && scrollYProgress) {
      // Base rotation from database (convert degrees to radians)
      groupRef.current.rotation.x = degreesToRadians(modelRotationX)
      groupRef.current.rotation.z = degreesToRadians(modelRotationZ)
      // Y-axis rotation: base rotation + scroll animation (0 to 2π for full rotation)
      groupRef.current.rotation.y = degreesToRadians(modelRotationY) + (scrollYProgress.get() * Math.PI * 2)
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

      {/* Indicator Dots - show only for active card */}
      {Object.entries(dotPositions).map(([cardIdx, position]) => (
        <IndicatorDot
          key={cardIdx}
          position={position}
          visible={activeCardIndex === parseInt(cardIdx)}
        />
      ))}
    </group>
  )
}

// Preload models for better performance
useGLTF.preload('/src/assets/models/sample3d.glb')
useGLTF.preload('/src/assets/models/iluma-i-prime.glb')

function PlaceholderModel({
  campaignColor,
  modelUrl,
  scrollYProgress,
  activeCardIndex,
  modelScale,
  modelPositionX,
  modelPositionY,
  modelPositionZ,
  modelRotationX,
  modelRotationY,
  modelRotationZ
}: {
  campaignColor: string;
  modelUrl?: string;
  scrollYProgress: any;
  activeCardIndex: number | null;
  modelScale?: number;
  modelPositionX?: number;
  modelPositionY?: number;
  modelPositionZ?: number;
  modelRotationX?: number;
  modelRotationY?: number;
  modelRotationZ?: number;
}) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        shadows={{ enabled: true, type: PCFSoftShadowMap }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

        {/* Scene Lighting - Static (no scroll animation) */}
        <ambientLight intensity={0.4} />

        <spotLight
          position={[0, 0, 9]}
          target-position={[0, 0, 5]}
          intensity={1}
          angle={0.5}
          penumbra={0.8}
          decay={1.8}
          color="#0000ff"
        />

        <spotLight
          position={[-2, 10, -2]}
          target-position={[2, 0, -3]}
          intensity={25}
          angle={3}
          penumbra={0}
          decay={0.9}
          color="#00d1d2"
        />

        <pointLight
          position={[-3, 2, 1]}
          intensity={5}
          color="#4da6ff"
        />

        <pointLight
          position={[3, -4, 2]}
          intensity={4}
          color="#00a6ff"
        />


        {/* Environment - Creates realistic scene lighting and reflections */}
        <Environment preset="warehouse" background={true} environmentIntensity={0.02} />

        {/* Background Plane - Vertical backdrop behind object, facing camera */}
        <mesh rotation={[0, 0, 0]} position={[0, 0, -5]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#34303d"
            
            roughness={0.7}
            metalness={0.1}
            envMapIntensity={0.1}
          />
        </mesh>

        {/* Contact Shadows - Disabled (was causing rotating artifacts on background) */}
        {/* <ContactShadows
          position={[0, -1.49, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={5}
        /> */}



        {/* 3D Model with Suspense for loading */}
        <Suspense fallback={null}>
          <Model
            modelUrl={modelUrl}
            campaignColor={campaignColor}
            scrollYProgress={scrollYProgress}
            activeCardIndex={activeCardIndex}
            modelScale={modelScale}
            modelPositionX={modelPositionX}
            modelPositionY={modelPositionY}
            modelPositionZ={modelPositionZ}
            modelRotationX={modelRotationX}
            modelRotationY={modelRotationY}
            modelRotationZ={modelRotationZ}
          />
        </Suspense>

        {/* Controls - Disabled */}
        {/* <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        /> */}
      </Canvas>
    </div>
  )
}
