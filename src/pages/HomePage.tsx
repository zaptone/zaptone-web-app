import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Play, 
  Music,
  TrendingUp,
  PlayCircle,
  Pause,
  Search,
  Clock,
  MoreHorizontal,
  Zap,
  Star,
  Users,
  Radio,
  Disc3,
  Heart,
  ListPlus,
  Share,
  Download,
  Flag
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMusic } from '@/hooks/useMusic';
import LoginDialog from '@/components/auth/LoginDialog';
import { ZapDialog } from '@/components/ZapDialog';

// Trending tracks with Lightning addresses for each artist
const TRENDING_TRACKS = [
  { 
    id: '1', 
    title: 'Midnight Dreams', 
    artist: 'Luna Echo', 
    url: '/music.mp3',
    genre: 'Electronic',
    duration: 222, // in seconds (3:42)
    plays: 2847295,
    likes: 24567,
    isHot: true,
    lnAddress: 'milad@getalby.com'
  },
  { 
    id: '2', 
    title: 'Golden Hour', 
    artist: 'Sunset Collective', 
    url: '/music.mp3',
    genre: 'Indie Pop',
    duration: 258, // in seconds (4:18)
    plays: 1923847,
    likes: 18439,
    isHot: true,
    lnAddress: 'milad@getalby.com'
  },
  { 
    id: '3', 
    title: 'Ocean Waves', 
    artist: 'Blue Horizon', 
    url: '/music.mp3',
    genre: 'Ambient',
    duration: 323, // in seconds (5:23)
    plays: 1456729,
    likes: 12234,
    isHot: false,
    lnAddress: 'milad@getalby.com'
  },
  { 
    id: '4', 
    title: 'City Lights', 
    artist: 'Neon Dreams', 
    url: '/music.mp3',
    genre: 'Synthwave',
    duration: 235, // in seconds (3:55)
    plays: 3291847,
    likes: 31287,
    isHot: true,
    lnAddress: 'milad@getalby.com'
  },
  { 
    id: '5', 
    title: 'Forest Path', 
    artist: 'Nature Sounds', 
    url: '/music.mp3',
    genre: 'Nature',
    duration: 372, // in seconds (6:12)
    plays: 987654,
    likes: 8765,
    isHot: false,
    lnAddress: 'milad@getalby.com'
  },
  { 
    id: '6', 
    title: 'Electric Soul', 
    artist: 'Voltage', 
    url: '/music.mp3',
    genre: 'Electronic',
    duration: 247, // in seconds (4:07)
    plays: 2156789,
    likes: 21456,
    isHot: true,
    lnAddress: 'milad@getalby.com'
  }
];

export default function HomePage() {
  const { user } = useCurrentUser();
  const { playTrack, playerState, pauseTrack, resumeTrack } = useMusic();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [zapDialog, setZapDialog] = useState<{ 
    open: boolean; 
    recipient?: {
      pubkey: string;
      name: string;
      picture?: string;
      lnAddress: string;
    }; 
    content?: {
      type: 'track';
      title: string;
      id: string;
    }
  }>({ 
    open: false 
  });
  const navigate = useNavigate();

  const handlePlayTrack = (track: typeof TRENDING_TRACKS[0]) => {
    const isCurrentTrack = playerState.currentTrack?.id === track.id;
    
    if (isCurrentTrack && playerState.isPlaying) {
      pauseTrack();
    } else if (isCurrentTrack && !playerState.isPlaying) {
      resumeTrack();
    } else {
      playTrack(track);
    }
  };

  const handleZap = (track: typeof TRENDING_TRACKS[0]) => {
    setZapDialog({
      open: true,
      recipient: {
        pubkey: `artist_${track.id}`,
        name: track.artist,
        picture: undefined,
        lnAddress: track.lnAddress
      },
      content: {
        type: 'track' as const,
        title: track.title,
        id: track.id
      }
    });
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    }
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ZapTone
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover trending music from independent artists worldwide
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for music, artists, or genres..."
              className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Quick Actions */}
        {user && (
          <div className="flex justify-center gap-4 mb-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/upload')}
              className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/20 px-6 py-3"
            >
              <Music className="w-4 h-4 mr-2" />
              Upload Music
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/library')}
              className="px-6 py-3"
            >
              <Disc3 className="w-4 h-4 mr-2" />
              My Library
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/radio')}
              className="px-6 py-3"
            >
              <Radio className="w-4 h-4 mr-2" />
              Radio
            </Button>
          </div>
        )}

        {/* Trending Music Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground">Most popular tracks this week</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/trending')}>
              View All
            </Button>
          </div>

          <div className="space-y-2">
            {TRENDING_TRACKS.map((track, index) => (
              <TrendingTrackCard 
                key={track.id} 
                track={track}
                rank={index + 1}
                onPlay={() => handlePlayTrack(track)}
                onZap={() => handleZap(track)}
                isPlaying={playerState.currentTrack?.id === track.id && playerState.isPlaying}
                isCurrent={playerState.currentTrack?.id === track.id}
                formatPlays={formatPlays}
                formatDuration={formatDuration}
              />
            ))}
          </div>
        </div>

        {/* Featured Artists Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Featured Artists</h2>
              <p className="text-muted-foreground">Discover talented independent artists</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Luna Echo', 'Sunset Collective', 'Neon Dreams', 'Blue Horizon'].map((artist, index) => (
              <Card key={artist} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={`/placeholder-artist-${index + 1}.jpg`} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {artist.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{artist}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{Math.floor(Math.random() * 50 + 10)}K followers</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        {!user && (
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white max-w-lg mx-auto">
              <CardContent className="p-10">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Join ZapTone</h3>
                <p className="text-white/90 mb-6">
                  Upload your music, connect with fans worldwide, and earn Bitcoin through Lightning Network
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 px-8"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Get Started for Free
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLogin={() => setShowLoginDialog(false)}
      />

      {/* Zap Dialog */}
      <ZapDialog
        open={zapDialog.open}
        onOpenChange={(open) => setZapDialog({ ...zapDialog, open })}
        recipient={zapDialog.recipient || { pubkey: '', name: '' }}
        content={zapDialog.content}
      />
    </div>
  );
}

// Enhanced Track Card Component
interface TrendingTrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: number;
    plays: number;
    likes: number;
    isHot: boolean;
  };
  rank: number;
  onPlay: () => void;
  onZap: () => void;
  isPlaying: boolean;
  isCurrent: boolean;
  formatPlays: (plays: number) => string;
  formatDuration: (seconds: number) => string;
}

function TrendingTrackCard({ track, rank, onPlay, onZap, isPlaying, isCurrent, formatPlays, formatDuration }: TrendingTrackCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(track.likes);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showZapAnimation, setShowZapAnimation] = useState(false);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    if (newLikedState) {
      // Show heart animation
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 800); // Shorter duration for simple animation
      
      toast({
        title: "❤️ Liked!",
        description: `"${track.title}" has been added to your liked songs`,
      });
    } else {
      toast({
        title: "Removed from Liked Songs",
        description: `"${track.title}" has been removed from your liked songs`,
      });
    }
  };

  const handleAddToPlaylist = () => {
    toast({
      title: "Added to Playlist",
      description: `"${track.title}" has been added to your playlist`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out "${track.title}" by ${track.artist} on ZapTone!`);
    toast({
      title: "Link Copied",
      description: "Track link has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading "${track.title}"...`,
    });
  };

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting this content",
      variant: "destructive"
    });
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
      isCurrent ? 'bg-accent border-accent-foreground/20 shadow-sm' : ''
    }`}>
      <CardContent className="p-2">
        <div className="relative">
          {/* Main Content Row */}
          <div className="flex items-center gap-3">
            {/* Rank */}
            <div className="flex items-center justify-center w-6 h-6 text-sm font-bold text-muted-foreground/70">
              {rank}
            </div>
            
            {/* Album Art & Play Button */}
            <div className="relative">
              <Button 
                size="sm" 
                onClick={onPlay}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all p-0 shadow-lg [&_svg]:!size-6"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : isCurrent ? (
                  <PlayCircle className="w-6 h-6 text-white" />
                ) : (
                  <>
                    <Music className="w-6 h-6 text-white group-hover:hidden" />
                    <PlayCircle className="w-6 h-6 text-white hidden group-hover:block" />
                  </>
                )}
              </Button>
            </div>
            
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className={`font-semibold text-sm truncate ${isCurrent ? 'text-purple-600' : ''}`}>
                  {track.title}
                </h3>
                {track.isHot && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5 bg-red-500 hover:bg-red-500 border-0">
                    HOT
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground truncate text-xs">{track.artist}</p>
                <Separator orientation="vertical" className="h-2.5" />
                <Badge variant="secondary" className="text-xs px-1 bg-muted/50">
                  {track.genre}
                </Badge>
              </div>
            </div>
            
            {/* Duration & Stats */}
            <div className="hidden lg:flex flex-col items-end gap-0.5 text-xs text-muted-foreground min-w-0">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{formatDuration(track.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                <span className="font-medium">{formatPlays(track.plays)}</span>
              </div>
            </div>
            
            {/* Playing Indicator */}
            {isPlaying && (
              <div className="flex items-center gap-0.5 mr-2">
                <div className="w-0.5 h-2 bg-purple-500 rounded-full animate-pulse" />
                <div className="w-0.5 h-3 bg-purple-500 rounded-full animate-pulse delay-75" />
                <div className="w-0.5 h-2 bg-purple-500 rounded-full animate-pulse delay-150" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Like Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLike}
                  className={`transition-all px-2 py-1 text-xs cursor-pointer flex items-center gap-1 ${
                    isLiked 
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' 
                      : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                  }`}
                >
                  <Heart className={`w-3 h-3 transition-all ${isLiked ? 'fill-red-500' : ''}`} />
                  <span className="text-xs font-medium">{formatPlays(likeCount)}</span>
                </Button>
                
                {/* Heart Animation */}
                {showHeartAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border-2 border-red-500 rounded-full animate-heart-ripple" />
                  </div>
                )}
              </div>

              {/* Zap Button */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowZapAnimation(true);
                    setTimeout(() => setShowZapAnimation(false), 800);
                    onZap();
                  }}
                  className="text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950/20 transition-all px-2 py-1 text-xs cursor-pointer"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Zap
                </Button>

                {/* Zap Animation */}
                {showZapAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border-2 border-yellow-500 rounded-full animate-zap-ripple" />
                  </div>
                )}
              </div>

              {/* More Options - Aligned with action buttons */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100 transition-opacity p-1">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleAddToPlaylist}>
                    <ListPlus className="w-4 h-4 mr-2" />
                    Add to Playlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Track
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleReport} className="text-destructive">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
