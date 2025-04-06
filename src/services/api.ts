import axios from 'axios';
import { CACHE_DURATION } from '../constants';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

const cache: Record<string, { data: any; timestamp: number }> = {};

export const fetchWithCache = async (endpoint: string, params = {}) => {
  const cacheKey = `${endpoint}${JSON.stringify(params)}`;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    
    return cache[cacheKey].data;
  }

  const response = await api.get(endpoint, { params });

  cache[cacheKey] = {
    data: response.data,
    timestamp: Date.now(),
  };

  return response.data;
};
