import { useState, useEffect } from 'react';
import { DEFAULT_DEBOUNCE_DELAY } from '../constants';

export const useDebounce = <T>(value: T, delay = DEFAULT_DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
