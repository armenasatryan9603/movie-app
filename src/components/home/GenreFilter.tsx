import React, { useState, useEffect } from 'react';
import { tmdbApi, Genre } from '../../services/tmdbApi';

interface GenreFilterProps {
  onSelectGenre: (genreId: number | null) => void;
  selectedGenreId: number | null;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ onSelectGenre, selectedGenreId }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await tmdbApi.getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGenres();
  }, []);
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Genres</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onSelectGenre(null)}
          className={`block w-full text-left px-3 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-900 ${
            !selectedGenreId
              ? '!bg-blue-950 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All Genres
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-900 ${
              selectedGenreId === genre.id
                ? '!bg-blue-950 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
