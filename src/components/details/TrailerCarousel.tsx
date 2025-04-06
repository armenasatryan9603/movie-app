import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TrailerCarouselProps {
  trailers: Trailer[];
}

export const TrailerCarousel: React.FC<TrailerCarouselProps> = ({ trailers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!trailers || trailers.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No trailers available</p>
      </div>
    );
  }
  
  const filteredTrailers = trailers.filter(
    trailer => trailer.site === 'YouTube' && ['Trailer', 'Teaser'].includes(trailer.type)
  );
  
  if (filteredTrailers.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No trailers available</p>
      </div>
    );
  }
  
  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? filteredTrailers.length - 1 : prev - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => 
      prev === filteredTrailers.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className="relative">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Trailers</h3>
      
      <div className="relative h-0 pb-[56.25%] bg-black rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.iframe
            key={filteredTrailers[currentIndex].key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${filteredTrailers[currentIndex].key}`}
            title={filteredTrailers[currentIndex].name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></motion.iframe>
        </AnimatePresence>
      </div>
      
      {filteredTrailers.length > 1 && (
        <div className="absolute top-1/2 inset-x-0 flex justify-between items-center px-4 -mt-6">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {filteredTrailers.length > 1 && (
        <div className="mt-4 relative">
          {/* Scroll buttons */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              const container = document.getElementById('trailer-thumbnails');
              if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll thumbnails left"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              const container = document.getElementById('trailer-thumbnails');
              if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll thumbnails right"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Scrollable container */}
          <div 
            id="trailer-thumbnails"
            className="flex overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent gap-2 snap-x px-8"
          >
            {filteredTrailers.map((trailer, index) => (
              <button
                key={trailer.id}
                onClick={() => {
                  setCurrentIndex(index);
                }}
                className={`group flex-shrink-0 flex flex-col items-center transition-all duration-200 snap-center ${
                  currentIndex === index 
                    ? 'scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Play ${trailer.name}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
              >
                <div className={`w-16 h-9 rounded overflow-hidden border-2 ${
                  currentIndex === index 
                    ? 'border-blue-500 shadow-md shadow-blue-500/30' 
                    : 'border-transparent'
                }`}>
                  <img 
                    src={`https://img.youtube.com/vi/${trailer.key}/default.jpg`} 
                    alt={trailer.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className={`mt-1 h-1 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-4 bg-blue-500' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                }`}></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
