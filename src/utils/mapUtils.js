export const createMapMarkerInteraction = ({ map, onMarkerDeselect }) => {
  let selectedMarker = null;

  const handleMapClick = (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['markers'] });
    
    if (!features.length && selectedMarker) {
      selectedMarker.getElement().classList.remove('selected');
      selectedMarker = null;
      onMarkerDeselect?.();
    }
  };

  const handleMarkerClick = (marker) => {
    if (selectedMarker === marker) {
      return;
    }

    if (selectedMarker) {
      selectedMarker.getElement().classList.remove('selected');
    }

    selectedMarker = marker;
    marker.getElement().classList.add('selected');
    // Add any additional logic needed when a marker is clicked
  };

  map.on('click', handleMapClick);

  return {
    handleMarkerClick,
    cleanup: () => map.off('click', handleMapClick)
  };
};

// Other map-related utilities can go here
export const otherMapFunction = () => {
  // ...
}; 