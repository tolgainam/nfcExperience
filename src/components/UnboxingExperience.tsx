import { useRef, useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import type { UnitWithRelations } from '../types/database'
import PlaceholderModel from './3d/PlaceholderModel'
import ProductShowcaseExample from './ProductShowcaseExample'
import GradientText from './GradientText'
import introVideo from '../assets/intro-logo-melted.mp4'

interface UnboxingExperienceProps {
  unitData: UnitWithRelations
}

export default function UnboxingExperience({ unitData }: UnboxingExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Section 1 scroll animation states
  const [headerHeight, setHeaderHeight] = useState(100)
  const [textOpacity, setTextOpacity] = useState(1)

  // Refs for each section
  const section2Ref = useRef<HTMLDivElement>(null)

  // Scroll progress for entire page
  const { scrollY } = useScroll()

  // Scroll progress for Section 2 (3D animation) - tracks the 200vh section
  const { scrollYProgress: section2ScrollProgress } = useScroll({
    target: section2Ref,
    offset: ['start start', 'end end']
  })

  // Track scroll for Section 1 transform
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      // Scroll range for animation (0-1000px) - slower animation
      const scrollRange = 1200
      const progress = Math.min(latest / scrollRange, 1)

      // Height: 100vh → 9vh (90px)
      const newHeight = 100 - (progress * (100 - 9))
      setHeaderHeight(newHeight)

      // Fade out text: 1 → 0
      setTextOpacity(1 - progress)
    })

    return () => unsubscribe()
  }, [scrollY])

  return (
    <div ref={containerRef} style={{ background: '#0a0a0a', width: '100%' }}>

      {/* SECTION 1: Landing Section - Transforms into sticky header */}
      <section
        className="w-full flex flex-col items-center"
        style={{
          position: 'sticky',
          top: '0',
          background: '#0a0a0a',
          gap: headerHeight > 20 ? '32px' : '0',
          height: `${Math.max(headerHeight, 9)}vh`,
          minHeight: '90px',
          justifyContent: headerHeight > 20 ? 'center' : 'flex-start',
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
          zIndex: 100,
          overflow: 'hidden'
        }}
      >
        {/* Video container - scales down gradually */}
        <div
          className="flex items-center justify-center"
          style={{
            width: (() => {
              // Calculate gradual scaling from 80% to 60px
              const progress = (headerHeight - 9) / (100 - 9) // 0 to 1
              if (progress > 0.2) {
                return `${Math.max(20, progress * 80)}%`
              }
              return '60px'
            })(),
            transition: 'width 0.1s linear'
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-contain w-full"
            style={{ opacity: headerHeight <= 9 ? 0.6 : 0.8, transition: 'opacity 0.3s ease-out' }}
          >
            <source src={introVideo} type="video/mp4" />
          </video>
        </div>

        {/* Text content - fades out */}
        <div
          className="text-center"
          style={{
            opacity: textOpacity,
            pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
            transition: 'opacity 0.1s linear'
          }}
        >
          <GradientText
            colors={['#c9964a', '#d4a556', '#f5e6c8']}
            fontSize="large"
            animate={true}
            animationDuration="5s"
            glow={true}
            textAlign="center"
            className="mb-4"
          >
            IQOS ILUMA i
          </GradientText>
          <p className="text-xl md:text-2xl" style={{ color: '#c9964a' }}>
            Your journey starts here
          </p>
        </div>

        {/* Scroll Indicator - fades out */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{
            opacity: textOpacity,
            pointerEvents: textOpacity < 0.1 ? 'none' : 'auto',
            transition: 'opacity 0.1s linear'
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: 300vh tall section - creates scroll distance */}
      <section ref={section2Ref} style={{ height: '280vh', width: '100%' }}>
        {/* Centered wrapper - constrains max width */}
        <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', height: '220vh' }}>
          {/* Sticky container - 80vh tall, sticks to top during scroll */}
          <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', zIndex: 1 }}>
            <PlaceholderModel
              campaignColor={unitData.campaigns.theme_primary}
              modelUrl={unitData.products.model_url || undefined}
              scrollYProgress={section2ScrollProgress}
              modelScale={unitData.products.model_scale}
              modelPositionX={unitData.products.model_position_x}
              modelPositionY={unitData.products.model_position_y}
              modelPositionZ={unitData.products.model_position_z}
              modelRotationX={unitData.products.model_rotation_x}
              modelRotationY={unitData.products.model_rotation_y}
              modelRotationZ={unitData.products.model_rotation_z}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: Product Showcase */}
      <section id="section3" className="relative" style={{
        padding: '64px 16px',
        width: '100%',
        maxWidth: '420px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '-95vh',
        zIndex: 10
      }}>
        <ProductShowcaseExample />
      </section>

      {/* SECTION 4: Prize Section */}
      <section className="relative w-full" style={{ background: '#0a0a0a', padding: '64px 16px' }}>
        <div className="relative w-full flex flex-col items-center" style={{ gap: '16px' }}>

          {/* Container 1: Prize Image */}
          <motion.div
            className="relative w-full flex items-center justify-center"
            style={{ borderRadius: '24px', padding: '32px 0' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src="/prize.png"
              alt="IQOS x Seletti Limited Edition Organizer"
              className="h-auto object-contain"
              style={{ width: '80%' }}
            />
          </motion.div>

          {/* Container 2: Text Content + CTA */}
          <motion.div
            className="relative w-full flex flex-col items-center"
            style={{ borderRadius: '24px', padding: '32px 16px', gap: '24px', maxWidth: '100%' }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center" style={{ color: '#c9964a', maxWidth: '895px' }}>
              Win an IQOS x Seletti Limited Edition Organizer
            </h2>

            {/* Body Copy */}
            <p className="text-lg md:text-2xl text-center leading-relaxed" style={{ color: '#ffffff', maxWidth: '652px' }}>
              Login to the IQOS CLUB or become a member today and get a chance to win one of the 1000 pieces available.
            </p>

            {/* CTA Button - Full Width */}
            <div className="relative w-full flex items-center justify-center">
              <a
                href="#enter"
                className="relative overflow-hidden flex items-center justify-center rounded-full font-bold text-black transition-all group no-underline visited:text-black active:text-black"
                style={{
                  background: '#c9964a',
                  fontSize: 'clamp(20px, 5vw, 35px)',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  color: '#000',
                  width: '100%',
                  maxWidth: '100%'
                }}
              >
                <span className="relative z-10 font-bold" style={{ color: '#000' }}>Enter Here</span>
                <span
                  className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
                  style={{
                    zIndex: 1,
                    background: 'linear-gradient(90deg, rgba(212, 165, 86, 0.3) 0%, rgba(212, 165, 86, 0.8) 50%, #d4a556 100%)'
                  }}
                />
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
