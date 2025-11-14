/**
 * ProductShowcaseExample
 *
 * Example usage of the ProductShowcase component with Figma assets.
 * This shows how to integrate the showcase into different sections.
 *
 * USAGE:
 * Import this component and add it to any section of your page:
 * ```tsx
 * import ProductShowcaseExample from './ProductShowcaseExample'
 *
 * // In your page component:
 * <ProductShowcaseExample />
 * ```
 *
 * You can also create multiple variations by passing different props
 * to the ProductShowcase component directly.
 */

import React from 'react'
import ProductShowcase from './ProductShowcase'

// Figma asset URLs (valid for 7 days from generation)
const assets = {
  logo: "https://www.figma.com/api/mcp/asset/d2636562-8ed0-47e7-88f5-a160663c2fae",
  heroImage: "https://www.figma.com/api/mcp/asset/2022b201-a8ef-4fe4-9d0b-e31f3c3e26ca",
  galleryImages: [
    "https://www.figma.com/api/mcp/asset/df85fbf3-900a-4865-be00-19b4e622acc8",
    "https://www.figma.com/api/mcp/asset/bdd3d519-dd34-4edc-90ac-71253f887321",
    "https://www.figma.com/api/mcp/asset/53b892e7-5af4-48e3-9e18-cd2bcb501a0a",
    "https://www.figma.com/api/mcp/asset/556194d2-92e3-4418-bd73-8cb87d574540"
  ] as [string, string, string, string],
  productRender: "https://www.figma.com/api/mcp/asset/92e06489-fbdb-40af-a15b-c10a01c44a81",
  largeProductImage: "https://www.figma.com/api/mcp/asset/b7243a0f-943a-40a2-b361-d9e2403403a5"
}

export default function ProductShowcaseExample() {
  return (
    <ProductShowcase
      logoUrl="/lelogo.png"
      heroImageUrl={assets.heroImage}
      partnerName="Seletti"
      partnerDescription="Seletti transforms ordinary objects into extraordinary pieces that bring humor, charm and bold aesthetic to everyday life."
      galleryImages={assets.galleryImages}
      productRenderUrl="/still_001.png"
      largeImageUrl="/devices.png"
      taglineImageUrl="/foreverCurious.png"
      closingText="Whichever you choose, you're stepping into a world where every detail waits to be discovered."
      primaryCtaText="Registration"
      primaryCtaLink="/register"
      secondaryCtaText="Discover All"
      secondaryCtaLink="/products"
      registrationHeading="Register your device"
    />
  )
}
