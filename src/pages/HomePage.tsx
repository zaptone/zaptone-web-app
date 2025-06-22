import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Music,
  TrendingUp,
  PlayCircle,
  Pause,
  Sparkles
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
        </section>        {/* Music Player Section */}
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
          </div>
        </section>

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
