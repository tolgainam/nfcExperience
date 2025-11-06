import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ModelViewerProps {
  modelUrl: string
  autoRotate?: boolean
  enableZoom?: boolean
  scale?: number
  position?: [number, number, number]
}

function Model({ url, scale = 1, position = [0, 0, 0] }: { url: string; scale?: number; position?: [number, number, number] }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  // Auto-rotate the model slowly
  useFrame((_state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={modelRef} scale={scale} position={position}>
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
}: ModelViewerProps) {
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
          <Model url={modelUrl} scale={scale} position={position} />
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
