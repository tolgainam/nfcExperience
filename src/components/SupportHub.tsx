/**
 * SupportHub Component
 *
 * PURPOSE:
 * The return-scan experience shown after the first unboxing. Provides access to
 * product support, accessories, IQOS Connect app, and promotional content.
 *
 * LAYOUT:
 * 1. Hero section with product image and Seletti logo overlay
 * 2. Win IQOS x Seletti organizer card (dark background)
 * 3. Accessories promotion card (with background image)
 * 4. Download IQOS Connect card
 * 5. Get support card (with outlined buttons)
 */

import { motion } from 'framer-motion'
import type { UnitWithRelations } from '../types/database'

interface SupportHubProps {
  unitData: UnitWithRelations
}

export default function SupportHub({ unitData: _unitData }: SupportHubProps) {

  return (
    <div style={{ background: '#0a0a0a', width: '100%', minHeight: '100vh' }}>
      {/* Hero Section with Product Image and Seletti Logo */}
      <div id="heroSection" className="relative w-full" style={{ height: '846px', overflow: 'hidden' }}>
        {/* Product Image with built-in gradient */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <img
            src="/still_002.jpg"
            alt="IQOS ILUMA i"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content Wrapper with Fade In */}
        <motion.div
          className="relative w-full h-full flex flex-col items-center"
          style={{
            zIndex: 3,
            paddingTop: '64px',
            paddingBottom: '64px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          {/* Seletti Logo at Top */}
          <div
            className="flex items-center justify-center"
            style={{
              width: '219px',
              height: '94px'
            }}
          >
            <img
              src="/lelogo.png"
              alt="Seletti Limited Edition"
              className="w-full h-auto object-contain"
              style={{ opacity: 0.9 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Cards Container */}
      <div
      id="cardsContainer"
        className="relative flex flex-col"
        style={{
          width: '100%',
          padding: '24px',
          gap: '12px',
          zIndex: 10
        }}
      >
        {/* Card 1: Win IQOS x Seletti Organizer */}
        <motion.div
        id="card1"
          className="relative w-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(27, 27, 27, 0.2)',
            borderRadius: '10px',
            padding: '12px',
            gap: '12px'
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Gift Icon */}
          <div style={{ width: '64px', height: '64px' }}>
            <img
              src="https://www.figma.com/api/mcp/asset/4d5473a6-c652-4c8e-9656-d931ddb5742f"
              alt="Gift"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h2
            className="text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#c9964a',
              width: '100%'
            }}
          >
            Win an IQOS x Seletti Limited Edition Organizer
          </h2>

          {/* Product Image */}
          <div style={{ width: '100%', maxWidth: '244px', position: 'relative' }}>
            <img
              src="/prize.png"
              alt="IQOS x Seletti Organizer"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* CTA Button */}
          <a
            href="#iqos-club"
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold text-black transition-all group no-underline visited:text-black active:text-black"
            style={{
              background: '#c9964a',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#000',
              width: '213px',
              minHeight: '48px'
            }}
          >
            <span className="relative z-10 font-bold" style={{ color: '#000' }}>
              Login IQOS CLUB
            </span>
            <span
              className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(212, 165, 86, 0.3) 0%, rgba(212, 165, 86, 0.8) 50%, #d4a556 100%)'
              }}
            />
          </a>
        </motion.div>

        {/* Card 2: Accessories Promotion */}
        <motion.div
        id="card2"
          className="relative w-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0)',
            borderRadius: '10px',
            padding: '12px',
            gap: '12px',
            height: '280px',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://www.figma.com/api/mcp/asset/125a0a25-e441-4654-b3e0-f76e005c38cb"
              alt="Accessories"
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center center'
              }}
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 37.841%, #000000 62.276%)'
              }}
            />
          </div>

          {/* Text Content */}
          <p
            className="text-center relative z-10"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#c9964a',
              width: '100%'
            }}
          >
            Gives your device a unique, refined look
          </p>

          {/* CTA Button */}
          <a
            href="#accessories"
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold text-black transition-all group no-underline visited:text-black active:text-black z-10"
            style={{
              background: '#c9964a',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#000',
              width: '213px',
              minHeight: '48px'
            }}
          >
            <span className="relative z-10 font-bold" style={{ color: '#000' }}>
              Explore accesories
            </span>
            <span
              className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(212, 165, 86, 0.3) 0%, rgba(212, 165, 86, 0.8) 50%, #d4a556 100%)'
              }}
            />
          </a>
        </motion.div>

        {/* Card 3: Download IQOS Connect */}
        <motion.div
        id="card3"
          className="relative w-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0)',
            borderRadius: '10px',
            padding: '12px',
            gap: '12px'
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Heading */}
          <h2
            className="text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#c9964a',
              width: '100%'
            }}
          >
            Enhance your experience
          </h2>

          {/* Product Image */}
          <div style={{ width: '100%', maxWidth: '244px', position: 'relative' }}>
            <img
              src="/prize.png"
              alt="IQOS x Seletti Organizer"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* CTA Button with Chevron */}
          <a
            href="#iqos-connect"
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold text-black transition-all group no-underline visited:text-black active:text-black"
            style={{
              background: '#c9964a',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#000',
              minHeight: '48px',
              gap: '12px'
            }}
          >
            <span className="relative z-10 font-bold" style={{ color: '#000' }}>
              Download IQOS Connect
            </span>
            {/* Chevron Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ position: 'relative', zIndex: 10, transform: 'rotate(90deg)' }}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(212, 165, 86, 0.3) 0%, rgba(212, 165, 86, 0.8) 50%, #d4a556 100%)'
              }}
            />
          </a>
        </motion.div>

        {/* Card 4: Get Support */}
        <motion.div
        id="card4"
          className="relative w-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0)',
            borderRadius: '10px',
            padding: '12px',
            gap: '12px'
          }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Heart Icon */}
          <div style={{ width: '32px', height: '32px' }}>
            <img
              src="https://www.figma.com/api/mcp/asset/f2528b69-fdec-442c-aa2d-b2aca65b0fda"
              alt="Support"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h2
            className="text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#c9964a',
              width: '100%'
            }}
          >
            Get support
          </h2>

          {/* Body Text */}
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#c2c2c2',
              width: '100%'
            }}
          >
            Sometimes a quick fix is all it takes, let us help you to troubleshoot your IQOS ILUMA i PRIME device
          </p>

          {/* Outlined Button 1: Device Diagnostics */}
          <a
            href="#diagnostics"
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold transition-all group no-underline visited:text-[#d0d0d0] active:text-[#d0d0d0]"
            style={{
              background: 'transparent',
              border: '2px solid #c9964a',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#d0d0d0',
              width: '213px',
              minHeight: '48px'
            }}
          >
            <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-500" style={{ color: 'inherit' }}>
              Device diagnostics
            </span>
            <span
              className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-in-out origin-left"
              style={{
                zIndex: 1,
                background: 'linear-gradient(90deg, rgba(201, 150, 74, 0.3) 0%, rgba(201, 150, 74, 0.8) 50%, #c9964a 100%)'
              }}
            />
          </a>

          {/* Outlined Button 2: Support Channels */}
          <a
            href="#support"
            className="relative overflow-hidden flex items-center justify-center rounded-full font-bold transition-all group no-underline visited:text-[#d0d0d0] active:text-[#d0d0d0]"
            style={{
              background: 'transparent',
              border: '2px solid #c9964a',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '12px 24px',
              textDecoration: 'none',
              color: '#d0d0d0',
              width: '213px',
              minHeight: '48px'
            }}
          >
            <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-500" style={{ color: 'inherit' }}>
              Support channels
            </span>
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
    </div>
  )
}
