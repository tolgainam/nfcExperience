/**
 * GradientText Component
 *
 * A lightweight gradient text component with animation and glow effects.
 * Uses CSS background-clip: text technique for gradient rendering.
 *
 * FEATURES:
 * - 3-color gradient stops
 * - Optional animation (smooth color shifting)
 * - Optional glow effect (using first gradient color)
 * - Responsive font sizes (using clamp)
 * - Configurable direction and alignment
 *
 * USAGE:
 * ```tsx
 * <GradientText
 *   colors={['#c9964a', '#d4a556', '#f5e6c8']}
 *   fontSize="xlarge"
 *   animate={true}
 *   glow={true}
 *   textAlign="center"
 * >
 *   Forever Curious
 * </GradientText>
 * ```
 */

import React, { useMemo } from 'react'

interface GradientTextProps {
  children: React.ReactNode
  colors: [string, string, string] // Exactly 3 colors
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'poster'
  animate?: boolean
  animationDuration?: string // Default: '3s'
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  textAlign?: 'left' | 'center' | 'right'
  glow?: boolean // Enable glow effect
  className?: string
}

export default function GradientText({
  children,
  colors,
  fontSize = 'medium',
  animate = false,
  animationDuration = '3s',
  direction = 'horizontal',
  textAlign = 'left',
  glow = false,
  className = ''
}: GradientTextProps) {
  // Generate unique ID for this instance to avoid animation conflicts
  const uniqueId = useMemo(() => Math.random().toString(36).substring(2, 11), [])

  // Font size mapping using clamp for responsive typography
  const fontSizeMap = {
    small: 'clamp(16px, 3vw, 24px)',
    medium: 'clamp(24px, 5vw, 40px)',
    large: 'clamp(40px, 8vw, 64px)',
    xlarge: 'clamp(64px, 12vw, 96px)',
    poster: 'clamp(80px, 15vw, 120px)'
  }

  // Direction to CSS gradient direction mapping
  const directionMap = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: '135deg'
  }

  const gradientDirection = directionMap[direction]
  const [color1, color2, color3] = colors

  // Build gradient color string
  const gradientColors = `${color1}, ${color2}, ${color3}`

  // Build glow effect using drop-shadow filters
  const glowFilter = glow
    ? `drop-shadow(0 0 10px ${color1}40) drop-shadow(0 0 20px ${color1}30) drop-shadow(0 0 30px ${color1}20)`
    : 'none'

  // Generate CSS for gradient and animation
  const gradientCSS = `
    .gradient-text-${uniqueId} {
      background: linear-gradient(${gradientDirection}, ${gradientColors});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
      font-size: ${fontSizeMap[fontSize]};
      text-align: ${textAlign};
      filter: ${glowFilter};
      font-family: var(--font-heading);
      font-weight: 700;
      ${animate ? `
        background-size: 200% 200%;
        animation: gradientShift-${uniqueId} ${animationDuration} ease infinite;
      ` : ''}
    }

    ${animate ? `
      @keyframes gradientShift-${uniqueId} {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    ` : ''}

    /* Fallback for browsers that don't support background-clip: text */
    @supports not (-webkit-background-clip: text) {
      .gradient-text-${uniqueId} {
        color: ${color1};
        -webkit-text-fill-color: initial;
      }
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: gradientCSS }} />
      <div className={`gradient-text-${uniqueId} ${className}`}>
        {children}
      </div>
    </>
  )
}
