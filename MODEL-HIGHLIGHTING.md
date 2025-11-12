# 3D Model Highlighting System

This document explains how the card-to-model highlighting system works in the unboxing experience.

## Overview

As users scroll through content cards, specific parts of the 3D device model highlight to draw attention to the features being discussed. This creates a synchronized visual experience between the content and the 3D model.

## How It Works

### 1. Card Visibility Tracking

Each `LiquidGlassCard` component tracks when it enters/exits the viewport using Framer Motion's `onViewportEnter` and `onViewportLeave` callbacks.

```jsx
<motion.div
  onViewportEnter={handleViewportEnter}  // Card enters viewport from bottom
  onViewportLeave={handleViewportLeave}  // Card leaves viewport
>
```

### 2. State Management

- Each card has a unique `cardIndex` (0-7)
- When a card enters viewport, it calls `onCardInView(cardIndex)`
- When a card leaves viewport, it calls `onCardInView(null)`
- The parent component (`UnboxingExperience`) maintains `activeCardIndex` state

```jsx
const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)

const handleCardInView = (cardIndex: number | null) => {
  setActiveCardIndex(cardIndex)
}
```

### 3. Model Highlighting

The `Model` component receives `activeCardIndex` and applies emissive highlighting to the corresponding mesh:

```jsx
// In useFrame loop
meshRefs.current.forEach((mesh, index) => {
  if (activeCardIndex !== null && index === activeCardIndex) {
    // Highlight this mesh
    mesh.material.emissive.setHex(0x4da6ff)  // Blue glow
    mesh.material.emissiveIntensity = 0.5
  } else {
    // Reset to original
    mesh.material.emissive.setHex(0x000000)
    mesh.material.emissiveIntensity = 0
  }
})
```

## Card to Mesh Mapping

The mapping between cards and model meshes is based on index:

- **Card 0** (Premium Design) → Mesh 0 (e.g., device body)
- **Card 1** (Advanced Technology) → Mesh 1 (e.g., heating chamber)
- **Card 2** (Smart Features) → Mesh 2 (e.g., LED indicator)
- **Card 3** (Easy to Use) → Mesh 3 (e.g., button)
- **Card 4** (Technical Specs) → Mesh 4
- **Card 5** (What's in Box) → Mesh 5
- **Card 6** (Getting Started) → Mesh 6
- **Card 7** (Support) → Mesh 7

### Customizing Mesh Mapping

To highlight specific model parts for each card, you need to:

1. **Inspect your 3D model** to identify mesh names/indices
2. **Create a mapping object** to associate cards with specific meshes:

```jsx
const CARD_TO_MESH_MAP = {
  0: 'Body',           // Card 0 highlights the "Body" mesh
  1: 'HeatingChamber', // Card 1 highlights "HeatingChamber"
  2: 'LEDIndicator',   // Card 2 highlights "LEDIndicator"
  3: 'PowerButton',    // etc.
  // ...
}
```

3. **Update the highlighting logic** to use mesh names instead of indices:

```jsx
meshRefs.current.forEach((mesh) => {
  const targetMeshName = CARD_TO_MESH_MAP[activeCardIndex]
  if (activeCardIndex !== null && mesh.name === targetMeshName) {
    mesh.material.emissive.setHex(0x4da6ff)
    mesh.material.emissiveIntensity = 0.5
  } else {
    // Reset
  }
})
```

## Debugging

To see which meshes are in your model:

```jsx
scene.traverse((child: any) => {
  if (child.isMesh) {
    console.log('Mesh found:', child.name, 'Index:', meshRefs.current.length)
    meshRefs.current.push(child)
  }
})
```

Check browser console when model loads to see all available mesh names and their indices.

## Customization Options

### Change Highlight Color

```jsx
mesh.material.emissive.setHex(0xff0000)  // Red glow
mesh.material.emissive.setHex(0x00ff00)  // Green glow
```

### Change Highlight Intensity

```jsx
mesh.material.emissiveIntensity = 0.3  // Subtle glow
mesh.material.emissiveIntensity = 1.0  // Strong glow
```

### Add Smooth Transitions

Use lerp (linear interpolation) for smooth intensity transitions:

```jsx
const targetIntensity = (activeCardIndex === index) ? 0.5 : 0
mesh.material.emissiveIntensity += (targetIntensity - mesh.material.emissiveIntensity) * 0.1
```

### Highlight Multiple Meshes per Card

```jsx
const CARD_TO_MESHES_MAP = {
  0: ['Body', 'Cap'],           // Card 0 highlights both body and cap
  1: ['HeatingChamber', 'Coil'], // Card 1 highlights chamber and coil
}

meshRefs.current.forEach((mesh) => {
  const targetMeshNames = CARD_TO_MESHES_MAP[activeCardIndex] || []
  if (activeCardIndex !== null && targetMeshNames.includes(mesh.name)) {
    // Highlight
  }
})
```

## Card Fade-Out Behavior

Cards fade out as they scroll past the middle of the screen using `useTransform`:

```jsx
const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [1, 1, 0.3, 0])
```

- **0 → 0.5**: Card is fully visible (opacity = 1)
- **0.5 → 0.8**: Card starts fading (opacity = 1 → 0.3)
- **0.8 → 1**: Card fully fades (opacity = 0.3 → 0)

## 3D Canvas Position

The 3D canvas uses `position: fixed` to stay visible throughout the entire page:

```jsx
<div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh' }}>
  <Canvas>...</Canvas>
</div>
```

This ensures the device remains visible as content scrolls over it.
