import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  Settings,
  LogOut,
  User,
  MoreVertical,
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

interface MusicLayoutProps {
  children: React.ReactNode;
}

export function MusicLayout({ children }: MusicLayoutProps) {
  const { user, metadata } = useCurrentUser();
  const { logout } = useLoginActions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();const { 
    playerState, 
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
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
      <div className="flex flex-1 overflow-hidden">        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex w-64 music-sidebar flex-col">          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZapTone</h1>
                <p className="text-xs text-muted-foreground">Decentralized Music Platform</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar">              {/* DISCOVER MUSIC Section */}
              <div className="px-6 mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">DISCOVER MUSIC</h2>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/')}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Home</div>
                      <div className="text-xs opacity-90">Discover new music</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/search') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/search')}
                  >
                    <Search className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Search</div>
                      <div className="text-xs opacity-70">Find tracks and artists</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/library') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/library')}
                  >
                    <Library className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Your Library</div>
                      <div className="text-xs opacity-70">Your saved music</div>
                    </div>
                  </Button>
                  
                  {user && (
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start h-12 px-4 rounded-lg ${
                        isActiveRoute('/upload') 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                          : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => handleNavigation('/upload')}
                    >
                      <Upload className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Upload</div>
                        <div className="text-xs opacity-70">Share your music</div>
                      </div>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/liked') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/liked')}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Liked Songs</div>
                      <div className="text-xs opacity-70">Your favorite tracks</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* RECENTLY PLAYED Section */}
              <div className="px-6 mb-6">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">RECENTLY PLAYED</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center relative">
                      <Music className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Sample Track</p>
                      <p className="text-sm text-muted-foreground truncate">Artist Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center relative">
                      <Music className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Another Track</p>
                      <p className="text-sm text-muted-foreground truncate">Different Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Section - Always visible at bottom */}
          <div className="p-4 border-t border-border flex-shrink-0">
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
        </div>{/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>          {/* Mobile Sidebar Header */}
          <div className="p-6 flex items-center justify-between border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ZapTone</h1>
                <p className="text-xs text-muted-foreground">Decentralized Music Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Scrollable Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar">              {/* DISCOVER MUSIC Section */}
              <div className="px-6 py-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">DISCOVER MUSIC</h2>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/')}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Home</div>
                      <div className="text-xs opacity-90">Discover new music</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/search') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/search')}
                  >
                    <Search className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Search</div>
                      <div className="text-xs opacity-70">Find tracks and artists</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/library') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/library')}
                  >
                    <Library className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Your Library</div>
                      <div className="text-xs opacity-70">Your saved music</div>
                    </div>
                  </Button>
                  
                  {user && (
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start h-12 px-4 rounded-lg ${
                        isActiveRoute('/upload') 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                          : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => handleNavigation('/upload')}
                    >
                      <Upload className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Upload</div>
                        <div className="text-xs opacity-70">Share your music</div>
                      </div>
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-12 px-4 rounded-lg ${
                      isActiveRoute('/liked') 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => handleNavigation('/liked')}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Liked Songs</div>
                      <div className="text-xs opacity-70">Your favorite tracks</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* RECENTLY PLAYED Section */}
              <div className="px-6 pb-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">RECENTLY PLAYED</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center relative">
                      <Music className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Sample Track</p>
                      <p className="text-sm text-muted-foreground truncate">Artist Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center relative">
                      <Music className="w-5 h-5 text-white" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Another Track</p>
                      <p className="text-sm text-muted-foreground truncate">Different Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile User Section */}
          <div className="p-4 border-t border-border flex-shrink-0">
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
              <div className="space-y-2">
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                >
                  Sign In
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Sign in to upload and share your music
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 music-player-bar border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="hover:bg-accent mr-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
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
