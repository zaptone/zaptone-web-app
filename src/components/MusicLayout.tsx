import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AudioPlayer } from '@/components/AudioPlayer';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Settings,
  LogOut,
  User,
  Shield,
  Dot,
  Menu,
  X
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import LoginDialog from '@/components/auth/LoginDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/useToast';
import { Sidebar } from '@/components/Sidebar';

interface MusicLayoutProps {
  children: React.ReactNode;
}

export function MusicLayout({ children }: MusicLayoutProps) {
  const { user, metadata } = useCurrentUser();
  const { logout } = useLoginActions();
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

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (err) {
      toast({
        title: "Error signing out",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
      console.error('Logout error:', err);
    }
  };

  const userDisplayName = metadata?.name || `User ${user?.pubkey.slice(0, 8)}`;
  const userPicture = metadata?.picture;
  const userNip05 = metadata?.nip05;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 h-full">
          <Sidebar className="h-full" />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-background">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>              <Sidebar 
                className="border-0 h-[calc(100vh-5rem)]" 
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar - Mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg font-semibold">ZapTone</h1>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Avatar className="w-6 h-6">
                        {userPicture && <AvatarImage src={userPicture} />}
                        <AvatarFallback className="text-xs">
                          {userDisplayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userDisplayName}</p>
                        {userNip05 && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {userNip05}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogin(true)}
                >
                  Sign in
                </Button>
              )}
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
                >
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-100 group-hover:bg-primary/80"
                    style={{ 
                      width: `${playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0}%` 
                    }}
                  />
                  {/* Hover indicator */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    style={{ 
                      left: `${playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0}%`,
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
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100 group-hover:bg-primary/80"
                  style={{ width: `${playerState.muted ? 0 : playerState.volume * 100}%` }}
                />
                {/* Volume hover indicator */}
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  style={{ 
                    left: `${playerState.muted ? 0 : playerState.volume * 100}%`,
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
