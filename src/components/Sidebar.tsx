import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Search, 
  Music2, 
  Upload, 
  Heart,
  Settings,
  User,
  TrendingUp,
  Radio,
  Disc3,
  ListMusic as Playlist,
  Clock,
  Download,
  Headphones,
  Zap,
  LogOut,
  Video,
  ShoppingBag,
  BarChart3
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoginDialog from '@/components/auth/LoginDialog';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, metadata } = useCurrentUser();
  const { logout } = useLoginActions();  const [showLogin, setShowLogin] = useState(false);  const navigation = [
    { name: 'Home', href: '/', icon: Home, description: 'Discover music' },
    { name: 'Search', href: '/search', icon: Search, description: 'Find songs, artists' },
    { name: 'Library', href: '/library', icon: Music2, description: 'Your collection' },
    { name: 'Upload', href: '/upload', icon: Upload, description: 'Share your music' },
    { name: 'Liked Songs', href: '/liked', icon: Heart, description: 'Your favorites' },  ];
  const discover = [
    { name: 'Live Stream', href: '/live', icon: Video },
    { name: 'Live Streaming', href: '/live-streaming', icon: Video },
    { name: 'Store', href: '/store', icon: ShoppingBag },
    { name: 'Merchandise', href: '/merchandise', icon: ShoppingBag },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Radio', href: '/radio', icon: Radio },
    { name: 'Charts', href: '/charts', icon: Disc3 },
    { name: 'New Releases', href: '/new', icon: Clock }
  ];

  const yourLibrary = [
    { name: 'Recently Played', href: '/recent', icon: Clock },
    { name: 'Downloaded', href: '/downloads', icon: Download },
    { name: 'Made for You', href: '/for-you', icon: User }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const userDisplayName = metadata?.name || `User ${user?.pubkey.slice(0, 8)}`;
  const userPicture = metadata?.picture;  return (
    <div className={`flex flex-col bg-gradient-to-b from-muted/40 to-muted/20 border-r border-border/50 ${className}`} style={{ height: '100%' }}>      {/* Header - Fixed at top */}
      <div className="p-6 border-b border-border/30" style={{ flexShrink: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ZapTone
              </h1>
              <p className="text-xs text-muted-foreground">Decentralized Music</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Scrollable Content - Takes remaining space but leaves room for profile */}
      <div style={{ flex: '1', overflow: 'hidden' }}>
        <ScrollArea className="px-4" style={{ height: '100%' }}>
          <div className="space-y-6 py-4">
          {/* Main Navigation */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Discover
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 px-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-foreground font-medium border border-purple-500/20 shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-purple-600' : ''}`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Discover Section */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Explore
            </h2>
            <div className="space-y-1">
              {discover.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Your Library */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Your Library
            </h2>
            <div className="space-y-1">
              {yourLibrary.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Recently Played */}
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Quick Access
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Chill Vibes', type: 'Playlist', tracks: 24 },
                { name: 'Electronic Mix', type: 'Playlist', tracks: 18 },
                { name: 'Jazz Collection', type: 'Playlist', tracks: 31 }
              ].map((playlist, index) => (
                <div 
                  key={playlist.name}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 cursor-pointer group"
                  onClick={() => navigate(`/playlist/${index + 1}`)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Playlist className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground">{playlist.tracks} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>        </div>
        </ScrollArea>
      </div>      {/* Bottom Section - Fixed at bottom */}
      <div className="p-3 border-t border-border/30 bg-background/50 backdrop-blur-sm" style={{ flexShrink: 0 }}>
        {user ? (
          <div className="w-full">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-background/70 border border-border/30 w-full">
              <Avatar className="w-10 h-10 ring-2 ring-purple-500/20 flex-shrink-0">
                {userPicture && <AvatarImage src={userPicture} />}
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-sm font-medium">
                  {userDisplayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate flex-1">{userDisplayName}</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30 flex-shrink-0">
                    <Headphones className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pro Member
                </p>
              </div>
              
              {/* User Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{userDisplayName}</p>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30">
                          <Headphones className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {user.pubkey.slice(0, 16)}...
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/premium')}>
                    <Zap className="w-4 h-4 mr-2" />
                    Premium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Login Section */}
            <Button 
              onClick={() => setShowLogin(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium h-11"
            >
              <User className="w-4 h-4 mr-2" />
              Sign in with Nostr
            </Button>
            <p className="text-xs text-muted-foreground text-center px-2">
              Connect your Nostr identity to access all features
            </p>
          </div>
        )}
      </div>{/* Login Dialog */}
      <LoginDialog 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => setShowLogin(false)}
      />
    </div>
  );
}