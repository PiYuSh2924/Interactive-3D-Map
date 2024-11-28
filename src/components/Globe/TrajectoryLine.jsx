import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { calculateMarkerPosition } from '../../utils/markerUtils';
import * as THREE from 'three';

export default function TrajectoryLine({ startLocation, endLocation, color = "#22c55e" }) {
  const curvePoints = useMemo(() => {
    if (!startLocation || !endLocation) return [];

    const globeRadius = 1;
    
    const start = calculateMarkerPosition(startLocation.latitude, startLocation.longitude, globeRadius);
    const end = calculateMarkerPosition(endLocation.latitude, endLocation.longitude, globeRadius);
    
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    const angle = startVec.angleTo(endVec);
    
    const curveHeight = globeRadius + (angle / Math.PI) * 0.8;
    midPoint.normalize().multiplyScalar(curveHeight);

    if (angle > Math.PI / 2) {
      midPoint.multiplyScalar(1.5);
    }

    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      midPoint,
      endVec
    );

    return curve.getPoints(50);
  }, [startLocation, endLocation]);

  return (
    <Line
      points={curvePoints}
      color={color}
      lineWidth={4}
      transparent
      opacity={0.8}
      depthTest={true}
      depthWrite={false}
    />
  );
} 