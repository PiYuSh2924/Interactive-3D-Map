import React, { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { calculateMarkerPosition } from '../../utils/markerUtils'

export default function Marker({ 
  location, 
  onClick, 
  onHover,
  isSelected = false, 
  globeRef 
}) {
  const markerRef = useRef()
  const hoverAreaRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()
  const timeoutRef = useRef(null)

  const position = useMemo(() => 
    calculateMarkerPosition(location.latitude, location.longitude, 1), 
    [location.latitude, location.longitude]
  )

  useFrame(() => {
    if (markerRef.current && hoverAreaRef.current) {
      const distance = camera.position.distanceTo(markerRef.current.position)
      const scale = distance * 0.12
      markerRef.current.scale.set(scale, scale, scale)
      
      const hoverScale = scale * 2.5
      hoverAreaRef.current.scale.set(hoverScale, hoverScale, hoverScale)
    }
  })

  const handlePointerOver = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setHovered(true)
    onHover?.(location)
  }, [location, onHover])

  const handlePointerOut = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHovered(false)
      onHover?.(null)
    }, 800)
  }, [onHover])

  const handleClick = (e) => {
    e.stopPropagation()
    onClick(location)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <group position={position} renderOrder={20}>
      {/* Invisible hover area */}
      <mesh 
        ref={hoverAreaRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visible marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#ff8844" : "#ff4444"}
          emissive={hovered ? "#ff8844" : "#ff4444"}
          emissiveIntensity={0.5}
          transparent={true}
          opacity={1}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
    </group>
  )
}
