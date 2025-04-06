import React, { createContext, useContext, ReactNode } from 'react';
import { Movie } from '../services/tmdbApi';
import { useFavorites } from '../hooks/useFavorites';

interface FavoritesContextType {
  favorites: Movie[];
  isLoading: boolean;
  addFavorite: (movie: Movie) => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { favorites, isLoading, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isLoading, 
      addFavorite, 
      removeFavorite, 
      isFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};