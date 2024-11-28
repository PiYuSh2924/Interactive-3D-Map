// Haversine formula for calculating distance between two points on Earth
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // distance in km
  
  // Add color information based on distance
  let color = "#22c55e"; // Green for short distances
  let textColor = "text-emerald-400";
  let name = "Nearby";
  
  if (distance > 8000) {
    color = "#ff4444"; // Bright red for long distances
    textColor = "text-red-500";
    name = "Long Distance";
  } else if (distance > 2000) {
    color = "#f97316"; // Orange for medium distances
    textColor = "text-orange-400";
    name = "Medium Distance";
  }

  return {
    distance,
    color,
    textColor,
    name
  };
};

function toRad(degrees) {
  return degrees * (Math.PI/180);
} 