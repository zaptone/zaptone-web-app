import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  Users,
  MapPin,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for radio stations
const radioStations = [
  {
    id: 1,
    name: 'Chill Beats FM',
    genre: 'Lo-fi Hip Hop',
    description: 'Relaxing beats for study and work',
    listeners: 12543,
    location: 'Global',
    isLive: true,
    coverUrl: '',
    currentTrack: 'Midnight Coffee by Beats Collective'
  },
  {
    id: 2,
    name: 'Electronic Pulse',
    genre: 'Electronic',
    description: 'The best electronic music 24/7',
    listeners: 8921,
    location: 'Berlin',
    isLive: true,
    coverUrl: '',
    currentTrack: 'Neon Dreams by Synthwave Artist'
  },
  {
    id: 3,
    name: 'Jazz & Soul',
    genre: 'Jazz',
    description: 'Classic and modern jazz',
    listeners: 5432,
    location: 'New York',
    isLive: true,
    coverUrl: '',
    currentTrack: 'Blue Note Sessions'
  },
  {
    id: 4,
    name: 'Indie Rock Station',
    genre: 'Indie Rock',
    description: 'Discover new indie artists',
    listeners: 7234,
    location: 'London',
    isLive: false,
    coverUrl: '',
    currentTrack: 'Alternative Waves'
  },
  {
    id: 5,
    name: 'World Music',
    genre: 'World',
    description: 'Music from around the globe',
    listeners: 3876,
    location: 'Global',
    isLive: true,
    coverUrl: '',
    currentTrack: 'Global Rhythms'
  },
  {
    id: 6,
    name: 'Classical Focus',
    genre: 'Classical',
    description: 'Perfect for concentration',
    listeners: 2156,
    location: 'Vienna',
    isLive: true,
    coverUrl: '',
    currentTrack: 'Piano Sonata in C Minor'
  }
];

const genres = ['All', 'Electronic', 'Jazz', 'Lo-fi', 'Rock', 'Classical', 'World'];

export function RadioPage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [playingStation, setPlayingStation] = useState<number | null>(null);
  const { playTrack, pauseTrack, playerState } = useMusic();

  const filteredStations = selectedGenre === 'All' 
    ? radioStations 
    : radioStations.filter(station => 
        station.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
  const handlePlayStation = (station: typeof radioStations[0]) => {
    if (playingStation === station.id && playerState.isPlaying) {
      pauseTrack();
    } else {
      playTrack({
        id: `radio-${station.id}`,
        title: station.currentTrack,
        artist: station.name,
        url: '', // Radio streams don't have direct URLs
        coverUrl: station.coverUrl
      });
      setPlayingStation(station.id);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Radio Stations
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover live radio streams from around the world
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Live
          </Badge>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 flex-wrap">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGenre(genre)}
            className={selectedGenre === genre ? 
              "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
              ""
            }
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* Radio Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map((station) => (
          <Card key={station.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {station.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {station.genre}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {station.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Station Cover/Visual */}
              <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <Radio className="w-12 h-12 text-purple-600/60" />
                {station.isLive && (
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                    Live
                  </Badge>
                )}
              </div>

              {/* Currently Playing */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Now Playing</p>
                <p className="text-sm font-medium truncate">{station.currentTrack}</p>
              </div>

              {/* Station Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{station.listeners.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{station.location}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">                <Button
                  onClick={() => handlePlayStation(station)}
                  className={`flex-1 mr-2 ${
                    playingStation === station.id && playerState.isPlaying
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                  disabled={!station.isLive}
                >
                  {playingStation === station.id && playerState.isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {playingStation === station.id && playerState.isPlaying ? 'Pause' : 'Listen'}
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{radioStations.length}</p>
                <p className="text-sm text-muted-foreground">Active Stations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {radioStations.reduce((acc, station) => acc + station.listeners, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Listeners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {radioStations.filter(s => s.isLive).length}
                </p>
                <p className="text-sm text-muted-foreground">Live Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
