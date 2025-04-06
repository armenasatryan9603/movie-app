import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "./useFavorites";
import { favoriteMoviesDB } from "../services/indexedDB";
import { Movie } from "../services/tmdbApi";

// Mock the IndexedDB service
jest.mock("../services/indexedDB", () => ({
  favoriteMoviesDB: {
    getAll: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("useFavorites", () => {
  const mockMovie1: Movie = {
    id: 1,
    title: "Test Movie 1",
    poster_path: "/test1.jpg",
    vote_average: 8.5,
    release_date: "2023-01-01",
    overview: "Test overview 1",
    genre_ids: [1, 2],
  };

  const mockMovie2: Movie = {
    id: 2,
    title: "Test Movie 2",
    poster_path: "/test2.jpg",
    vote_average: 7.5,
    release_date: "2023-02-01",
    overview: "Test overview 2",
    genre_ids: [3, 4],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    (favoriteMoviesDB.getAll as jest.Mock).mockResolvedValue([]);
    (favoriteMoviesDB.add as jest.Mock).mockResolvedValue(undefined);
    (favoriteMoviesDB.remove as jest.Mock).mockResolvedValue(undefined);
  });

  it("should initialize with empty favorites and loading state", async () => {
    const { result } = renderHook(() => useFavorites());

    // Initial state
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Final state
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should load favorites from IndexedDB on mount", async () => {
    const mockFavorites = [mockMovie1, mockMovie2];
    (favoriteMoviesDB.getAll as jest.Mock).mockResolvedValue(mockFavorites);

    const { result } = renderHook(() => useFavorites());

    // Initial state
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.favorites).toEqual(mockFavorites);
    expect(result.current.isLoading).toBe(false);
    expect(favoriteMoviesDB.getAll).toHaveBeenCalledTimes(1);
  });

  it("should handle error when loading favorites", async () => {
    const error = new Error("Failed to load favorites");
    (favoriteMoviesDB.getAll as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useFavorites());

    // Initial state
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    // Wait for the effect to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to load favorites:", error);
    consoleSpy.mockRestore();
  });

  it("should add a movie to favorites", async () => {
    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.addFavorite(mockMovie1);
    });

    expect(favoriteMoviesDB.add).toHaveBeenCalledWith(mockMovie1);
    expect(result.current.favorites).toEqual([mockMovie1]);
  });

  it("should handle error when adding favorite", async () => {
    const error = new Error("Failed to add favorite");
    (favoriteMoviesDB.add as jest.Mock).mockRejectedValue(error);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.addFavorite(mockMovie1);
    });

    expect(favoriteMoviesDB.add).toHaveBeenCalledWith(mockMovie1);
    expect(result.current.favorites).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("Failed to add favorite:", error);
    consoleSpy.mockRestore();
  });

  it("should remove a movie from favorites", async () => {
    // First add a movie
    (favoriteMoviesDB.getAll as jest.Mock).mockResolvedValue([mockMovie1]);
    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    // Then remove it
    await act(async () => {
      await result.current.removeFavorite(mockMovie1.id);
    });

    expect(favoriteMoviesDB.remove).toHaveBeenCalledWith(mockMovie1.id);
    expect(result.current.favorites).toEqual([]);
  });

  it("should handle error when removing favorite", async () => {
    const error = new Error("Failed to remove favorite");
    (favoriteMoviesDB.remove as jest.Mock).mockRejectedValue(error);
    (favoriteMoviesDB.getAll as jest.Mock).mockResolvedValue([mockMovie1]);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.removeFavorite(mockMovie1.id);
    });

    expect(favoriteMoviesDB.remove).toHaveBeenCalledWith(mockMovie1.id);
    expect(result.current.favorites).toEqual([mockMovie1]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to remove favorite:",
      error
    );
    consoleSpy.mockRestore();
  });

  it("should check if a movie is favorite", async () => {
    (favoriteMoviesDB.getAll as jest.Mock).mockResolvedValue([mockMovie1]);
    const { result } = renderHook(() => useFavorites());

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isFavorite(mockMovie1.id)).toBe(true);
    expect(result.current.isFavorite(mockMovie2.id)).toBe(false);
  });
});
