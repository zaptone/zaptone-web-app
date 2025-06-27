import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export function RouteLoadingHandler() {
  const location = useLocation();
  const { showLoading, hideLoading } = useGlobalLoading();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip loading on initial page load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show loading immediately
    showLoading('Loading page...', 0);

    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        clearInterval(progressInterval);
        progress = 90;
      }
      showLoading('Loading page...', Math.min(progress, 90));
    }, 100);

    // Hide loading after a short delay to simulate page load
    timeoutRef.current = setTimeout(() => {
      clearInterval(progressInterval);
      showLoading('Loading page...', 100);
      
      // Final hide after showing 100%
      setTimeout(() => {
        hideLoading();
      }, 200);
    }, 300 + Math.random() * 200); // Random delay between 300-500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(progressInterval);
    };
  }, [location.pathname, showLoading, hideLoading]);

  return null;
}
