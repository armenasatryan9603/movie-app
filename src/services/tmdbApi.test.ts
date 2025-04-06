import { tmdbApi, Movie, MovieDetails, Genre } from "./tmdbApi";
import { fetchWithCache } from "./api";

// Mock the fetchWithCache function
jest.mock("./api", () => ({
  fetchWithCache: jest.fn(),
}));

describe("TMDB API Service", () => {
  const mockMovie: Movie = {
    id: 1,
    title: "Test Movie",
    poster_path: "/test.jpg",
    vote_average: 8.5,
    release_date: "2023-01-01",
    overview: "Test overview",
    genre_ids: [1, 2],
  };

  const mockMovieDetails: MovieDetails = {
    ...mockMovie,
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
    ],
    runtime: 120,
    tagline: "Test tagline",
    budget: 1000000,
    revenue: 2000000,
    videos: {
      results: [
        {
          id: "1",
          key: "test_key",
          name: "Test Trailer",
          site: "YouTube",
          type: "Trailer",
        },
      ],
    },
    credits: {
      cast: [
        {
          id: 1,
          name: "Test Actor",
          character: "Test Character",
          profile_path: "/actor.jpg",
        },
      ],
    },
  };

  const mockGenre: Genre = {
    id: 1,
    name: "Action",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse = {
        results: [mockMovie],
        page: 1,
        total_pages: 1,
        total_results: 1,
      };

      (fetchWithCache as jest.Mock).mockResolvedValue(mockResponse);

      const result = await tmdbApi.getPopularMovies();
      expect(fetchWithCache).toHaveBeenCalledWith("/movie/popular", {
        page: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when fetching popular movies", async () => {
      const error = new Error("API Error");
      (fetchWithCache as jest.Mock).mockRejectedValue(error);

      await expect(tmdbApi.getPopularMovies()).rejects.toThrow("API Error");
    });
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      const mockResponse = {
        results: [mockMovie],
        page: 1,
        total_pages: 1,
        total_results: 1,
      };

      (fetchWithCache as jest.Mock).mockResolvedValue(mockResponse);

      const result = await tmdbApi.searchMovies("test");
      expect(fetchWithCache).toHaveBeenCalledWith("/search/movie", {
        query: "test",
        page: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when searching movies", async () => {
      const error = new Error("API Error");
      (fetchWithCache as jest.Mock).mockRejectedValue(error);

      await expect(tmdbApi.searchMovies("test")).rejects.toThrow("API Error");
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details successfully", async () => {
      (fetchWithCache as jest.Mock).mockResolvedValue(mockMovieDetails);

      const result = await tmdbApi.getMovieDetails(1);
      expect(fetchWithCache).toHaveBeenCalledWith("/movie/1", {
        append_to_response: "videos,credits",
      });
      expect(result).toEqual(mockMovieDetails);
    });

    it("should handle errors when fetching movie details", async () => {
      const error = new Error("API Error");
      (fetchWithCache as jest.Mock).mockRejectedValue(error);

      await expect(tmdbApi.getMovieDetails(1)).rejects.toThrow("API Error");
    });
  });

  describe("getGenres", () => {
    it("should fetch genres successfully", async () => {
      const mockResponse = {
        genres: [mockGenre],
      };

      (fetchWithCache as jest.Mock).mockResolvedValue(mockResponse);

      const result = await tmdbApi.getGenres();
      expect(fetchWithCache).toHaveBeenCalledWith("/genre/movie/list");
      expect(result).toEqual([mockGenre]);
    });

    it("should handle errors when fetching genres", async () => {
      const error = new Error("API Error");
      (fetchWithCache as jest.Mock).mockRejectedValue(error);

      await expect(tmdbApi.getGenres()).rejects.toThrow("API Error");
    });
  });

  describe("getMoviesByGenre", () => {
    it("should fetch movies by genre successfully", async () => {
      const mockResponse = {
        results: [mockMovie],
        page: 1,
        total_pages: 1,
        total_results: 1,
      };

      (fetchWithCache as jest.Mock).mockResolvedValue(mockResponse);

      const result = await tmdbApi.getMoviesByGenre(1);
      expect(fetchWithCache).toHaveBeenCalledWith("/discover/movie", {
        with_genres: 1,
        page: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle errors when fetching movies by genre", async () => {
      const error = new Error("API Error");
      (fetchWithCache as jest.Mock).mockRejectedValue(error);

      await expect(tmdbApi.getMoviesByGenre(1)).rejects.toThrow("API Error");
    });
  });
});
