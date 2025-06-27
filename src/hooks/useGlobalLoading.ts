import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message: string;
  progress: number;
}

interface LoadingStore extends LoadingState {
  showLoading: (message?: string, progress?: number) => void;
  hideLoading: () => void;
  updateProgress: (progress: number) => void;
  updateMessage: (message: string) => void;
}

export const useGlobalLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  message: '',
  progress: 0,

  showLoading: (message = 'Loading...', progress = 0) => {
    set({ isLoading: true, message, progress });
  },

  hideLoading: () => {
    set({ isLoading: false, message: '', progress: 0 });
  },

  updateProgress: (progress: number) => {
    set({ progress: Math.max(0, Math.min(100, progress)) });
  },

  updateMessage: (message: string) => {
    set({ message });
  },
}));

// Helper function to wrap async operations with loading states
export async function withLoading<T>(
  asyncFn: () => Promise<T>,
  message?: string,
  onProgress?: (progress: number) => void
): Promise<T> {
  const { showLoading, hideLoading, updateProgress } = useGlobalLoading.getState();
  
  try {
    showLoading(message);
    
    if (onProgress) {
      // Simulate progress updates if callback provided
      const progressInterval = setInterval(() => {
        const currentProgress = useGlobalLoading.getState().progress;
        if (currentProgress < 90) {
          updateProgress(currentProgress + Math.random() * 10);
        }
      }, 100);
      
      const result = await asyncFn();
      clearInterval(progressInterval);
      updateProgress(100);
      
      // Brief delay to show 100% before hiding
      setTimeout(() => hideLoading(), 200);
      return result;
    } else {
      const result = await asyncFn();
      hideLoading();
      return result;
    }
  } catch (error) {
    hideLoading();
    throw error;
  }
}
