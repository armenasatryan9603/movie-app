import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import MovieDetails from '../components/details/MovieDetails';
import Loader from '../components/common/Loader';
import { tmdbApi, MovieDetails as MovieDetailsType } from '../services/tmdbApi';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchMovieDetails = async () => {
      
      setIsLoading(true);
      setError(null);
      
      try {
        const movieId = parseInt(id, 10);
        const movieData = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="pt-4 px-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Movies
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      ) : movie ? (
        <MovieDetails movie={movie} />
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
            <p>Movie not found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
