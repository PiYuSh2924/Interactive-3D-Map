import { worldCities, famousLandmarks } from '../data/worldCities'

export async function searchLocations(query) {
  // First, search local database
  const localResults = searchLocalDatabase(query)
  
  if (localResults.length > 0) {
    return localResults
  }

  // If no local results, try OpenStreetMap
  return await searchOpenStreetMap(query)
}

function searchLocalDatabase(query) {
  const searchTerm = query.toLowerCase()
  const allLocations = [...worldCities, ...famousLandmarks]
  
  return allLocations.filter(location => {
    return (
      location.name.toLowerCase().includes(searchTerm) ||
      location.country?.toLowerCase().includes(searchTerm) ||
      location.landmarks?.some(landmark => 
        landmark.toLowerCase().includes(searchTerm)
      )
    )
  }).slice(0, 5)
}

// Add rate limiting for OpenStreetMap API
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

async function searchOpenStreetMap(query) {
  // Rate limiting
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime))
    );
  }
  lastRequestTime = Date.now();

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    )
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json()
    
    return data.map(item => ({
      name: item.display_name.split(',')[0],
      country: item.display_name.split(',').slice(-1)[0].trim(),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      category: mapOSMTypeToCategory(item.type),
      description: item.display_name
    }))
  } catch (error) {
    console.error('OpenStreetMap search failed:', error)
    return []
  }
}

function mapOSMTypeToCategory(osmType) {
  const mapping = {
    city: 'City',
    town: 'City',
    village: 'City',
    suburb: 'City',
    monument: 'Landmark',
    memorial: 'Historical',
    park: 'Nature',
    museum: 'Cultural'
  }
  return mapping[osmType] || 'Default'
}
