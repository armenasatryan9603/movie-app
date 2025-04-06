import { fetchWithCache } from './api';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  backdrop_path?: string;
  tagline: string;
  budget: number;
  revenue: number;
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export const tmdbApi = {
  getPopularMovies: async (page = 1) => {
    return await fetchWithCache('/movie/popular', { page });
  },
  
  searchMovies: async (query: string, page = 1) => {
    return await fetchWithCache('/search/movie', { query, page });
  },
  
  getMovieDetails: async (movieId: number) => {
    return await fetchWithCache(`/movie/${movieId}`, { 
      append_to_response: 'videos,credits' 
    }) as MovieDetails;
  },
  
  getGenres: async () => {
    const response = await fetchWithCache('/genre/movie/list');
    return response.genres as Genre[];
  },
  
  getMoviesByGenre: async (genreId: number, page = 1) => {
    return await fetchWithCache('/discover/movie', { 
      with_genres: genreId,
      page 
    });
  }
};