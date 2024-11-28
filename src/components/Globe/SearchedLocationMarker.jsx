import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { calculateMarkerPosition } from '../../utils/markerUtils';

export default function SearchedLocationMarker({ location }) {
  const markerRef = useRef();
  const { camera } = useThree();

  const position = calculateMarkerPosition(location.latitude, location.longitude, 1);

  useFrame(() => {
    if (markerRef.current) {
      const distance = camera.position.distanceTo(markerRef.current.position);
      const scale = distance * 0.15;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position} renderOrder={20}>
      {/* Main marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* Pin point */}
      <mesh position={[0, -0.03, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.012, 0.025, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.8}
          transparent={true}
          opacity={1}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
} 