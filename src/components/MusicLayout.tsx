import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  Search, 
  Library, 
  PlusCircle, 
  Heart,
  Music,
  PlayCircle,
  Pause,
  Volume2,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Zap,
  Upload,
  Disc3,
  Settings,
  LogOut,
  User,
  MoreVertical,
  Shield,
  Dot,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import LoginDialog from '@/components/auth/LoginDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/useToast';

interface MusicLayoutProps {
  children: React.ReactNode;
}

export function MusicLayout({ children }: MusicLayoutProps) {
  const { user, metadata } = useCurrentUser();
  const { logout } = useLoginActions();
  const { toast } = useToast();
  const { 
    playerState, 
    playlists,
    pauseTrack, 
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat
  } = useMusic();
  
  const [showLogin, setShowLogin] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * playerState.duration;
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
    <div className="h-screen music-app-bg text-foreground flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex w-64 music-sidebar flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ZapTone
              </h1>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start sidebar-item active">
              <Home className="w-5 h-5" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start sidebar-item">
              <Search className="w-5 h-5" />
              Search
            </Button>
            <Button variant="ghost" className="w-full justify-start sidebar-item">
              <Library className="w-5 h-5" />
              Your Library
            </Button>
          </nav>

          <Separator className="mx-4 my-4 opacity-20" />

          {/* Quick Actions */}
          <div className="px-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start sidebar-item">
              <PlusCircle className="w-5 h-5" />
              Create Playlist
            </Button>
            <Button variant="ghost" className="w-full justify-start sidebar-item">
              <Heart className="w-5 h-5" />
              Liked Songs
            </Button>
            {user && (
              <Button variant="ghost" className="w-full justify-start sidebar-item">
                <Upload className="w-5 h-5" />
                Upload Music
              </Button>
            )}
          </div>

          <Separator className="mx-4 my-4 opacity-20" />

          {/* Recently Played / Playlists */}
          <div className="flex-1 px-4">
            <div className="mb-3 px-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Recently Played</h3>
            </div>
            <ScrollArea className="h-32 mb-4">
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm sidebar-item">
                  <Clock className="w-4 h-4" />
                  Digital Dreams
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm sidebar-item">
                  <Clock className="w-4 h-4" />
                  Coffee Shop Blues
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm sidebar-item">
                  <Clock className="w-4 h-4" />
                  Neon Nights
                </Button>
              </div>
            </ScrollArea>

            <div className="mb-3 px-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Made for you</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {playlists.map((playlist: { id: string; name: string }) => (
                    <Button
                        key={playlist.id}
                        variant="ghost"
                        className="w-full justify-start text-sm sidebar-item"
                    >
                        <Disc3 className="w-4 h-4" />
                        {playlist.name}
                    </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-lg music-card hover:bg-transparent cursor-pointer group">
                <Avatar className="w-10 h-10 ring-2 ring-purple-500/20">
                  <AvatarImage src={userPicture} alt={userDisplayName} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {userDisplayName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {userDisplayName}
                    </p>
                    {userNip05 && (
                      <Badge variant="secondary" className="px-1 py-0 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <Shield className="w-2 h-2 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Dot className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={() => setShowLogin(true)}
                className="w-full music-button-primary h-12"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 music-player-bar border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ZapTone
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userPicture} alt={userDisplayName} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          {userDisplayName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{userDisplayName}</DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => setShowLogin(true)}
                  size="sm"
                  className="music-button-primary"
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
          
          {children}
        </div>
      </div>

      {/* Music Player */}
      {playerState.currentTrack && (
        <div className="h-20 sm:h-24 music-player-bar flex items-center px-4 sm:px-6">
          {/* Track Info */}
          <div className="flex items-center gap-3 sm:gap-4 w-60 sm:w-80 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {playerState.currentTrack.coverUrl ? (
                <img 
                  src={playerState.currentTrack.coverUrl} 
                  alt={playerState.currentTrack.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-sm sm:text-base">
                {playerState.currentTrack.title}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {playerState.currentTrack.artist}
              </p>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hidden sm:flex flex-shrink-0"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex-1 flex flex-col items-center gap-1 sm:gap-2 max-w-2xl mx-auto px-4">
            {/* Control Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleShuffle}
                className={`${playerState.shuffle ? 'text-green-400' : 'text-muted-foreground'} hover:text-foreground hidden sm:flex`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={previousTrack}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
              <Button
                size="sm"
                className="play-button w-10 h-10 sm:w-12 sm:h-12"
                onClick={playerState.isPlaying ? pauseTrack : resumeTrack}
              >
                {playerState.isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={nextTrack}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleRepeat}
                className={`${playerState.repeat !== 'none' ? 'text-green-400' : 'text-muted-foreground'} hover:text-foreground hidden sm:flex`}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{formatTime(playerState.currentTime)}</span>
              <div 
                className="player-progress flex-1"
                onClick={handleProgressClick}
              >
                <div 
                  className="player-progress-fill"
                  style={{ 
                    width: `${(playerState.currentTime / playerState.duration) * 100}%` 
                  }}
                />
              </div>
              <span className="hidden sm:inline">{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center gap-2 sm:gap-4 w-20 sm:w-80 justify-end">
            <Button 
              size="sm" 
              variant="ghost"
              className="text-yellow-400 hover:text-yellow-300"
            >
              <Zap className="w-4 h-4" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div 
                className="volume-slider"
                onClick={handleVolumeClick}
              >
                <div 
                  className="volume-slider-fill"
                  style={{ width: `${playerState.volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => setShowLogin(false)}
      />
    </div>
  );
}
