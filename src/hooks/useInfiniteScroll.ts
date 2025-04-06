import { useEffect, useState, useCallback } from 'react';
import { SCROLL_MAX_THRESHOLD } from '../constants';

export const useInfiniteScroll = (callback: () => void) => {
  const [isFetching, setIsFetching] = useState(false);
  
  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // If user has scrolled to bottom (with 200px threshold)
    if (scrollTop + clientHeight >= scrollHeight - SCROLL_MAX_THRESHOLD && !isFetching) {
      setIsFetching(true);
    }
  }, [isFetching]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  useEffect(() => {
    if (!isFetching) return;
    
    callback();
    setIsFetching(false);
  }, [isFetching, callback]);
  
  return { isFetching };
};
