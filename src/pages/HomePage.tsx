import React, { useState } from 'react';
import Header from '../components/common/Header';
import MovieList from '../components/home/MovieList';
import GenreFilter from '../components/home/GenreFilter';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGenreId(null); // Reset genre filter when searching
  };
  
  const handleSelectGenre = (genreId: number | null) => {
    setSelectedGenreId(genreId);
    setSearchQuery(''); // Reset search when filtering by genre
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <GenreFilter 
              onSelectGenre={handleSelectGenre} 
              selectedGenreId={selectedGenreId} 
            />
          </div>
          {searchQuery}
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedGenreId 
                  ? 'Movies by Genre' 
                  : 'Popular Movies'}
            </h1>
            
            <MovieList 
              searchQuery={searchQuery} 
              selectedGenreId={selectedGenreId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
