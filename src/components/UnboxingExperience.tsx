import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { UnitWithRelations } from '../types/database'

interface UnboxingExperienceProps {
  unitData: UnitWithRelations
}

export default function UnboxingExperience({ unitData }: UnboxingExperienceProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <div ref={containerRef} className="relative" style={{ position: 'relative', background: 'white' }}>
      {/* Hero Section with 3D Model */}
      <motion.section
        style={{ opacity: heroOpacity, position: 'relative' }}
        className="h-screen flex items-center justify-center overflow-hidden relative"
      >
        {/* Background Gradient based on campaign */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at center, ${unitData.campaigns.theme_primary} 0%, ${unitData.campaigns.theme_primary}80 40%, transparent 70%)`,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />

        {/* 3D Model Container */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full h-full"
          >
            <PlaceholderModel campaignColor={unitData.campaigns.theme_primary} />
          </motion.div>
        </div>

        {/* Hero Text Overlay */}
        <div className="relative z-20 text-center px-4 mix-blend-normal">
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
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
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

      {/* Features Section with Parallax */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FeatureCard
            title={t('unboxing.feature1.title', { defaultValue: 'Premium Design' })}
            description={t('unboxing.feature1.description', { defaultValue: 'Experience the perfect blend of innovation and style' })}
            delay={0.2}
          />
          <FeatureCard
            title={t('unboxing.feature2.title', { defaultValue: 'Advanced Technology' })}
            description={t('unboxing.feature2.description', { defaultValue: 'Cutting-edge features designed for your comfort' })}
            delay={0.4}
          />
          <FeatureCard
            title={t('unboxing.feature3.title', { defaultValue: 'Easy to Use' })}
            description={t('unboxing.feature3.description', { defaultValue: 'Intuitive design that just works' })}
            delay={0.6}
          />
        </div>
      </section>

      {/* Getting Started CTA */}
      <section className="relative py-20 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--campaign-primary)' }}
          >
            {t('unboxing.gettingStarted')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('unboxing.gettingStarted.description', { defaultValue: 'Follow these simple steps to begin your journey' })}
          </p>
          <button
            className="px-8 py-4 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'var(--campaign-primary)' }}
          >
            {t('unboxing.explore')}
          </button>
        </motion.div>
      </section>

      {/* Campaign Info (Debug) */}
      <div className="py-4 px-4 bg-gray-100 text-center text-sm text-gray-500">
        <p>Campaign: {unitData.campaigns.name} | Product: {unitData.products.name}</p>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="mb-12 flex items-start gap-6"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'var(--campaign-primary)', opacity: 0.1 }}
      >
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: 'var(--campaign-primary)' }}
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--campaign-primary)' }}>
          {title}
        </h3>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </motion.div>
  )
}

function Box() {
  const meshRef = useRef<any>(null)

  // Auto-rotate the box
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 1.5
      meshRef.current.rotation.y += delta * 1.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color="#EF4444" metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

function PlaceholderModel({ campaignColor }: { campaignColor: string }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* 3D Box */}
        <Box />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={3}
        />
      </Canvas>
    </div>
  )
}
