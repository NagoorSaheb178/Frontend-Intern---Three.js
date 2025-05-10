"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

// Main component that sets up the scene
export default function ObjectHighlighter() {
  return (
    <Canvas
      gl={{
        antialias: true,
        stencil: true, // Enable stencil buffer
        alpha: false,
        preserveDrawingBuffer: true,
      }}
      camera={{ position: [0, 5, 10], fov: 45 }}
    >
      <color attach="background" args={["#f0f0f0"]} />
      <Scene />
      <OrbitControls makeDefault />
    </Canvas>
  )
}

// Scene component containing all objects and lighting
function Scene() {
  const [selectedObject, setSelectedObject] = useState(null)

  // Handle object selection
  const handleClick = (event) => {
    if (event.object.userData.selectable) {
      setSelectedObject(event.object.uuid === selectedObject ? null : event.object.uuid)
    } else {
      setSelectedObject(null)
    }
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Objects */}
      <SelectableObject
        position={[-4, 0, -2]}
        selectedId={selectedObject}
        onClick={handleClick}
        geometry={<boxGeometry args={[2, 2, 2]} />}
        color="#ff6b6b"
      />
      <SelectableObject
        position={[0, 0, 0]}
        selectedId={selectedObject}
        onClick={handleClick}
        geometry={<sphereGeometry args={[1.2, 32, 32]} />}
        color="#4ecdc4"
      />
      <SelectableObject
        position={[4, 0, 2]}
        selectedId={selectedObject}
        onClick={handleClick}
        geometry={<coneGeometry args={[1, 2, 32]} />}
        color="#ffbe0b"
      />
      <SelectableObject
        position={[-2, 0, 4]}
        selectedId={selectedObject}
        onClick={handleClick}
        geometry={<torusGeometry args={[1, 0.4, 16, 32]} />}
        color="#8338ec"
      />
      <SelectableObject
        position={[3, 0, -4]}
        selectedId={selectedObject}
        onClick={handleClick}
        geometry={<tetrahedronGeometry args={[1.5]} />}
        color="#3a86ff"
      />
    </>
  )
}

// Selectable object component with stencil buffer highlighting
function SelectableObject({ position, selectedId, onClick, geometry, color }) {
  const meshRef = useRef()
  const outlineRef = useRef()
  const { gl, scene, camera } = useThree()

  // Generate a unique ID for this object
  const uuid = useRef(THREE.MathUtils.generateUUID()).current
  const isSelected = selectedId === uuid

  // Set up the object for selection
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.selectable = true
      meshRef.current.uuid = uuid
    }
  }, [uuid])

  // Handle stencil buffer rendering
  useFrame(() => {
    if (!meshRef.current || !outlineRef.current) return

    // Update outline position to match the object
    outlineRef.current.position.copy(meshRef.current.position)
    outlineRef.current.rotation.copy(meshRef.current.rotation)
    outlineRef.current.scale.copy(meshRef.current.scale).multiplyScalar(1.05)

    // Only show outline if this object is selected
    outlineRef.current.visible = isSelected
  })

  return (
    <>
      {/* Main object */}
      <mesh
        ref={meshRef}
        position={position}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          onClick(e)
        }}
      >
        {geometry}
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Outline object (rendered with stencil buffer) */}
      <mesh ref={outlineRef} position={position}>
        {geometry}
        <StencilOutlineMaterial />
      </mesh>
    </>
  )
}

// Custom material for the outline effect using stencil buffer
function StencilOutlineMaterial() {
  const materialRef = useRef()

  useEffect(() => {
    if (!materialRef.current) return

    // Configure stencil operations
    materialRef.current.stencilWrite = true
    materialRef.current.stencilRef = 1
    materialRef.current.stencilFunc = THREE.NotEqualStencilFunc
    materialRef.current.stencilFail = THREE.ReplaceStencilOp
    materialRef.current.stencilZFail = THREE.ReplaceStencilOp
    materialRef.current.stencilZPass = THREE.ReplaceStencilOp
  }, [])

  return (
    <meshBasicMaterial
      ref={materialRef}
      color="#ffffff"
      side={THREE.BackSide}
      transparent={true}
      opacity={0.8}
      depthTest={false}
    />
  )
}
