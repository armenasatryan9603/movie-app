import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from '../common/MovieCard';
import Loader from '../common/Loader';
import { tmdbApi, Movie } from '../../services/tmdbApi';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { motion } from 'framer-motion';

interface MovieListProps {
  searchQuery: string;
  selectedGenreId: number | null;
}

const MovieList: React.FC<MovieListProps> = ({ searchQuery, selectedGenreId }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchMovies = useCallback(async () => {
    if (!hasMore) return;
    
    setIsLoading(true);
    try {
      let data;
      
      if (searchQuery) {
        data = await tmdbApi.searchMovies(searchQuery, page);
      } else if (selectedGenreId) {
        data = await tmdbApi.getMoviesByGenre(selectedGenreId, page);
      } else {
        data = await tmdbApi.getPopularMovies(page);
      }
      
      if (data.results.length === 0) {
        setHasMore(false);
        return;
      }
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prevMovies => [...prevMovies, ...data.results]);
      }
      
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenreId, page, hasMore]);
  
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedGenreId]);
  
  useEffect(() => {
    if (page === 1) {
      fetchMovies();
    }
  }, [fetchMovies, page]);
  
  const { isFetching } = useInfiniteScroll(fetchMovies);
  
  if (isLoading && movies.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-700 h-64 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (movies.length === 0 && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No movies found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery 
            ? `No results for "${searchQuery}"`
            : selectedGenreId 
              ? "No movies found for the selected genre" 
              : "No movies available"
          }
        </p>
      </motion.div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>
      
      {(isLoading || isFetching) && movies.length > 0 && <Loader />}
      
      {!hasMore && movies.length > 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          No more movies to load
        </p>
      )}
    </div>
  );
};

export default MovieList;
