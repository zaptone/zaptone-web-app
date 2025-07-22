import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
 import { AudioPlayer } from '@/components/AudioPlayer';
 
import { 
  PlayCircle,
  Pause,
  Volume2,
  VolumeX,
  VolumeOff,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Dot,
  Menu,
  X
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import LoginDialog from '@/components/auth/LoginDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/useToast';
import { Sidebar } from '@/components/Sidebar';

interface MusicLayoutProps {
  children: React.ReactNode;
}

export function MusicLayout({ children }: MusicLayoutProps) {
  const { toast } = useToast();  const { 
    playerState, 
    pauseTrack, 
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    updateTime,
    seekTime
  } = useMusic();
  
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progressHoverPosition, setProgressHoverPosition] = useState<number | null>(null);
  const [volumeHoverPosition, setVolumeHoverPosition] = useState<number | null>(null);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerState.duration <= 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * playerState.duration;
    
    console.log('Progress bar clicked:', {
      percent: percent * 100,
      newTime,
      duration: playerState.duration
    });
    
    seekTo(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setProgressHoverPosition(percent * 100);
  };

  const handleProgressMouseLeave = () => {
    setProgressHoverPosition(null);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };

  const handleVolumeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolumeHoverPosition(percent * 100);
  };

  const handleVolumeMouseLeave = () => {
    setVolumeHoverPosition(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 h-full">
          <Sidebar className="h-full" />
        </div>        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 w-64 bg-background flex flex-col" 
                 style={{ 
                   height: '100vh'
                 }}>
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>              <div className="flex-1 overflow-hidden">
                <Sidebar 
                  className="border-0 h-full"
                />
              </div>
              
              {/* Spacer for music player if exists */}
              {playerState.currentTrack && (
                <div style={{ height: '6rem', flexShrink: 0 }} />
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar - Mobile */}
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <Button
              className="lg:hidden"
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg font-semibold">ZapTone</h1>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>

      {/* Music Player Bar */}
      {playerState.currentTrack && (
        <div className="border-t bg-background/95 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <PlayCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{playerState.currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{playerState.currentTrack.artist}</p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleShuffle}>
                  <Shuffle className={`w-4 h-4 ${playerState.shuffle ? 'text-primary' : 'text-muted-foreground'}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={previousTrack}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-8 h-8 rounded-full"
                  onClick={playerState.isPlaying ? pauseTrack : resumeTrack}
                >
                  {playerState.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={nextTrack}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleRepeat}>
                  <Repeat className={`w-4 h-4 ${playerState.repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}`} />
                  {playerState.repeat === 'one' && <Dot className="w-2 h-2 text-primary absolute -top-1 -right-1" />}
                </Button>
              </div>              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full text-xs text-muted-foreground">
                <span>{formatTime(playerState.currentTime)}</span>
                <div 
                  className="flex-1 h-2 bg-muted rounded-full cursor-pointer relative group hover:h-3 transition-all duration-200"
                  onClick={handleProgressClick}
                  onMouseMove={handleProgressMouseMove}
                  onMouseLeave={handleProgressMouseLeave}
                >
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-100 group-hover:bg-primary/80"
                    style={{ 
                      width: `${playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0}%` 
                    }}
                  />
                  {/* Hover indicator */}
                  <div className="absolute top-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg pointer-events-none"
                    style={{ 
                      left: `${progressHoverPosition !== null ? progressHoverPosition : (playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0)}%`,
                      transform: 'translateX(-50%) translateY(-50%)'
                    }}
                  />
                </div>
                <span>{formatTime(playerState.duration)}</span>
              </div>
            </div>            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleMute}
              >
                {playerState.muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : playerState.volume === 0 ? (
                  <VolumeOff className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <div 
                className="w-20 h-2 bg-muted rounded-full cursor-pointer relative hidden sm:block group hover:h-3 transition-all duration-200"
                onClick={handleVolumeClick}
                onMouseMove={handleVolumeMouseMove}
                onMouseLeave={handleVolumeMouseLeave}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100 group-hover:bg-primary/80"
                  style={{ width: `${playerState.muted ? 0 : playerState.volume * 100}%` }}
                />
                {/* Volume hover indicator */}
                <div className="absolute top-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg pointer-events-none"
                  style={{ 
                    left: `${volumeHoverPosition !== null ? volumeHoverPosition : (playerState.muted ? 0 : playerState.volume * 100)}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}        onLogin={() => {
          setShowLogin(false);
          toast({
            title: "Welcome to ZapTone!",
            description: "You have successfully signed in with Nostr",
          });
        }}
      />      {/* Audio Player Component */}
      <AudioPlayer
        track={playerState.currentTrack}
        isPlaying={playerState.isPlaying}
        onTimeUpdate={updateTime}
        onPlay={() => {}}
        onPause={() => {}}
        seekTime={seekTime}
        volume={playerState.volume}
        muted={playerState.muted}
      />
    </div>
  );
}

export default MusicLayout;
