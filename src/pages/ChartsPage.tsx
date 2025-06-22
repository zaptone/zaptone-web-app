import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Play, 
  Pause, 
  Heart,
  MoreHorizontal,
  Trophy,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for charts
const topTracks = [
  {
    id: 1,
    title: 'Midnight Vibes',
    artist: 'Chill Collective',
    position: 1,
    previousPosition: 2,
    streams: 2543210,
    duration: 195,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 2,
    title: 'Electric Dreams',
    artist: 'Synthwave Master',
    position: 2,
    previousPosition: 1,
    streams: 2198763,
    duration: 234,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    position: 3,
    previousPosition: 4,
    streams: 1876543,
    duration: 289,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 4,
    title: 'Urban Beat',
    artist: 'City Rhythms',
    position: 4,
    previousPosition: 3,
    streams: 1654321,
    duration: 203,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 5,
    title: 'Cosmic Journey',
    artist: 'Space Ambient',
    position: 5,
    previousPosition: 7,
    streams: 1432109,
    duration: 367,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 6,
    title: 'Jazz Noir',
    artist: 'Smooth Jazz Trio',
    position: 6,
    previousPosition: 5,
    streams: 1298765,
    duration: 256,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 7,
    title: 'Digital Pulse',
    artist: 'Electronic Fusion',
    position: 7,
    previousPosition: 8,
    streams: 1187654,
    duration: 198,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 8,
    title: 'Mountain Echo',
    artist: 'Folk Wanderer',
    position: 8,
    previousPosition: 6,
    streams: 1076543,
    duration: 224,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 9,
    title: 'Neon Nights',
    artist: 'Retro Wave',
    position: 9,
    previousPosition: 12,
    streams: 987654,
    duration: 213,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 10,
    title: 'Sunrise Melody',
    artist: 'Morning Light',
    position: 10,
    previousPosition: 9,
    streams: 876543,
    duration: 187,
    coverUrl: '',
    url: '/music.mp3'
  }
];

const chartTypes = ['Global', 'Regional', 'Genre', 'New Music'];
const timeRanges = ['Daily', 'Weekly', 'Monthly', 'All Time'];

export function ChartsPage() {
  const [selectedChart, setSelectedChart] = useState('Global');
  const [selectedTime, setSelectedTime] = useState('Weekly');
  const { playTrack, pauseTrack, playerState } = useMusic();

  const getPositionChange = (current: number, previous: number) => {
    if (current < previous) return 'up';
    if (current > previous) return 'down';
    return 'same';
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <ArrowUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: typeof topTracks[0]) => {
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
            Music Charts
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover what's trending in the world of music
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Flame className="w-3 h-3 mr-1" />
            Hot Charts
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground py-2">Chart Type:</span>
          {chartTypes.map((type) => (
            <Button
              key={type}
              variant={selectedChart === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChart(type)}
              className={selectedChart === type ? 
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                ""
              }
            >
              {type}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground py-2">Time Range:</span>
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedTime === range ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTime(range)}
              className={selectedTime === range ? 
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                ""
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Top 10 - {selectedChart} ({selectedTime})
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Top Tracks List */}
      <div className="space-y-2">
        {topTracks.map((track) => {
          const change = getPositionChange(track.position, track.previousPosition);
          const isCurrentTrack = playerState.currentTrack?.id === track.id.toString();
          const isPlaying = isCurrentTrack && playerState.isPlaying;
          
          return (
            <Card key={track.id} className={`group hover:shadow-md transition-all duration-300 ${
              isCurrentTrack ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className={`text-2xl font-bold ${
                      track.position <= 3 ? 'text-yellow-600' : 'text-muted-foreground'
                    }`}>
                      {track.position}
                    </span>
                    {getChangeIcon(change)}
                  </div>

                  {/* Album Art */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative">
                    <TrendingUp className="w-6 h-6 text-purple-600/60" />
                    {track.position <= 3 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 bg-yellow-500 hover:bg-yellow-600">
                        <Trophy className="w-2.5 h-2.5 text-white" />
                      </Badge>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      isCurrentTrack ? 'text-purple-600' : ''
                    }`}>
                      {track.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex flex-col items-end text-sm text-muted-foreground">
                    <span>{track.streams.toLocaleString()} streams</span>
                    <span>{formatDuration(track.duration)}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayTrack(track)}
                      className={isPlaying ? 'text-purple-600' : ''}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {topTracks.reduce((acc, track) => acc + track.streams, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Streams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{topTracks[0].title}</p>
                <p className="text-sm text-muted-foreground">Current #1 Hit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {topTracks.filter(t => getPositionChange(t.position, t.previousPosition) === 'up').length}
                </p>
                <p className="text-sm text-muted-foreground">Rising Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
