import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Music,
  TrendingUp,
  PlayCircle,
  Pause,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Mic,
  Headphones,
  Shield,
  Palette,
  BarChart3,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMusic } from '@/hooks/useMusic';

// Sample tracks using the music.mp3 file
const SAMPLE_TRACKS = [
  { 
    id: '1', 
    title: 'Summer Vibes', 
    artist: 'Electronic Artist', 
    url: '/music.mp3',
    genre: 'Electronic',
    plays: 1240
  },
  { 
    id: '2', 
    title: 'Chill Beats', 
    artist: 'Lo-Fi Producer', 
    url: '/music.mp3',
    genre: 'Lo-Fi',
    plays: 892
  },
  { 
    id: '3', 
    title: 'Ambient Dreams', 
    artist: 'Ambient Collective', 
    url: '/music.mp3',
    genre: 'Ambient',
    plays: 1567
  },
  { 
    id: '4', 
    title: 'Jazz Fusion', 
    artist: 'Jazz Masters', 
    url: '/music.mp3',
    genre: 'Jazz',
    plays: 743
  }
];

export default function HomePage() {
  const { user } = useCurrentUser();
  const { playTrack, playerState, pauseTrack, resumeTrack } = useMusic();

  const handlePlayTrack = (track: typeof SAMPLE_TRACKS[0]) => {
    const isCurrentTrack = playerState.currentTrack?.id === track.id;
    
    if (isCurrentTrack && playerState.isPlaying) {
      pauseTrack();
    } else if (isCurrentTrack && !playerState.isPlaying) {
      resumeTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Decentralized Music Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ZapTone
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover music, support artists directly, and experience decentralized music streaming.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of music with our decentralized platform that puts artists and fans first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Decentralized Platform */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Decentralized Platform</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Own your music completely. No intermediaries, no gatekeepers. Your art, your rules, your revenue.
                </p>
              </CardContent>
            </Card>

            {/* Lightning Payments */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Lightning Payments</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get paid instantly via Bitcoin Lightning Network. Fans can send you Zaps directly with zero intermediaries and minimal fees.
                </p>
              </CardContent>
            </Card>

            {/* Global Reach */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Global Reach</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with fans worldwide without geographical restrictions. Borderless music distribution.
                </p>
              </CardContent>
            </Card>

            {/* Online Radio */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Online Radio</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create your own decentralized radio stations. Curate playlists and broadcast to global audiences 24/7.
                </p>
              </CardContent>
            </Card>

            {/* Live Streaming */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Live Streaming</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perform live concerts and interact with fans in real-time. Receive instant Lightning tips during performances.
                </p>
              </CardContent>
            </Card>

            {/* HD Streaming */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">HD Streaming</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Experience crystal-clear audio with lossless streaming. Support for high-resolution formats up to 24-bit/192kHz.
                </p>
              </CardContent>
            </Card>

            {/* Secure & Private */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Secure & Private</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nostr protocol-powered security ensures your content and data remain protected and under your control.
                </p>
              </CardContent>
            </Card>

            {/* Creative Freedom */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Creative Freedom</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Express yourself without censorship. Upload, share, and monetize any genre, any style, any vision.
                </p>
              </CardContent>
            </Card>

            {/* Real-time Analytics */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track your performance with detailed insights. Understand your audience and optimize your strategy.
                </p>
              </CardContent>
            </Card>

            {/* Merchandise Store */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Merchandise Store</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sell your physical products directly to fans. T-shirts, vinyl records, artwork, and exclusive collectibles.
                </p>
              </CardContent>
            </Card>

            {/* Buy The Art */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Buy The Art</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Purchase original artwork, limited editions, and signed memorabilia directly from your favorite artists.
                </p>
              </CardContent>
            </Card>

            {/* Direct Support */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Direct Support</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Support artists directly through merchandise sales, exclusive content, and special fan experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Music Player Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Featured Tracks</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SAMPLE_TRACKS.map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onPlay={() => handlePlayTrack(track)}
                isPlaying={playerState.currentTrack?.id === track.id && playerState.isPlaying}
                isCurrent={playerState.currentTrack?.id === track.id}
              />
            ))}
          </div>        </section>

        {/* Welcome Message */}
        {!user && (
          <section className="text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Join ZapTone Today</h2>
                <p className="text-white/90 mb-6">
                  Connect with your Nostr identity to upload music, create playlists, and support artists.
                </p>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  Sign in with Nostr
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

      </div>
    </div>
  );
}

// Simple Track Card Component
interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    genre: string;
    plays: number;
  };
  onPlay: () => void;
  isPlaying: boolean;
  isCurrent: boolean;
}

function TrackCard({ track, onPlay, isPlaying, isCurrent }: TrackCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
      isCurrent ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            {/* Play Button Overlay */}
            <Button 
              size="sm" 
              onClick={onPlay}
              className={`absolute inset-0 w-16 h-16 rounded-lg transition-all ${
                isCurrent 
                  ? 'opacity-100 bg-black/70 hover:bg-black/80' 
                  : 'opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <PlayCircle className="w-6 h-6 text-white" />
              )}
            </Button>
          </div>
          
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${isCurrent ? 'text-purple-600' : ''}`}>
              {track.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="text-xs">
                {track.genre}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Play className="w-3 h-3" />
                {track.plays.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Playing Indicator */}
          {isPlaying && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse delay-150" />
            </div>
          )}        </div>
      </CardContent>
    </Card>
  );
}
