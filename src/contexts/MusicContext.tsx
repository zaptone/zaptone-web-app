import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';

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
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleTrackEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleTrackEnded);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0
      }));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        duration: audioRef.current?.duration || 0
      }));
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const playTrack = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().catch(console.error);
      
      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true
      }));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const currentIndex = queue.findIndex(track => track.id === playerState.currentTrack?.id);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < queue.length) {
        playTrack(queue[nextIndex]);
      } else if (playerState.repeat === 'all') {
        playTrack(queue[0]);
      }
    }
  };

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
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState(prev => ({ ...prev, volume }));
    }
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
    clearQueue
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
