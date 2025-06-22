import { useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface AudioPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onPlay: () => void;
  onPause: () => void;
  seekTime?: number;
  volume?: number;
  muted?: boolean;
}

export function AudioPlayer({ track, isPlaying, onTimeUpdate, onPlay, onPause, seekTime, volume = 1, muted = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current || !track) return;

    const audio = audioRef.current;
    audio.src = track.url;
    
    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime, audio.duration);
    };

    const handleLoadedMetadata = () => {
      console.log('Duration loaded:', audio.duration);
      onTimeUpdate(audio.currentTime, audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
    };
  }, [track, onTimeUpdate]);
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  // Handle seeking
  useEffect(() => {
    if (audioRef.current && seekTime !== undefined && seekTime >= 0) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      onPlay={onPlay}
      onPause={onPause}
      style={{ display: 'none' }}
    />
  );
}
