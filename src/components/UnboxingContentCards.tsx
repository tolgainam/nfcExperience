import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { UnitWithRelations } from '../types/database'

interface UnboxingContentCardsProps {
  unitData: UnitWithRelations
  t: (key: string, options?: Record<string, unknown>) => string
  onCardInView?: (cardIndex: number | null) => void
}

function LiquidGlassCard({
  children,
  delay = 0,
  cardIndex,
  onInView
}: {
  children: React.ReactNode;
  delay?: number;
  cardIndex?: number;
  onInView?: (index: number | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Track scroll position of this card relative to viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'] // Track from entering bottom to center of screen
  })

  // Fade out as card reaches center and next card enters
  // scrollYProgress: 0 = card entering, 1 = card at center
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [1, 1, 0.2, 0])

  // Notify parent when card enters/exits viewport
  const handleViewportEnter = () => {
    if (onInView && cardIndex !== undefined) {
      onInView(cardIndex)
    }
  }

  const handleViewportLeave = () => {
    if (onInView && cardIndex !== undefined) {
      onInView(null)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0.8,
        y: 80
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      onViewportEnter={handleViewportEnter}
      onViewportLeave={handleViewportLeave}
      style={{
        opacity: scrollOpacity,
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        border: '1.5px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '32px',
        boxShadow: `
          0 8px 32px 0 rgba(0, 0, 0, 0.37),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
          inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)
        `,
        padding: '3rem 2.5rem',
        marginLeft: '24px',
        marginRight: '24px'
      }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      viewport={{ once: true, margin: "-80px" }}
      className="liquid-glass-card"
    >
      {/* Top edge highlight */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: delay + 0.4 }}
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Gradient overlay for depth */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: delay + 0.2 }}
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        viewport={{ once: true }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function UnboxingContentCards({ unitData, t, onCardInView }: UnboxingContentCardsProps) {
  return (
    <>
      {/* Features Section with Liquid Glass Cards */}
      <section className="relative py-24 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-5xl mx-auto space-y-10">
          <LiquidGlassCard delay={0.2} cardIndex={0} onInView={onCardInView}>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{
              color: 'var(--campaign-primary)',
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}>
              {t('unboxing.feature1.title', { defaultValue: 'Premium Design' })}
            </h3>
            <p className="text-white text-xl md:text-2xl leading-relaxed" style={{
              lineHeight: '1.6',
              fontWeight: 500
            }}>
              {t('unboxing.feature1.description', { defaultValue: 'Experience the perfect blend of innovation and style with meticulously crafted materials and attention to every detail.' })}
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard delay={0.3} cardIndex={1} onInView={onCardInView}>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{
              color: 'var(--campaign-primary)',
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}>
              {t('unboxing.feature2.title', { defaultValue: 'Advanced Technology' })}
            </h3>
            <p className="text-white text-xl md:text-2xl leading-relaxed" style={{
              lineHeight: '1.6',
              fontWeight: 500
            }}>
              {t('unboxing.feature2.description', { defaultValue: 'Cutting-edge heating technology delivers consistent performance with precision temperature control for the perfect experience every time.' })}
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard delay={0.4} cardIndex={2} onInView={onCardInView}>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{
              color: 'var(--campaign-primary)',
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}>
              {t('unboxing.feature3.title', { defaultValue: 'Smart Features' })}
            </h3>
            <p className="text-white text-xl md:text-2xl leading-relaxed" style={{
              lineHeight: '1.6',
              fontWeight: 500
            }}>
              Intelligent sensors and adaptive heating ensure optimal performance while maximizing battery efficiency and device longevity.
            </p>
          </LiquidGlassCard>

          <LiquidGlassCard delay={0.5} cardIndex={3} onInView={onCardInView}>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{
              color: 'var(--campaign-primary)',
              letterSpacing: '-0.01em',
              fontWeight: 700
            }}>
              {t('unboxing.feature4.title', { defaultValue: 'Easy to Use' })}
            </h3>
            <p className="text-white text-xl md:text-2xl leading-relaxed" style={{
              lineHeight: '1.6',
              fontWeight: 500
            }}>
              {t('unboxing.feature4.description', { defaultValue: 'Intuitive design that just works. No complicated setup, no learning curve. Simply turn on and enjoy.' })}
            </p>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Technical Specs Section */}
      <section className="relative py-20 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto">
          <LiquidGlassCard delay={0.6} cardIndex={4} onInView={onCardInView}>
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--campaign-primary)' }}>
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
              <div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--campaign-primary)' }}>Battery Life</h4>
                <p>Up to 20 sessions per charge</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--campaign-primary)' }}>Charging Time</h4>
                <p>Fully charged in 90 minutes</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--campaign-primary)' }}>Temperature Range</h4>
                <p>Precision heating: 300-350°C</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--campaign-primary)' }}>Dimensions</h4>
                <p>117.2 x 46.3 x 22.4 mm</p>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* What's in the Box Section */}
      <section className="relative py-20 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto">
          <LiquidGlassCard delay={0.7} cardIndex={5} onInView={onCardInView}>
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--campaign-primary)' }}>
              What's in the Box
            </h2>
            <ul className="space-y-4 text-white/90 text-lg">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--campaign-primary)' }} />
                {unitData.products.name}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--campaign-primary)' }} />
                USB-C Charging Cable
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--campaign-primary)' }} />
                User Guide & Quick Start Card
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--campaign-primary)' }} />
                Cleaning Tool & Accessories
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--campaign-primary)' }} />
                Warranty Information
              </li>
            </ul>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="relative py-20 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto space-y-8">
          <LiquidGlassCard delay={0.8} cardIndex={6} onInView={onCardInView}>
            <div className="text-center py-8">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ color: 'var(--campaign-primary)' }}
              >
                {t('unboxing.gettingStarted', { defaultValue: 'Getting Started' })}
              </h2>
              <div className="text-left space-y-6 text-white/90 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--campaign-primary)' }}>
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Charge Your Device</h4>
                    <p className="text-white/70">Connect to power using the included USB-C cable. LED indicator shows charging status.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--campaign-primary)' }}>
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Power On</h4>
                    <p className="text-white/70">Press and hold the button for 2 seconds until the LED lights up.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--campaign-primary)' }}>
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Insert & Enjoy</h4>
                    <p className="text-white/70">Insert your tobacco stick and wait for the vibration indicating it's ready to use.</p>
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Support & Warranty */}
      <section className="relative py-20 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto">
          <LiquidGlassCard delay={0.9} cardIndex={7} onInView={onCardInView}>
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--campaign-primary)' }}>
              Support & Warranty
            </h2>
            <div className="text-white/90 space-y-6">
              <div>
                <h4 className="font-semibold text-xl mb-3" style={{ color: 'var(--campaign-primary)' }}>1-Year Limited Warranty</h4>
                <p className="text-white/80 leading-relaxed">
                  Your {unitData.products.name} comes with a comprehensive 1-year warranty covering manufacturing defects and hardware malfunctions.
                  Register your device within 30 days to activate extended support benefits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-xl mb-3" style={{ color: 'var(--campaign-primary)' }}>24/7 Customer Support</h4>
                <p className="text-white/80 leading-relaxed">
                  Our dedicated support team is available around the clock to assist you. Access live chat, email support,
                  or call our hotline for immediate assistance with setup, troubleshooting, or general questions.
                </p>
              </div>
              <div className="pt-4">
                <button
                  className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--campaign-primary)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Register Your Device
                </button>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </section>

      {/* Campaign Info (Debug) */}
      <section className="relative py-8 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-sm text-white/40 py-2">
            <p>Campaign: {unitData.campaigns.name} | Product: {unitData.products.name}</p>
          </div>
        </div>
      </section>
    </>
  )
}
