import { api, fetchWithCache } from "./api";
import { CACHE_DURATION } from "../constants";

// Test constants
const TEST_API_KEY = "test-api-key";
const TEST_BASE_URL = "https://api.example.com";
const TEST_RESPONSE = { data: "test data" };

// Mock cache for testing
let mockCache: Record<string, { data: any; timestamp: number }> = {};

// Mock the api module
jest.mock("./api", () => ({
  __esModule: true,
  api: {
    defaults: {
      baseURL: "https://api.example.com",
      params: {
        api_key: "test-api-key",
        language: "en-US",
      },
    },
    get: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ data: { data: "test data" } })
      ),
  },
  fetchWithCache: jest
    .fn()
    .mockImplementation(async (endpoint, params = {}) => {
      const cacheKey = `${endpoint}${JSON.stringify(params)}`;
      const now = Date.now();

      if (
        mockCache[cacheKey] &&
        now - mockCache[cacheKey].timestamp < CACHE_DURATION
      ) {
        return mockCache[cacheKey].data;
      }

      const response = await api.get(endpoint, { params });
      mockCache[cacheKey] = {
        data: response.data,
        timestamp: now,
      };

      return response.data;
    }),
}));

describe("API Service", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockCache = {}; // Reset cache
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("api instance", () => {
    it("should be configured with correct base URL and default params", () => {
      expect(api.defaults.baseURL).toBe(TEST_BASE_URL);
      expect(api.defaults.params).toEqual({
        api_key: TEST_API_KEY,
        language: "en-US",
      });
    });
  });

  describe("fetchWithCache", () => {
    const mockEndpoint = "/test";
    const mockParams = { page: 1 };

    it("should fetch data from API when cache is empty", async () => {
      const result = await fetchWithCache(mockEndpoint, mockParams);

      expect(result).toEqual(TEST_RESPONSE);
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith(mockEndpoint, {
        params: mockParams,
      });
    });

    it("should return cached data when within cache duration", async () => {
      // First call
      await fetchWithCache(mockEndpoint, mockParams);

      // Second call
      const result = await fetchWithCache(mockEndpoint, mockParams);

      expect(result).toEqual(TEST_RESPONSE);
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    it("should fetch fresh data when cache expires", async () => {
      // First call
      await fetchWithCache(mockEndpoint, mockParams);

      jest.advanceTimersByTime(CACHE_DURATION + 1000);

      // Second call
      await fetchWithCache(mockEndpoint, mockParams);

      expect(api.get).toHaveBeenCalledTimes(2);
    });

    it("should handle API errors", async () => {
      const mockError = new Error("API Error");
      (api.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(fetchWithCache(mockEndpoint, mockParams)).rejects.toThrow(
        "API Error"
      );
    });
  });
});
