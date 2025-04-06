import React from 'react';
import { MovieDetails as MovieDetailsType } from '../../services/tmdbApi';
import { TrailerCarousel } from './TrailerCarousel';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { motion } from 'framer-motion';

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext();
  const isMovieFavorite = isFavorite(movie.id);
  
  const handleFavoriteClick = () => {
    if (isMovieFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Backdrop */}
        {movie.backdrop_path && (
          <div className="absolute top-0 left-0 w-full h-72 md:h-96 overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10 pt-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-64 rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
              
              <button
                onClick={handleFavoriteClick}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isMovieFavorite ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Remove from Favorites
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Add to Favorites
                  </>
                )}
              </button>
            </div>
            
            {/* Movie Info */}
            <div className="md:max-w-[calc(100%-300px)] max-w-full flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {movie.title} <span className="text-gray-600 dark:text-gray-400 text-xl">({new Date(movie.release_date).getFullYear()})</span>
              </h1>
              
              {movie.tagline && (
                <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-4">
                  "{movie.tagline}"
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
                
                {movie.runtime && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="ml-1 text-gray-700 dark:text-gray-300">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-1 text-gray-700 dark:text-gray-300">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Overview</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>
              
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Cast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                    {movie.credits.cast.slice(0, 10).map(actor => (
                      <div key={actor.id} className="flex-shrink-0 w-24">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-24 h-24 object-cover rounded-full mb-2"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                            <span className="text-3xl text-gray-400">👤</span>
                          </div>
                        )}
                        <p className="text-center text-sm font-medium text-gray-900 dark:text-white truncate">{actor.name}</p>
                        <p className="text-center text-xs text-gray-600 dark:text-gray-400 truncate">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Trailers */}
          {movie.videos && movie.videos.results.length > 0 && (
            <div className="mt-8 mb-12">
              <TrailerCarousel trailers={movie.videos.results} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetails;
