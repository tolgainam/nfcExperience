import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Helper function to convert degrees to radians
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180

interface ModelViewerProps {
  modelUrl: string
  autoRotate?: boolean
  enableZoom?: boolean
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  // Optional product data - if provided, will override scale, position, and rotation
  productScale?: number
  productPositionX?: number
  productPositionY?: number
  productPositionZ?: number
  productRotationX?: number
  productRotationY?: number
  productRotationZ?: number
}

function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: { url: string; scale?: number; position?: [number, number, number]; rotation?: [number, number, number] }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  // Convert rotation from degrees to radians
  const rotationRadians: [number, number, number] = [
    degreesToRadians(rotation[0]),
    degreesToRadians(rotation[1]),
    degreesToRadians(rotation[2])
  ]

  // Auto-rotate the model slowly (adds to base rotation)
  useFrame((_state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = rotationRadians[1] + delta * 0.2
    }
  })

  return (
    <group ref={modelRef} scale={scale} position={position} rotation={rotationRadians}>
      <primitive object={scene} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0066CC" wireframe />
    </mesh>
  )
}

export default function ModelViewer({
  modelUrl,
  autoRotate = true,
  enableZoom = false,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  productScale,
  productPositionX,
  productPositionY,
  productPositionZ,
  productRotationX,
  productRotationY,
  productRotationZ,
}: ModelViewerProps) {
  // Use product data if provided, otherwise fall back to manual props
  const effectiveScale = productScale ?? scale
  const effectivePosition: [number, number, number] =
    (productPositionX !== undefined && productPositionY !== undefined && productPositionZ !== undefined)
      ? [productPositionX, productPositionY, productPositionZ]
      : position
  const effectiveRotation: [number, number, number] =
    (productRotationX !== undefined && productRotationY !== undefined && productRotationZ !== undefined)
      ? [productRotationX, productRotationY, productRotationZ]
      : rotation

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* 3D Model with loading fallback */}
        <Suspense fallback={<LoadingFallback />}>
          <Model url={modelUrl} scale={effectiveScale} position={effectivePosition} rotation={effectiveRotation} />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom={enableZoom}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}

// Preload model for better performance
export function preloadModel(url: string) {
  useGLTF.preload(url)
}
