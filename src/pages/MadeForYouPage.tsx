import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Play, 
  Pause, 
  Heart,
  MoreHorizontal,
  Shuffle,
  Star,
  Clock,
  TrendingUp,
  Headphones,
  Music,
  Sparkles
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for personalized content
const recommendedPlaylists = [
  {
    id: 1,
    name: 'Discover Weekly',
    description: 'Your weekly mix of fresh music',
    trackCount: 30,
    totalDuration: 7200, // seconds
    coverColor: 'from-green-500 to-emerald-600',
    lastUpdated: '2024-01-15',
    isPersonalized: true,
    reason: 'Based on your recent listening'
  },
  {
    id: 2,
    name: 'Release Radar',
    description: 'New releases from artists you follow',
    trackCount: 25,
    totalDuration: 6300,
    coverColor: 'from-blue-500 to-cyan-600',
    lastUpdated: '2024-01-15',
    isPersonalized: true,
    reason: 'New from your favorite artists'
  },
  {
    id: 3,
    name: 'Daily Mix 1',
    description: 'Electronic, Synthwave and more',
    trackCount: 50,
    totalDuration: 12000,
    coverColor: 'from-purple-500 to-indigo-600',
    lastUpdated: '2024-01-15',
    isPersonalized: true,
    reason: 'You love electronic music'
  },
  {
    id: 4,
    name: 'Daily Mix 2',
    description: 'Jazz, Lo-fi and chill vibes',
    trackCount: 45,
    totalDuration: 10800,
    coverColor: 'from-orange-500 to-red-600',
    lastUpdated: '2024-01-15',
    isPersonalized: true,
    reason: 'Perfect for your chill sessions'
  },
  {
    id: 5,
    name: 'Your 2024 Rewind',
    description: 'Your top tracks this year',
    trackCount: 100,
    totalDuration: 24000,
    coverColor: 'from-pink-500 to-rose-600',
    lastUpdated: '2024-01-14',
    isPersonalized: true,
    reason: 'Your most played songs'
  },
  {
    id: 6,
    name: 'Recommended Radio',
    description: 'Artists similar to your taste',
    trackCount: 0, // Radio doesn't have fixed count
    totalDuration: 0,
    coverColor: 'from-teal-500 to-cyan-600',
    lastUpdated: '2024-01-15',
    isPersonalized: true,
    reason: 'Based on your music DNA'
  }
];

const recentlyPlayedArtists = [
  { name: 'Chill Collective', plays: 45 },
  { name: 'Synthwave Master', plays: 32 },
  { name: 'Jazz Trio', plays: 28 },
  { name: 'Electronic Dreams', plays: 23 },
  { name: 'Nature Sounds', plays: 19 }
];

const musicMoods = [
  { name: 'Focus', tracks: 150, color: 'from-blue-500 to-indigo-600' },
  { name: 'Workout', tracks: 89, color: 'from-red-500 to-orange-600' },
  { name: 'Chill', tracks: 203, color: 'from-green-500 to-teal-600' },
  { name: 'Party', tracks: 67, color: 'from-purple-500 to-pink-600' },
  { name: 'Sleep', tracks: 45, color: 'from-indigo-500 to-purple-600' },
  { name: 'Study', tracks: 112, color: 'from-teal-500 to-cyan-600' }
];

export function MadeForYouPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { playTrack, playerState } = useMusic();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handlePlayPlaylist = (playlist: typeof recommendedPlaylists[0]) => {
    // Mock playing first track from playlist
    playTrack({
      id: `playlist-${playlist.id}`,
      title: `${playlist.name} - Track 1`,
      artist: 'Various Artists',
      url: '/music.mp3',
      coverUrl: ''
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Made for You
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalized playlists and recommendations based on your taste
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Star className="w-3 h-3 mr-1" />
            Personalized
          </Badge>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Hours Listened</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">2,843</p>
                <p className="text-xs text-muted-foreground">Tracks Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Artists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Match Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Playlists */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Personal Mixes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedPlaylists.map((playlist) => {
            const isCurrentTrack = playerState.currentTrack?.id === `playlist-${playlist.id}`;
            const isPlaying = isCurrentTrack && playerState.isPlaying;
            
            return (
              <Card key={playlist.id} className={`group hover:shadow-lg transition-all duration-300 ${
                isCurrentTrack ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
              }`}>
                <CardHeader className="pb-4">
                  <div className="relative">
                    {/* Playlist Cover */}
                    <div className={`w-full h-48 bg-gradient-to-br ${playlist.coverColor} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-center text-white">
                        <Music className="w-12 h-12 mx-auto mb-2 opacity-80" />
                        <div className="text-xs font-medium opacity-90">{playlist.name}</div>
                      </div>
                      
                      {playlist.isPersonalized && (
                        <Badge className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          For You
                        </Badge>
                      )}
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="lg"
                          onClick={() => handlePlayPlaylist(playlist)}
                          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Playlist Info */}
                    <div>
                      <h3 className={`font-semibold truncate ${
                        isCurrentTrack ? 'text-purple-600' : ''
                      }`}>
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {playlist.description}
                      </p>
                      <p className="text-xs text-purple-600 font-medium mt-1">
                        {playlist.reason}
                      </p>
                    </div>

                    {/* Playlist Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {playlist.trackCount > 0 && (
                          <span>{playlist.trackCount} songs</span>
                        )}
                        {playlist.totalDuration > 0 && (
                          <span>{formatDuration(playlist.totalDuration)}</span>
                        )}
                      </div>
                      <span>Updated {new Date(playlist.lastUpdated).toLocaleDateString()}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayPlaylist(playlist)}
                        className="flex-1 mr-2"
                      >
                        {isPlaying ? (
                          <Pause className="w-3 h-3 mr-1" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Music for Your Mood */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Music for Your Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {musicMoods.map((mood) => (
            <Card 
              key={mood.name} 
              className={`group cursor-pointer hover:shadow-md transition-all duration-300 ${
                selectedMood === mood.name ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
              }`}
              onClick={() => setSelectedMood(selectedMood === mood.name ? null : mood.name)}
            >
              <CardContent className="p-4">
                <div className={`w-full h-24 bg-gradient-to-br ${mood.color} rounded-lg flex items-center justify-center mb-3`}>
                  <div className="text-center text-white">
                    <Headphones className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-xs font-medium">{mood.name}</div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm">{mood.name}</h3>
                  <p className="text-xs text-muted-foreground">{mood.tracks} tracks</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Artists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Your Top Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentlyPlayedArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center gap-4">
                  <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600/60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.plays} plays this month</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Shuffle className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Shuffle My Music</div>
                  <div className="text-xs text-muted-foreground">Play all your favorite tracks</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Star className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Liked Songs</div>
                  <div className="text-xs text-muted-foreground">All your hearted tracks</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <Clock className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Recently Played</div>
                  <div className="text-xs text-muted-foreground">Continue where you left off</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start gap-3 h-12" variant="outline">
                <TrendingUp className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">Discover New</div>
                  <div className="text-xs text-muted-foreground">Find music you'll love</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
