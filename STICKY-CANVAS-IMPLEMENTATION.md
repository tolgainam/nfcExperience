# Sticky Canvas Implementation Guide

## Changes needed in UnboxingExperience.tsx

Replace the current layout (lines 46-144) with this structure:

```tsx
return (
  <div ref={containerRef} className="relative" style={{ position: 'relative', background: '#0a0a0a', width: '100%' }}>
    {/* Sticky 3D Canvas Background - sticks for 200vh then scrolls away */}
    <div style={{ position: 'relative', height: '200vh' }}>
      <div
        style={{
          position: 'sticky',
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
            scrollYProgress={scrollYProgress}
          />
        </motion.div>
      </div>
    </div>

    {/* Hero Section - overlays the sticky canvas */}
    <motion.section
      style={{
        opacity: heroOpacity,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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

    {/* Features Section with Parallax */}
    <section className="relative py-20 px-4" style={{ zIndex: 20 }}>
      {/* existing feature cards... */}
    </section>

    {/* Getting Started CTA */}
    <section className="relative py-20 px-4 bg-gray-50" style={{ zIndex: 20 }}>
      {/* existing CTA content... */}
    </section>

    {/* Campaign Info (Debug) */}
    <div className="py-4 px-4 bg-gray-100 text-center text-sm text-gray-500" style={{ zIndex: 20, position: 'relative' }}>
      <p>Campaign: {unitData.campaigns.name} | Product: {unitData.campaigns.name}</p>
    </div>
  </div>
)
```

## Key Changes:

1. **Sticky Container**: Outer div with `height: '200vh'` creates scroll range
2. **Sticky Canvas**: Inner div with `position: 'sticky'` makes canvas stick during scroll
3. **Hero Overlay**: Changed from `position: 'relative'` to `position: 'absolute'` with `top: 0`
4. **Z-Index Management**: Canvas at z-0, hero at z-10, content sections at z-20
5. **Scroll Behavior**: Canvas sticks for 200vh (2x viewport height), then scrolls away

## How it works:

- User scrolls down → Canvas sticks in place
- Content scrolls over the canvas
- Model continues to rotate with scroll
- After 200vh of scrolling → Canvas starts scrolling away
- Content sections become fully visible

## Adjustments:

- Change `height: '200vh'` to control how long canvas sticks
- Adjust z-index values if needed for layering
- Add semi-transparent backgrounds to content sections for readability
