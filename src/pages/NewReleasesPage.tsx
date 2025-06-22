import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Pause, 
  Heart,
  MoreHorizontal,
  Calendar,
  Sparkles,
  Star,
  Download
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for new releases
const newReleases = [
  {
    id: 1,
    title: 'Future Waves',
    artist: 'Electronic Dreams',
    album: 'Digital Horizons',
    releaseDate: '2024-01-15',
    duration: 245,
    genre: 'Electronic',
    isExclusive: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 2,
    title: 'Moonlight Serenade',
    artist: 'Jazz Collective',
    album: 'Night Sessions',
    releaseDate: '2024-01-14',
    duration: 198,
    genre: 'Jazz',
    isExclusive: false,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 3,
    title: 'Urban Symphony',
    artist: 'City Beats',
    album: 'Street Stories',
    releaseDate: '2024-01-13',
    duration: 223,
    genre: 'Hip Hop',
    isExclusive: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 4,
    title: 'Acoustic Wanderer',
    artist: 'Folk Journey',
    album: 'Mountain Paths',
    releaseDate: '2024-01-12',
    duration: 267,
    genre: 'Folk',
    isExclusive: false,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 5,
    title: 'Cosmic Drift',
    artist: 'Space Ambient',
    album: 'Interstellar',
    releaseDate: '2024-01-11',
    duration: 334,
    genre: 'Ambient',
    isExclusive: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 6,
    title: 'Rock Revolution',
    artist: 'Thunder Strike',
    album: 'Electric Storm',
    releaseDate: '2024-01-10',
    duration: 189,
    genre: 'Rock',
    isExclusive: false,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 7,
    title: 'Classical Fusion',
    artist: 'Modern Orchestra',
    album: 'Contemporary Classics',
    releaseDate: '2024-01-09',
    duration: 278,
    genre: 'Classical',
    isExclusive: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 8,
    title: 'Synthwave Nights',
    artist: 'Retro Future',
    album: 'Neon Dreams',
    releaseDate: '2024-01-08',
    duration: 212,
    genre: 'Synthwave',
    isExclusive: false,
    coverUrl: '',
    url: '/music.mp3'
  }
];

const genres = ['All', 'Electronic', 'Jazz', 'Hip Hop', 'Folk', 'Rock', 'Classical', 'Ambient'];
const timeFilters = ['Today', 'This Week', 'This Month', 'All Time'];

export function NewReleasesPage() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedTime, setSelectedTime] = useState('This Week');
  const { playTrack, pauseTrack, playerState } = useMusic();

  const filteredReleases = selectedGenre === 'All' 
    ? newReleases 
    : newReleases.filter(release => release.genre === selectedGenre);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handlePlayTrack = (track: typeof newReleases[0]) => {
    if (playerState.currentTrack?.id === track.id.toString() && playerState.isPlaying) {
      pauseTrack();
    } else {
      playTrack({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist,
        url: track.url,
        coverUrl: track.coverUrl
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            New Releases
          </h1>
          <p className="text-muted-foreground mt-2">
            Fresh music just dropped - discover the latest tracks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Star className="w-3 h-3 mr-1" />
            Fresh
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground py-2">Genre:</span>
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
        
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground py-2">Time:</span>
          {timeFilters.map((filter) => (
            <Button
              key={filter}
              variant={selectedTime === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTime(filter)}
              className={selectedTime === filter ? 
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                ""
              }
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured New Release */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Featured New Release
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{newReleases[0].title}</h3>
              <p className="text-lg text-muted-foreground mb-2">{newReleases[0].artist}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{newReleases[0].album}</span>
                <span>•</span>
                <span>{formatDate(newReleases[0].releaseDate)}</span>
                <span>•</span>
                <span>{formatDuration(newReleases[0].duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handlePlayTrack(newReleases[0])}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {playerState.currentTrack?.id === newReleases[0].id.toString() && playerState.isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {playerState.currentTrack?.id === newReleases[0].id.toString() && playerState.isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Releases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReleases.slice(1).map((release) => {
          const isCurrentTrack = playerState.currentTrack?.id === release.id.toString();
          const isPlaying = isCurrentTrack && playerState.isPlaying;
          
          return (
            <Card key={release.id} className={`group hover:shadow-lg transition-all duration-300 ${
              isCurrentTrack ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
            }`}>
              <CardHeader className="pb-4">
                <div className="relative">
                  {/* Album Art */}
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Clock className="w-12 h-12 text-purple-600/60" />
                    
                    {release.isExclusive && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                        Exclusive
                      </Badge>
                    )}
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="lg"
                        onClick={() => handlePlayTrack(release)}
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
                  {/* Track Info */}
                  <div>
                    <h3 className={`font-semibold truncate ${
                      isCurrentTrack ? 'text-purple-600' : ''
                    }`}>
                      {release.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {release.artist}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {release.album}
                    </p>
                  </div>

                  {/* Release Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(release.releaseDate)}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {release.genre}
                    </Badge>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(release.duration)}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newReleases.length}</p>
                <p className="text-sm text-muted-foreground">New Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {newReleases.filter(r => r.isExclusive).length}
                </p>
                <p className="text-sm text-muted-foreground">Exclusives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(newReleases.reduce((acc, r) => acc + r.duration, 0) / 60)}
                </p>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
