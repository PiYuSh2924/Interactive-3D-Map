import React from 'react'

export default function LocationInfo({ location }) {
  if (!location) return null;

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden w-[320px] sm:w-[360px] max-w-[90vw] border border-white/20">
      {/* Image section */}
      {location.imageUrl && (
        <div className="w-full aspect-[16/9] relative overflow-hidden">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
            }}
          />
          {/* Category badge */}
          {location.category && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                {location.category}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-4">
        {/* Title Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">{location.name}</h2>
          <p className="text-white/90 text-sm">
            {location.country}
          </p>
        </div>

        {/* Distance Information Section */}
        {location.distance !== undefined && (
          <div className="bg-white/10 rounded-lg p-3 space-y-2 border border-white/10">
            <div className={`flex items-center gap-2 ${location.textColor}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm">
                {Math.round(location.distance).toLocaleString()} km - {location.distanceName}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3">
          {location.description}
        </p>

        {/* Additional Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
          {location.yearBuilt && (
            <div>
              <p className="text-white/60">Year Built</p>
              <p className="text-white font-medium">{location.yearBuilt}</p>
            </div>
          )}
          {location.height && (
            <div>
              <p className="text-white/60">Height</p>
              <p className="text-white font-medium">{location.height}m</p>
            </div>
          )}
          {location.visitors && (
            <div>
              <p className="text-white/60">Annual Visitors</p>
              <p className="text-white font-medium">{location.visitors.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* UNESCO Status */}
        {location.unescoSite && (
          <div className="bg-blue-500/20 p-2 rounded-lg text-center">
            <span className="text-white/90 text-xs sm:text-sm font-medium">
              UNESCO World Heritage Site
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
