/**
 * ProductShowcase Component
 *
 * PURPOSE:
 * A reusable vertical product showcase section featuring hero images, brand collaboration
 * story, product gallery, 3D renders, and call-to-action buttons. Designed for luxury
 * product presentations with rich visual content.
 *
 * HOW TO USE:
 * ```tsx
 * <ProductShowcase
 *   logoUrl="/path/to/logo.svg"
 *   heroImageUrl="/path/to/hero.jpg"
 *   partnerName="Seletti"
 *   partnerDescription="Seletti transforms ordinary objects into extraordinary pieces..."
 *   galleryImages={[img1, img2, img3, img4]}
 *   productRenderUrl="/path/to/3d-render.jpg"
 *   largeImageUrl="/path/to/large-product.jpg"
 *   tagline1="Forever"
 *   tagline2="Curious"
 *   closingText="Whichever you choose, you're stepping into a world..."
 *   primaryCtaText="Registration"
 *   primaryCtaLink="/register"
 *   primaryCtaFullWidth={false}
 *   secondaryCtaText="Discover All"
 *   secondaryCtaLink="/products"
 *   secondaryCtaFullWidth={false}
 * />
 * ```
 *
 * CUSTOMIZATION:
 * - All images can be replaced via props
 * - Text content is fully customizable
 * - CTA buttons accept custom text and links
 * - Button width options: fullWidth (true = fill container, false = hug content)
 * - Layout is responsive (mobile-first)
 *
 * BUTTON OPTIONS:
 * - primaryCtaFullWidth: true = button fills container width, false = hugs content
 * - secondaryCtaFullWidth: true = button fills container width, false = hugs content
 *
 * LAYOUT STRUCTURE:
 * 1. Logo header
 * 2. Hero image (full width)
 * 3. Partner story section (heading + description)
 * 4. 2x2 product gallery grid
 * 5. Large 3D product render
 * 6. Registration CTA
 * 7. Large product detail image
 * 8. Tagline section (Forever Curious)
 * 9. Discover All CTA
 */

import { motion, type Variants } from 'framer-motion'

interface ProductShowcaseProps {
  logoUrl: string
  heroImageUrl: string
  partnerName: string
  partnerDescription: string
  galleryImages: [string, string, string, string] // Exactly 4 images for 2x2 grid
  productRenderUrl: string
  largeImageUrl: string
  taglineImageUrl: string // Image URL for "Forever Curious" or similar tagline
  closingText: string
  primaryCtaText: string
  primaryCtaLink: string
  primaryCtaFullWidth?: boolean
  secondaryCtaText: string
  secondaryCtaLink: string
  secondaryCtaFullWidth?: boolean
  registrationHeading?: string
}

export default function ProductShowcase({
  logoUrl,
  heroImageUrl,
  partnerName,
  partnerDescription,
  galleryImages,
  productRenderUrl,
  largeImageUrl,
  taglineImageUrl,
  closingText,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  secondaryCtaFullWidth = false,
  registrationHeading = 'Register your device'
}: ProductShowcaseProps) {
  // Animation variants for fade in from left
  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  // Animation variants for fade in from right
  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center" style={{ 
      gap: '16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box'
      
      }}>
      {/* Logo Section */}
      <motion.div
        className="relative w-full flex items-center justify-center"
        style={{ padding: '32px 0', 
          
        maxWidth: '100%' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInLeft}
      >
        <img
          src={logoUrl}
          alt="Partner Logo"
          className="h-auto object-contain"
          style={{ maxWidth: '70%', width: '100%' }}
        />
      </motion.div>

      {/* Container 1: Hero Image */}
      <motion.div
        className="relative w-full h-[80vh] md:h-[1227px] overflow-hidden"
        style={{ borderRadius: '24px',
        border: '1px solid #c9964a',
        maxWidth: '100%' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInLeft}
      >
          <div className="absolute left-0 right-0 w-full px-8 my-16 flex flex-col items-center" style={{ 
        
        boxSizing: 'border-box',
        bottom: '0px',
        padding: '32px 0px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        
        
        }}>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-8" style={{ color: '#c9964a', maxWidth: '100%' }}>
          Who is {partnerName}?
        </h2>
        <p className="text-lg md:text-2xl lg:text-4xl font-bold text-center leading-relaxed" style={{ 
          color: '#c9964a', 
          maxWidth: '100%' }}>
          {partnerDescription}
        </p>
      </div>
        <img
          src={heroImageUrl}
          alt="Hero"
          className="w-full h-full object-cover"
          style={{ maxWidth: '100%' }}
        />
        
      </motion.div>



      {/* Container 2: 2x2 Gallery Grid */}
      <motion.div
        className="relative w-full grid grid-cols-2 gap-0.5 md:gap-1"
        style={{ borderRadius: '24px', 
          maxWidth: '100%',
          overflow: 'hidden' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInRight}
      >
        {galleryImages.map((imageUrl, index) => (
          <div
            key={index}
            className="relative w-full overflow-hidden"
            style={{ height: 'min(550px, 60vw)' }}
          >
            <img
              src={imageUrl}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>

      {/* Container 3: Large 3D Product Render with Registration CTA Overlay */}
      <div className="relative w-full" style={{ borderRadius: '24px' }}>
        <motion.div
          className="relative w-full flex items-center justify-center py-8 md:py-16 px-4"
          style={{ borderRadius: '24px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInLeft}
        >
          <div className="relative w-full max-w-[899px]">
            <img
              src={productRenderUrl}
              alt="Product 3D Render"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Registration Heading + Primary CTA - Positioned on top of 3D render */}
        <div className="absolute flex flex-col items-center justify-center gap-4" style={{ bottom: '64px', left: 0, right: 0, width: '100%' }}>
          {/* Registration Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center" style={{ color: '#f5e6c8' }}>
            {registrationHeading}
          </h2>

          {/* Primary CTA Button */}
          <a
            href={primaryCtaLink}
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold text-black transition-all group no-underline visited:text-black active:text-black"
            style={{
              background: '#c9964a',
              fontSize: 'clamp(20px, 5vw, 35px)',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#000'
            }}
          >
            <span className="relative z-10 font-bold" style={{ color: '#000' }}>{primaryCtaText}</span>
            <span
              className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(212, 165, 86, 0.3) 0%, rgba(212, 165, 86, 0.8) 50%, #d4a556 100%)'
              }}
            />
          </a>
        </div>
      </div>

      {/* Container 4: Large Product Detail Image + Forever Curious + Closing Text */}
      <motion.div
        className="relative w-full flex flex-col items-center"
        style={{ gap: '16px', padding: '32px 0', borderRadius: '24px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInRight}
      >
        {/* Large Product Detail Image */}
        <div className="relative flex items-center justify-center" style={{ width: '80%' }}>
          <img
            src={largeImageUrl}
            alt="Product Detail"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Forever Curious Tagline Section */}
        <img
          src={taglineImageUrl}
          alt="Forever Curious"
          className="h-auto object-contain"
          style={{ width: '80%' }}
        />

        <p className="text-lg md:text-2xl lg:text-4xl font-bold text-center leading-relaxed" style={{ color: '#c9964a', width: '80%' }}>
          {closingText}
        </p>
      </motion.div>

      {/* Container 5: Secondary CTA Button */}
      <motion.div
        className={`relative w-full flex items-center justify-center py-4 md:py-8 pb-8 md:pb-16 ${secondaryCtaFullWidth ? 'px-4' : ''}`}
        style={{ borderRadius: '24px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInLeft}
      >
        <a
          href={secondaryCtaLink}
          className={`relative overflow-hidden flex items-center justify-center rounded-full font-bold transition-all group no-underline visited:text-[#c9964a] active:text-[#c9964a] ${secondaryCtaFullWidth ? 'w-full' : ''}`}
          style={{
            background: 'transparent',
            border: '2px solid #c9964a',
            color: '#c9964a',
            fontSize: 'clamp(20px, 5vw, 35px)',
            padding: '12px 24px',
            textDecoration: 'none'
          }}
        >
          <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-500" style={{ color: 'inherit' }}>{secondaryCtaText}</span>
          <span
            className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
            style={{
              zIndex: 1,
              background: 'linear-gradient(90deg, rgba(201, 150, 74, 0.3) 0%, rgba(201, 150, 74, 0.8) 50%, #c9964a 100%)'
            }}
          />
        </a>
      </motion.div>
    </div>
  )
}
