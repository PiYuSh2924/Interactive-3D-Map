import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, Color } from 'three';
import { useLoader } from '@react-three/fiber';
import Marker from './Marker';
import TrajectoryLine from './TrajectoryLine';
import { calculateDistance } from '../../utils/markerUtils';
import UserLocationMarker from './UserLocationMarker';
import * as THREE from 'three';
import SearchedLocationMarker from './SearchedLocationMarker';

export default function Globe({ 
  locations = [], 
  onMarkerClick, 
  onMarkerHover,
  selectedLocation,
  searchedLocation,
  activeLocation,
  userLocation,
  isDragging 
}) {
  const groupRef = useRef();
  const globeRef = useRef();
  const controlsRef = useRef();
  const [isInitialRotation, setIsInitialRotation] = useState(true);
  const { gl, camera } = useThree();
  const earthTexture = useLoader(TextureLoader, '/textures/earth.jpg');

  // Initial auto-rotation
  useFrame(({ clock }) => {
    if (isInitialRotation && groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Stop rotation when user interacts
  useEffect(() => {
    const handleInteraction = () => {
      setIsInitialRotation(false);
    };

    window.addEventListener('pointerdown', handleInteraction);
    return () => window.removeEventListener('pointerdown', handleInteraction);
  }, []);

  // Set up controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.1;
      controlsRef.current.rotateSpeed = 0.5;
      controlsRef.current.zoomSpeed = 0.8;
      controlsRef.current.minDistance = 1.8;
      controlsRef.current.maxDistance = 4;
      controlsRef.current.enablePan = false;
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <OrbitControls 
        ref={controlsRef}
        args={[camera, gl.domElement]}
        makeDefault
        enabled={true}
      />
      
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={2}
        color="#ffffff"
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.7}
        color="#ffffff"
      />

      <mesh ref={globeRef} renderOrder={1}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          metalness={0.1}
          roughness={0.7}
          transparent={false}
        />
      </mesh>

      {locations.map((location) => (
        <Marker
          key={location.name}
          location={location}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
          isSelected={selectedLocation?.name === location.name}
          globeRef={globeRef}
        />
      ))}

      {userLocation && (
        <UserLocationMarker location={userLocation} />
      )}

      {searchedLocation && !locations.find(loc => 
        loc.latitude === searchedLocation.latitude && 
        loc.longitude === searchedLocation.longitude
      ) && (
        <SearchedLocationMarker location={searchedLocation} />
      )}

      {activeLocation && userLocation && (
        <TrajectoryLine
          startLocation={userLocation}
          endLocation={activeLocation}
          color={activeLocation.color || "#22c55e"}
        />
      )}
    </group>
  );
}
