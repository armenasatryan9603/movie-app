import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../services/tmdbApi';
import { favoriteMoviesDB } from '../services/indexedDB';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await favoriteMoviesDB.getAll();
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, []);
  
  const addFavorite = useCallback(async (movie: Movie) => {
    try {
      await favoriteMoviesDB.add(movie);
      setFavorites(prev => [...prev, movie]);
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  }, []);
  
  const removeFavorite = useCallback(async (movieId: number) => {
    try {
      await favoriteMoviesDB.remove(movieId);
      setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }, []);
  
  const isFavorite = useCallback((movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);
  
  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};