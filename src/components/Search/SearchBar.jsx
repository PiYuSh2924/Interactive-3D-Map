import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchLocations } from '../../services/searchService';

export default function SearchBar({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef(null);

  const handleSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, handleSearch]);

  const handleKeyDown = (e) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectLocation(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectLocation = (location) => {
    onSelect(location);
    setSearchTerm('');
    setSearchResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder="Search locations..."
            className="w-full h-12 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg 
                     text-white placeholder-white/50 border border-white/20
                     focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchResults([]);
                setIsOpen(false);
                setSelectedIndex(-1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 
                       hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => handleSearch(searchTerm)}
          disabled={isSearching}
          className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                   transition-colors duration-200 flex items-center justify-center
                   border border-transparent hover:border-white/20
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {isOpen && searchResults.length > 0 && (
        <div 
          ref={searchResultsRef}
          className="absolute w-full mt-2 bg-black/90 backdrop-blur-md rounded-lg 
                    shadow-xl border border-white/20 max-h-60 overflow-y-auto z-50"
        >
          {searchResults.map((location, index) => (
            <div
              key={`${location.name}-${location.latitude}-${location.longitude}`}
              onClick={() => handleSelectLocation(location)}
              className={`px-4 py-3 cursor-pointer text-white/90
                       transition-colors duration-150 ease-in-out
                       ${index === selectedIndex ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-white/70">
                {location.city && `${location.city}, `}{location.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
