import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { calculateMarkerPosition } from '../../utils/markerUtils';

export default function UserLocationMarker({ location }) {
  const markerRef = useRef();
  const { camera } = useThree();

  const position = calculateMarkerPosition(location.latitude, location.longitude, 1);

  useFrame(() => {
    if (markerRef.current) {
      const distance = camera.position.distanceTo(markerRef.current.position);
      const scale = distance * 0.12;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position} renderOrder={20}>
      {/* Pin head - increased size and adjusted colors */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* Pin point - adjusted to match head size */}
      <mesh position={[0, -0.025, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.01, 0.02, 8]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* Add glow effect */}
      <mesh>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color="#4ade80"
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
} 