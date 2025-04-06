import { initDB, favoriteMoviesDB } from "./indexedDB";
import { Movie } from "./tmdbApi";
import { DB_NAME, DB_VERSION, STORE_NAME } from "../constants";

// Define proper types for our mocks
interface MockIDBRequest {
  result: any;
  error: Error | null;
  onsuccess: ((event: Event) => void) | null;
  onupgradeneeded: ((event: IDBVersionChangeEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

// Create mock event factory functions
const createEvent = (result: any): Event => {
  const event = new Event("success");
  Object.defineProperty(event, "target", {
    value: { result },
    enumerable: true,
  });
  return event;
};

const createVersionChangeEvent = (): IDBVersionChangeEvent => {
  const event = new Event("upgradeneeded") as IDBVersionChangeEvent;
  Object.defineProperty(event, "target", {
    value: { result: mockDB },
    enumerable: true,
  });
  Object.defineProperty(event, "newVersion", {
    value: DB_VERSION,
    enumerable: true,
  });
  Object.defineProperty(event, "oldVersion", {
    value: DB_VERSION - 1,
    enumerable: true,
  });
  return event;
};

// Mock database objects
const mockObjectStore = {
  put: jest.fn(),
  delete: jest.fn(),
  getAll: jest.fn(),
  get: jest.fn(),
};

const mockTransaction = {
  objectStore: jest.fn().mockReturnValue(mockObjectStore),
};

const mockDB = {
  transaction: jest.fn().mockReturnValue(mockTransaction),
  createObjectStore: jest.fn(),
  objectStoreNames: {
    contains: jest.fn().mockReturnValue(false),
  },
};

describe("IndexedDB Service", () => {
  let mockRequest: MockIDBRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      result: mockDB,
      error: null,
      onsuccess: null,
      onupgradeneeded: null,
      onerror: null,
    };

    global.indexedDB = {
      open: jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockRequest.onupgradeneeded) {
            mockRequest.onupgradeneeded(createVersionChangeEvent());
          }
          if (mockRequest.onsuccess) {
            mockRequest.onsuccess(createEvent(mockDB));
          }
        }, 0);
        return mockRequest;
      }),
    } as unknown as IDBFactory;

    return initDB();
  });

  describe("initDB", () => {
    it("initializes the database", async () => {
      const db = await initDB();
      expect(global.indexedDB.open).toHaveBeenCalledWith(DB_NAME, DB_VERSION);
      expect(db).toBe(mockDB);
    });
  });

  describe("favoriteMoviesDB", () => {
    const mockMovie: Movie = { id: 1, title: "Test Movie" } as Movie;

    describe("add", () => {
      it("adds a movie to favorites", async () => {
        const mockPutRequest = {
          onsuccess: jest.fn()
        };

        mockObjectStore.put.mockImplementation(() => {
          setTimeout(() => {
            if (mockPutRequest.onsuccess) {
              mockPutRequest.onsuccess({
                target: { result: undefined },
              } as unknown as Event);
            }
          }, 0);
          return mockPutRequest;
        });

        await favoriteMoviesDB.add(mockMovie);
        expect(mockDB.transaction).toHaveBeenCalledWith(
          STORE_NAME,
          "readwrite"
        );
        expect(mockObjectStore.put).toHaveBeenCalledWith(mockMovie);
      });
    });

    describe("remove", () => {
      it("removes a movie from favorites", async () => {
        const mockDeleteRequest = {
          onsuccess: jest.fn()
        };

        mockObjectStore.delete.mockImplementation(() => {
          setTimeout(() => {
            if (mockDeleteRequest.onsuccess) {
              mockDeleteRequest.onsuccess({
                target: { result: undefined },
              } as unknown as Event);
            }
          }, 0);
          return mockDeleteRequest;
        });

        await favoriteMoviesDB.remove(1);
        expect(mockDB.transaction).toHaveBeenCalledWith(
          STORE_NAME,
          "readwrite"
        );
        expect(mockObjectStore.delete).toHaveBeenCalledWith(1);
      });
    });

    describe("getAll", () => {
      it("gets all favorites", async () => {
        const mockFavorites = [
          { id: 1, title: "Movie 1" },
          { id: 2, title: "Movie 2" },
        ];

        // Create request with initial result
        const mockGetAllRequest = {
          result: [{}],
          onsuccess: jest.fn(),
        };

        // Mock the getAll method
        mockObjectStore.getAll.mockImplementation(() => {
          // Set the result and trigger success immediately
          Promise.resolve().then(() => {
            mockGetAllRequest.result = mockFavorites;
            if (mockGetAllRequest.onsuccess) {
              mockGetAllRequest.onsuccess({
                target: { result: mockFavorites },
              } as unknown as Event);
            }
          });
          return mockGetAllRequest;
        });

        const result = await favoriteMoviesDB.getAll();
        expect(mockDB.transaction).toHaveBeenCalledWith(STORE_NAME, "readonly");
        expect(result).toEqual(mockFavorites);
      });
    });

    describe("isFavorite", () => {
      it("checks if movie is favorite", async () => {
        const mockGetRequest: MockIDBRequest = {
          result: mockMovie,
          error: null,
          onsuccess: null,
          onupgradeneeded: null,
          onerror: null,
        };

        mockObjectStore.get.mockImplementation(() => {
          Promise.resolve().then(() => {
            if (mockGetRequest.onsuccess) {
              mockGetRequest.onsuccess(createEvent(mockMovie));
            }
          });
          return mockGetRequest;
        });

        const result = await favoriteMoviesDB.isFavorite(1);
        expect(mockDB.transaction).toHaveBeenCalledWith(STORE_NAME, "readonly");
        expect(result).toBe(true);
      });

      it("returns false when movie is not favorite", async () => {
        const mockGetRequest: MockIDBRequest = {
          result: undefined,
          error: null,
          onsuccess: null,
          onupgradeneeded: null,
          onerror: null,
        };

        mockObjectStore.get.mockImplementation(() => {
          Promise.resolve().then(() => {
            if (mockGetRequest.onsuccess) {
              mockGetRequest.onsuccess(createEvent(undefined));
            }
          });
          return mockGetRequest;
        });

        const result = await favoriteMoviesDB.isFavorite(1);
        expect(result).toBe(false);
      });
    });
  });
});
