# Scroll-Based 3D Animations Cheat Sheet

This guide shows you how to connect scroll position to various 3D scene properties in your React Three Fiber + Framer Motion setup.

## Setup Required

Make sure you have scroll progress available:
```jsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start']
})
```

Pass it to your 3D components and access it in `useFrame`:
```jsx
useFrame(() => {
  const progress = scrollYProgress.get() // Returns 0 to 1
  // Apply animations here
})
```

---

## 🎨 Model Transformations

### Rotation
```jsx
// Single axis rotation (Y-axis = spin)
groupRef.current.rotation.y = scrollYProgress.get() * Math.PI * 2 // Full 360°

// Multiple rotations
groupRef.current.rotation.y = scrollYProgress.get() * Math.PI * 4 // 2 full spins

// Multi-axis rotation
groupRef.current.rotation.x = scrollYProgress.get() * Math.PI // Pitch
groupRef.current.rotation.y = scrollYProgress.get() * Math.PI * 2 // Yaw
groupRef.current.rotation.z = scrollYProgress.get() * Math.PI // Roll
```

### Scale (Zoom/Size)
```jsx
// Uniform scale (all axes)
groupRef.current.scale.setScalar(1 + scrollYProgress.get() * 2) // Grows 1x to 3x

// Zoom in then out (using sine wave)
const scale = 1 + Math.sin(scrollYProgress.get() * Math.PI) * 0.5

// Individual axes
groupRef.current.scale.x = 1 + scrollYProgress.get() // Stretch horizontally
groupRef.current.scale.y = 1 + scrollYProgress.get() // Stretch vertically
```

### Position (Movement)
```jsx
// Linear movement
groupRef.current.position.x = scrollYProgress.get() * 5 // Move right
groupRef.current.position.y = scrollYProgress.get() * 3 // Move up
groupRef.current.position.z = scrollYProgress.get() * 2 // Move forward

// Arc/curved motion
groupRef.current.position.y = Math.sin(scrollYProgress.get() * Math.PI) * 2

// Circle path
const angle = scrollYProgress.get() * Math.PI * 2
groupRef.current.position.x = Math.cos(angle) * 3
groupRef.current.position.z = Math.sin(angle) * 3
```

---

## 💡 Lighting

### Light Intensity
```jsx
<SpotLightWithTarget
  intensity={scrollYProgress.get() * 20} // 0 to 20
/>

// Fade in then out
<spotLight
  intensity={Math.sin(scrollYProgress.get() * Math.PI) * 10}
/>

// Threshold-based (sudden change at 50%)
<spotLight
  intensity={scrollYProgress.get() > 0.5 ? 20 : 5}
/>
```

### Animated Point Lights

```jsx
// Component (define once)
function AnimatedPointLight({
  scrollYProgress,
  basePosition,
  animateX = 0,
  animateY = 0,
  animateZ = 0,
  ...props
}: any) {
  const ref = useRef<any>()

  useFrame(() => {
    if (ref.current && scrollYProgress) {
      const p = scrollYProgress.get()
      ref.current.position.x = basePosition[0] + animateX * p
      ref.current.position.y = basePosition[1] + animateY * p
      ref.current.position.z = basePosition[2] + animateZ * p
    }
  })

  return <pointLight ref={ref} position={basePosition} {...props} />
}

// Usage - Linear movement
<AnimatedPointLight
  scrollYProgress={scrollYProgress}
  basePosition={[-3, 2, 1]}
  animateX={6}  // Moves 6 units right
  animateY={2}  // Moves 2 units up
  intensity={5}
  color="#4da6ff"
/>

// Usage - Circle orbit
<AnimatedPointLight
  scrollYProgress={scrollYProgress}
  basePosition={[0, 2, 0]}
  animateX={Math.cos(scrollYProgress.get() * Math.PI * 2) * 5}
  animateZ={Math.sin(scrollYProgress.get() * Math.PI * 2) * 5}
  intensity={8}
  color="#ffffff"
/>
```

### Light Color
```jsx
// Binary color change
const lightColor = scrollYProgress.get() > 0.5 ? "#ff0000" : "#ffffff"

// RGB interpolation (requires helper function)
const r = Math.floor(scrollYProgress.get() * 255)
const lightColor = `rgb(${r}, 0, 0)` // Fades from black to red
```

### Ambient Light
```jsx
<ambientLight intensity={0.1 + scrollYProgress.get() * 0.5} /> // 0.1 to 0.6
```

---

## 🎭 Camera

### Camera Position (Zoom)
```jsx
<PerspectiveCamera
  position={[0, 0, 15 - scrollYProgress.get() * 10]} // Zooms from 15 to 5
/>

// Dolly zoom effect
<PerspectiveCamera
  position={[0, 0, 15 - scrollYProgress.get() * 5]}
  fov={50 + scrollYProgress.get() * 30}
/>
```

### Field of View
```jsx
<PerspectiveCamera
  fov={50 + scrollYProgress.get() * 30} // 50° to 80° (wider = more dramatic)
/>
```

---

## 🌈 Materials

### Material Properties
```jsx
<meshStandardMaterial
  roughness={0.9 - scrollYProgress.get() * 0.5} // Gets shinier (0.9 to 0.4)
  metalness={scrollYProgress.get()} // Gets more metallic (0 to 1)
  envMapIntensity={scrollYProgress.get() * 2} // More reflective
/>
```

### Opacity/Transparency
```jsx
<meshStandardMaterial
  transparent
  opacity={1 - scrollYProgress.get()} // Fades out
/>

// Fade in then out
<meshStandardMaterial
  transparent
  opacity={Math.sin(scrollYProgress.get() * Math.PI)}
/>
```

### Color
```jsx
// Conditional color
const color = scrollYProgress.get() > 0.5 ? "#ff0000" : "#0000ff"
<meshStandardMaterial color={color} />

// Grayscale to color
const gray = Math.floor(scrollYProgress.get() * 255)
<meshStandardMaterial color={`rgb(${gray}, ${gray}, ${gray})`} />
```

---

## 🎬 Environment

### Background Color
```jsx
// In your component's div style
style={{
  background: `rgb(${scrollYProgress.get() * 255}, 0, 0)` // Black to red
}}

// Gradient background
style={{
  background: `linear-gradient(180deg,
    hsl(${scrollYProgress.get() * 360}, 70%, 50%) 0%,
    #000 100%)`
}}
```

### Environment Intensity
```jsx
<Environment
  preset="studio"
  background={false}
  environmentIntensity={scrollYProgress.get() * 0.5} // 0 to 0.5
/>
```

### Background Plane Position
```jsx
<mesh position={[0, 0, -4 - scrollYProgress.get() * 3]} receiveShadow>
  <planeGeometry args={[50, 50]} />
</mesh>
```

---

## 🔥 Advanced Combinations

### Full Product Reveal
```jsx
useFrame(() => {
  const progress = scrollYProgress.get()

  // Rotation
  groupRef.current.rotation.y = progress * Math.PI * 2

  // Scale in
  groupRef.current.scale.setScalar(0.5 + progress * 0.5)

  // Move up
  groupRef.current.position.y = (1 - progress) * -2
})
```

### Timeline-Based (Different Effects at Different Points)

Use Framer Motion's `useTransform` for more control:

```jsx
// In your component (outside Canvas)
const modelRotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, Math.PI, Math.PI * 2])
const modelScale = useTransform(scrollYProgress, [0, 0.3, 1], [1, 2, 1])
const lightIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [5, 20, 5])

// Pass to Model
<Model rotation={modelRotation} scale={modelScale} />

// In Model component (inside useFrame)
groupRef.current.rotation.y = rotation.get()
groupRef.current.scale.setScalar(scale.get())
```

### Wave Motion
```jsx
useFrame(() => {
  const progress = scrollYProgress.get()

  // Floating effect
  groupRef.current.position.y = Math.sin(progress * Math.PI * 4) * 0.5

  // Pulsing scale
  groupRef.current.scale.setScalar(1 + Math.sin(progress * Math.PI * 8) * 0.1)
})
```

### Parallax Layers
```jsx
// Foreground object (moves fast)
foregroundRef.current.position.z = scrollYProgress.get() * 10

// Background object (moves slow)
backgroundRef.current.position.z = scrollYProgress.get() * 2
```

### Color Transition
```jsx
useFrame(() => {
  const progress = scrollYProgress.get()

  // HSL color wheel
  const hue = progress * 360
  materialRef.current.color.setHSL(hue / 360, 0.7, 0.5)
})
```

---

## 📊 Useful Math Helpers

```jsx
// Linear interpolation
const lerp = (start, end, progress) => start + (end - start) * progress

// Ease in/out
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

// Clamp value between min and max
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// Map value from one range to another
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// Usage examples:
groupRef.current.position.x = lerp(-5, 5, scrollYProgress.get())
groupRef.current.rotation.y = easeInOut(scrollYProgress.get()) * Math.PI * 2
```

---

## 🎯 Performance Tips

1. **Use `scrollYProgress.get()`** inside `useFrame`, not `.subscribe()`
2. **Avoid heavy calculations** every frame - cache values when possible
3. **Use `useTransform`** for complex interpolations (handled by Framer Motion)
4. **Throttle updates** if needed:
```jsx
let lastUpdate = 0
useFrame((state) => {
  if (state.clock.elapsedTime - lastUpdate > 0.016) { // ~60fps
    // Update logic here
    lastUpdate = state.clock.elapsedTime
  }
})
```

---

## 🎨 Quick Copy-Paste Examples

### Example 1: Dramatic Product Reveal
```jsx
useFrame(() => {
  const p = scrollYProgress.get()
  groupRef.current.rotation.y = p * Math.PI * 2
  groupRef.current.scale.setScalar(0.5 + p * 1.5)
  groupRef.current.position.y = (1 - p) * -3
})
```

### Example 2: Focus Pull (Camera Zoom + Rotate)
```jsx
<PerspectiveCamera position={[0, 0, 15 - scrollYProgress.get() * 8]} />
// In Model:
groupRef.current.rotation.y = scrollYProgress.get() * Math.PI
```

### Example 3: Light Show
```jsx
const progress = scrollYProgress.get()
<SpotLightWithTarget
  intensity={5 + Math.sin(progress * Math.PI * 4) * 10}
  color={progress > 0.5 ? "#ff0000" : "#ffffff"}
  position={[Math.cos(progress * Math.PI * 2) * 5, 5, Math.sin(progress * Math.PI * 2) * 5]}
/>
```

### Example 4: Material Transform
```jsx
// In useFrame or as props:
<meshStandardMaterial
  roughness={0.9 - scrollYProgress.get() * 0.6}
  metalness={scrollYProgress.get() * 0.8}
  transparent
  opacity={Math.sin(scrollYProgress.get() * Math.PI)}
/>
```

---

## 📝 Notes

- `scrollYProgress.get()` returns **0 at top**, **1 at bottom**
- `Math.PI` = 180°, `Math.PI * 2` = 360°
- Use `useTransform` for smoother, eased animations
- Test on actual devices - scroll behavior varies!
- Consider accessibility - don't make scroll mandatory for viewing content

---

**Happy Scrolling! 🎢**
