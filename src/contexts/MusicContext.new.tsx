import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  duration?: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface MusicContextType {
  playerState: PlayerState;
  queue: Track[];
  playlists: Playlist[];
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  updateTime: (currentTime: number, duration: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    shuffle: false,
    repeat: 'none'
  });
  
  const [queue, setQueue] = useState<Track[]>([]);
  const [playlists] = useState<Playlist[]>([
    { id: '1', name: 'Chill Vibes', tracks: [] },
    { id: '2', name: 'Electronic Mix', tracks: [] },
    { id: '3', name: 'Jazz Collection', tracks: [] }
  ]);

  const updateTime = useCallback((currentTime: number, duration: number) => {
    console.log('updateTime called:', { currentTime, duration });
    setPlayerState(prev => ({
      ...prev,
      currentTime: isNaN(currentTime) ? 0 : currentTime,
      duration: isNaN(duration) ? 0 : duration
    }));
  }, []);

  const playTrack = (track: Track) => {
    console.log('playTrack called:', track);
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: 0
    }));
  };

  const pauseTrack = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  };

  const resumeTrack = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
  };

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(track => track.id === playerState.currentTrack?.id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < queue.length) {
        playTrack(queue[nextIndex]);
      } else if (playerState.repeat === 'all') {
        playTrack(queue[0]);
      }
    }
  }, [queue, playerState.currentTrack?.id, playerState.repeat]);

  const previousTrack = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(track => track.id === playerState.currentTrack?.id);
      const prevIndex = currentIndex - 1;
      
      if (prevIndex >= 0) {
        playTrack(queue[prevIndex]);
      } else if (playerState.repeat === 'all') {
        playTrack(queue[queue.length - 1]);
      }
    }
  };

  const seekTo = (time: number) => {
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const toggleRepeat = () => {
    setPlayerState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none'
    }));
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const value: MusicContextType = {
    playerState,
    queue,
    playlists,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    clearQueue,
    updateTime
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
