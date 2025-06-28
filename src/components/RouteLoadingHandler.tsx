import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export function RouteLoadingHandler() {
  const location = useLocation();
  const { showLoading, hideLoading, markPageAsLoaded, isPageLoaded, clearLoadedPages } = useGlobalLoading();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip loading on initial page load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // Mark the initial page as loaded
      markPageAsLoaded(location.pathname);
      return;
    }

    // Check if this page has been loaded before
    if (isPageLoaded(location.pathname)) {
      // Page has been loaded before, skip loading animation
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show loading immediately for new pages
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
        // Mark this page as loaded so it won't show loading again
        markPageAsLoaded(location.pathname);
      }, 200);
    }, 300 + Math.random() * 200); // Random delay between 300-500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(progressInterval);
    };
  }, [location.pathname, showLoading, hideLoading, markPageAsLoaded, isPageLoaded]);

  // Clear loadedPages on first mount in a session and on browser refresh
  useEffect(() => {
    let cleared = false;
    if (!sessionStorage.getItem('zaptone_loadedPages_cleared')) {
      clearLoadedPages();
      sessionStorage.setItem('zaptone_loadedPages_cleared', '1');
      cleared = true;
    }
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload' && !cleared) {
      clearLoadedPages();
    }
  }, [clearLoadedPages]);

  return null;
}
