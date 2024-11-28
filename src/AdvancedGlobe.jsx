'use client'

import React, { useState, Suspense, useEffect, useCallback } from 'react'
import { Canvas } from "@react-three/fiber"
import Globe from "./components/Globe/Globe"
import SearchBar from "./components/Search/SearchBar"
import FilterSystem from "./components/Search/FilterSystem"
import LocationInfo from "./components/Globe/LocationInfo"
import PreviewCard from "./components/Preview/PreviewCard"
import { worldWonders } from './data/worldWonders'
import { calculateDistance } from './utils/distanceCalculator'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }) {
  return (
    <div className="text-red-500 p-4">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function AdvancedGlobe() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [previewLocation, setPreviewLocation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "Your Location"
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleMarkerClick = useCallback((clickedLocation) => {
    if (userLocation) {
      const distanceInfo = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        clickedLocation.latitude,
        clickedLocation.longitude
      );
      
      setSelectedLocation({
        ...clickedLocation,
        distance: distanceInfo.distance,
        color: distanceInfo.color,
        textColor: distanceInfo.textColor,
        distanceName: distanceInfo.name
      });
      setActiveLocation({
        ...clickedLocation,
        distance: distanceInfo.distance,
        color: distanceInfo.color,
        textColor: distanceInfo.textColor,
        distanceName: distanceInfo.name
      });
    } else {
      setSelectedLocation(clickedLocation);
      setActiveLocation(clickedLocation);
    }
    setPreviewLocation(null);
  }, [userLocation]);

  const handleSearchSelect = useCallback((selectedLocation) => {
    if (userLocation) {
      const distanceInfo = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        selectedLocation.latitude,
        selectedLocation.longitude
      );
      
      const locationWithInfo = {
        ...selectedLocation,
        distance: distanceInfo.distance,
        color: distanceInfo.color,
        textColor: distanceInfo.textColor,
        distanceName: distanceInfo.name
      };

      setSearchedLocation(locationWithInfo);
      setSelectedLocation(locationWithInfo);
      setActiveLocation(locationWithInfo);
    } else {
      setSearchedLocation(selectedLocation);
      setSelectedLocation(selectedLocation);
      setActiveLocation(selectedLocation);
    }
    setPreviewLocation(null);
  }, [userLocation]);

  const handleMarkerHover = useCallback((location) => {
    setPreviewLocation(location);
  }, []);

  const visibleWonders = activeFilters.length === 0 
    ? worldWonders 
    : worldWonders.filter(wonder => 
        activeFilters.includes(wonder.category.toLowerCase())
      );

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <div 
      className="relative w-full h-full select-none"
      style={{ backgroundColor: '#0A1120' }}
    >
      {/* Search and Filter Container */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <SearchBar 
              onSelect={handleSearchSelect}
            />
          </div>
          <div className="w-40"> {/* Fixed width for filter */}
            <FilterSystem
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </div>
        </div>
      </div>

      {/* Globe Container */}
      <div 
        className={`w-full h-full globe-container no-select ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <Canvas
              camera={{
                position: [0, 0, 3.2],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              className="translate-y-12"
            >
              <Globe
                locations={visibleWonders}
                onMarkerClick={handleMarkerClick}
                onMarkerHover={handleMarkerHover}
                selectedLocation={selectedLocation}
                searchedLocation={searchedLocation}
                activeLocation={activeLocation}
                userLocation={userLocation}
                isDragging={isDragging}
              />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Preview Card */}
      {previewLocation && !isDragging && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 no-select select-none pointer-events-none">
          <PreviewCard location={previewLocation} />
        </div>
      )}

      {/* Location Info Card - adjust position if needed */}
      {selectedLocation && (
        <div className="absolute bottom-6 left-6 z-50 no-select select-none">
          <LocationInfo location={selectedLocation} />
        </div>
      )}
    </div>
  );
}
