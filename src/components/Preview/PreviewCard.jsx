import React from 'react'

export default function PreviewCard({ location }) {
  if (!location) return null;

  return (
    <div className="w-[280px] transform -translate-y-24">
      <div className="bg-black/80 backdrop-blur-md rounded-lg shadow-xl p-4 border border-white/20">
        <h2 className="text-lg font-bold text-white mb-2">
          {location.name}
        </h2>
        <div className="aspect-video relative rounded-md overflow-hidden mb-2">
          <img 
            src={location.imageUrl} 
            alt={location.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
            }}
          />
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">
          {location.description}
        </p>
      </div>
    </div>
  );
} 