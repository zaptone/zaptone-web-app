import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Upload,
  Music,
  TrendingUp,
  Clock,
  Users,
  Headphones,
  Star,
  Zap,
  PlayCircle,
  Eye,
  Download
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMusic } from '@/hooks/useMusic';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl?: string;
  plays: number;
  likes: number;
  isLiked?: boolean;
  genre: string;
  uploadedAt: string;
}

interface Artist {
  id: string;
  name: string;
  followers: number;
  avatar?: string;
  verified: boolean;
  tracksCount: number;
}

const featuredTracks: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'SynthWave Master',
    duration: '4:12',
    plays: 25420,
    likes: 1850,
    isLiked: false,
    genre: 'Electronic',
    uploadedAt: '1 hour ago'
  },
  {
    id: '2',
    title: 'Midnight Jazz',
    artist: 'Urban Collective',
    duration: '3:45',
    plays: 18934,
    likes: 1245,
    isLiked: true,
    genre: 'Jazz',
    uploadedAt: '3 hours ago'
  },
  {
    id: '3',
    title: 'Digital Sunset',
    artist: 'Future Sounds',
    duration: '5:22',
    plays: 34891,
    likes: 2876,
    isLiked: false,
    genre: 'Ambient',
    uploadedAt: '6 hours ago'
  },
  {
    id: '4',
    title: 'City Lights',
    artist: 'Metro Vibes',
    duration: '3:58',
    plays: 15632,
    likes: 1123,
    isLiked: true,
    genre: 'Lo-Fi',
    uploadedAt: '12 hours ago'
  }
];

const trendingArtists: Artist[] = [
  {
    id: '1',
    name: 'SynthWave Master',
    followers: 12500,
    verified: true,
    tracksCount: 24
  },
  {
    id: '2',
    name: 'Urban Collective',
    followers: 8200,
    verified: false,
    tracksCount: 18
  },
  {
    id: '3',
    name: 'Future Sounds',
    followers: 15700,
    verified: true,
    tracksCount: 32
  },
  {
    id: '4',
    name: 'Metro Vibes',
    followers: 6800,
    verified: false,
    tracksCount: 15
  }
];

const recentTracks: Track[] = [
  {
    id: '5',
    title: 'Electric Dreams',
    artist: 'Volt Collective',
    duration: '3:33',
    plays: 5420,
    likes: 340,
    isLiked: false,
    genre: 'Electronic',
    uploadedAt: '30 minutes ago'
  },
  {
    id: '6',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    duration: '4:45',
    plays: 2180,
    likes: 156,
    isLiked: false,
    genre: 'Ambient',
    uploadedAt: '45 minutes ago'
  }
];

export default function HomePage() {
  const { user } = useCurrentUser();
  const { playTrack } = useMusic();

  const handlePlayTrack = (track: Track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: `/api/tracks/${track.id}/stream`,
      coverUrl: track.coverUrl
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative p-6 lg:p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-2xl" />
        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              ZapTone
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The future of music is decentralized. Discover independent artists, support creators with Lightning payments, and own your music experience.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {user ? (
              <>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your Music
                </Button>
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-950">
                  <Headphones className="w-5 h-5 mr-2" />
                  Discover Music
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                  <Music className="w-5 h-5 mr-2" />
                  Start Listening
                </Button>
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-950">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-purple-500">32K+</div>
              <div className="text-sm text-muted-foreground">Active Tracks</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-pink-500">2.1M+</div>
              <div className="text-sm text-muted-foreground">Total Streams</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-orange-500">12K+</div>
              <div className="text-sm text-muted-foreground">Artists</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-500">48K+</div>
              <div className="text-sm text-muted-foreground">Lightning Zaps</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Tracks Section */}
      <div className="px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Featured Tracks</h2>
            <p className="text-muted-foreground">Handpicked tracks from our community</p>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredTracks.map((track) => (
            <Card key={track.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    {track.coverUrl ? (
                      <img 
                        src={track.coverUrl} 
                        alt={track.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Music className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-lg mb-1 group-hover:text-purple-500 transition-colors">
                    {track.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mb-2">
                    <span>{track.artist}</span>
                    <Badge variant="secondary" className="text-xs">
                      {track.genre}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{track.duration}</span>
                  <span>{track.uploadedAt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {formatNumber(track.plays)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className={`w-3 h-3 ${track.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                      {formatNumber(track.likes)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="p-1 h-auto hover:text-red-500">
                      <Heart className={`w-4 h-4 ${track.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1 h-auto hover:text-yellow-500">
                      <Zap className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1 h-auto">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Artists Section */}
      <div className="px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Trending Artists</h2>
            <p className="text-muted-foreground">Rising stars in the ZapTone community</p>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            <TrendingUp className="w-4 h-4 mr-2" />
            See More
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingArtists.map((artist) => (
            <Card key={artist.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-purple-200 dark:ring-purple-800">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-semibold">{artist.name}</h3>
                    {artist.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{formatNumber(artist.followers)} followers</p>
                    <p>{artist.tracksCount} tracks</p>
                  </div>
                  
                  <Button size="sm" className="mt-4 w-full" variant="outline">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Uploads Section */}
      <div className="px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Fresh Uploads</h2>
            <p className="text-muted-foreground">Latest tracks from our artists</p>
          </div>
          <Button variant="outline" className="hidden sm:flex">
            <Clock className="w-4 h-4 mr-2" />
            View All Recent
          </Button>
        </div>

        <div className="space-y-4">
          {recentTracks.map((track, index) => (
            <Card key={track.id} className="group hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {track.coverUrl ? (
                        <img 
                          src={track.coverUrl} 
                          alt={track.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate group-hover:text-purple-500 transition-colors">
                      {track.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{track.artist}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {track.genre}
                      </Badge>
                      <span>•</span>
                      <span>{track.uploadedAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {formatNumber(track.plays)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(track.likes)}
                    </span>
                    <span>{track.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 lg:px-8 pb-12">
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Music?</h2>
            <p className="text-lg mb-6 text-purple-100">
              Join thousands of independent artists already earning from their passion
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Upload Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
