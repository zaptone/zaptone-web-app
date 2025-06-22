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
  RotateCcw,
  Calendar,
  Trash2,
  Filter
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for recently played tracks
const recentlyPlayed = [
  {
    id: 1,
    title: 'Midnight Vibes',
    artist: 'Chill Collective',
    album: 'Nocturnal',
    duration: 195,
    playedAt: '2024-01-15T14:30:00Z',
    playCount: 12,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 2,
    title: 'Electric Dreams',
    artist: 'Synthwave Master',
    album: 'Digital Future',
    duration: 234,
    playedAt: '2024-01-15T13:45:00Z',
    playCount: 8,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    album: 'Peaceful Moments',
    duration: 289,
    playedAt: '2024-01-15T12:20:00Z',
    playCount: 23,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 4,
    title: 'Urban Beat',
    artist: 'City Rhythms',
    album: 'Street Life',
    duration: 203,
    playedAt: '2024-01-15T11:10:00Z',
    playCount: 5,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 5,
    title: 'Jazz Noir',
    artist: 'Smooth Jazz Trio',
    album: 'Late Night Sessions',
    duration: 256,
    playedAt: '2024-01-14T22:15:00Z',
    playCount: 15,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 6,
    title: 'Cosmic Journey',
    artist: 'Space Ambient',
    album: 'Interstellar',
    duration: 367,
    playedAt: '2024-01-14T20:40:00Z',
    playCount: 7,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 7,
    title: 'Mountain Echo',
    artist: 'Folk Wanderer',
    album: 'Nature\'s Call',
    duration: 224,
    playedAt: '2024-01-14T18:30:00Z',
    playCount: 18,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 8,
    title: 'Digital Pulse',
    artist: 'Electronic Fusion',
    album: 'Circuit Breaker',
    duration: 198,
    playedAt: '2024-01-14T16:55:00Z',
    playCount: 9,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 9,
    title: 'Neon Nights',
    artist: 'Retro Wave',
    album: '80s Revival',
    duration: 213,
    playedAt: '2024-01-14T15:20:00Z',
    playCount: 11,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 10,
    title: 'Sunrise Melody',
    artist: 'Morning Light',
    album: 'Dawn Breaks',
    duration: 187,
    playedAt: '2024-01-14T09:45:00Z',
    playCount: 6,
    coverUrl: '',
    url: '/music.mp3'
  }
];

const timeFilters = ['Today', 'Yesterday', 'This Week', 'This Month', 'All Time'];

export function RecentlyPlayedPage() {
  const [selectedTime, setSelectedTime] = useState('All Time');
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
  const { playTrack, pauseTrack, playerState } = useMusic();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlayedAt = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handlePlayTrack = (track: typeof recentlyPlayed[0]) => {
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

  const toggleTrackSelection = (trackId: number) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const clearSelected = () => {
    setSelectedTracks([]);
  };

  const clearHistory = () => {
    // In a real app, this would clear the history
    alert('History cleared!');
    setSelectedTracks([]);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Recently Played
          </h1>
          <p className="text-muted-foreground mt-2">
            Your listening history and favorite tracks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Clock className="w-3 h-3 mr-1" />
            History
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Time Filter */}
        <div className="flex gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground mt-2" />
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

        {/* Actions */}
        <div className="flex gap-2">
          {selectedTracks.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={clearSelected}>
                Clear Selection ({selectedTracks.length})
              </Button>
              <Button variant="destructive" size="sm" onClick={clearHistory}>
                <Trash2 className="w-3 h-3 mr-1" />
                Remove Selected
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{recentlyPlayed.length}</p>
                <p className="text-xs text-muted-foreground">Tracks Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {recentlyPlayed.reduce((acc, track) => acc + track.playCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {Math.floor(recentlyPlayed.reduce((acc, track) => acc + track.duration, 0) / 60)}
                </p>
                <p className="text-xs text-muted-foreground">Minutes Listened</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {recentlyPlayed.filter(t => t.playCount > 10).length}
                </p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Played List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            Your Recent Tracks ({selectedTime})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {recentlyPlayed.map((track, index) => {
              const isCurrentTrack = playerState.currentTrack?.id === track.id.toString();
              const isPlaying = isCurrentTrack && playerState.isPlaying;
              const isSelected = selectedTracks.includes(track.id);
              
              return (
                <div 
                  key={track.id} 
                  className={`group flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                    isCurrentTrack ? 'bg-purple-500/5' : ''
                  } ${isSelected ? 'bg-blue-500/5' : ''}`}
                >
                  {/* Selection Checkbox */}
                  <div 
                    className="w-4 h-4 border border-border rounded cursor-pointer hover:border-purple-500 transition-colors flex items-center justify-center"
                    onClick={() => toggleTrackSelection(track.id)}
                  >
                    {isSelected && <div className="w-2 h-2 bg-purple-600 rounded"></div>}
                  </div>

                  {/* Track Number */}
                  <div className="w-8 text-sm text-muted-foreground text-center">
                    {index + 1}
                  </div>

                  {/* Album Art */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600/60" />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      isCurrentTrack ? 'text-purple-600' : ''
                    }`}>
                      {track.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist} • {track.album}
                    </p>
                  </div>

                  {/* Play Count */}
                  <div className="hidden md:flex flex-col items-center">
                    <span className="text-sm font-medium">{track.playCount}</span>
                    <span className="text-xs text-muted-foreground">plays</span>
                  </div>

                  {/* Played At */}
                  <div className="hidden lg:block text-sm text-muted-foreground min-w-[120px]">
                    {formatPlayedAt(track.playedAt)}
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-muted-foreground min-w-[50px] text-right">
                    {formatDuration(track.duration)}
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
