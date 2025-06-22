import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause,
  Heart,
  Download,
  Share2,
  MoreHorizontal,
  Clock,
  Music,
  PlayCircle,
  Shuffle,
  Repeat
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  plays: number;
  isLiked: boolean;
  addedDate: string;
}

interface PlaylistData {
  id: number;
  name: string;
  description: string;
  tracks: Track[];
  totalDuration: string;
  coverColor: string;
  isPublic: boolean;
  createdDate: string;
}

// Mock playlist data
const mockPlaylists: Record<string, PlaylistData> = {
  '1': {
    id: 1,
    name: 'Chill Vibes',
    description: 'Perfect for relaxing and unwinding after a long day',
    totalDuration: '1h 45m',
    coverColor: 'from-purple-500 to-indigo-600',
    isPublic: true,
    createdDate: '2 weeks ago',
    tracks: [
      {
        id: 1,
        title: 'Digital Dreams',
        artist: 'Synth Wave',
        duration: '3:42',
        plays: 1240,
        isLiked: true,
        addedDate: '2 days ago'
      },
      {
        id: 2,
        title: 'Coffee Shop Blues',
        artist: 'Jazz Collective',
        duration: '4:15',
        plays: 892,
        isLiked: false,
        addedDate: '5 days ago'
      },
      {
        id: 3,
        title: 'Midnight Drive',
        artist: 'Retro Runner',
        duration: '3:28',
        plays: 1567,
        isLiked: true,
        addedDate: '1 week ago'
      },
      {
        id: 4,
        title: 'Ocean Waves',
        artist: 'Ambient Collective',
        duration: '5:12',
        plays: 743,
        isLiked: false,
        addedDate: '1 week ago'
      },
      {
        id: 5,
        title: 'Sunrise Melody',
        artist: 'Morning Acoustic',
        duration: '3:55',
        plays: 2156,
        isLiked: true,
        addedDate: '2 weeks ago'
      }
    ]
  },
  '2': {
    id: 2,
    name: 'Electronic Mix',
    description: 'High energy electronic beats for workouts and focus',
    totalDuration: '2h 12m',
    coverColor: 'from-cyan-500 to-blue-600',
    isPublic: false,
    createdDate: '1 month ago',
    tracks: [
      {
        id: 6,
        title: 'Neon Nights',
        artist: 'Electronic Artist',
        duration: '4:23',
        plays: 3421,
        isLiked: true,
        addedDate: '3 days ago'
      },
      {
        id: 7,
        title: 'Bass Drop',
        artist: 'EDM Producer',
        duration: '3:18',
        plays: 2876,
        isLiked: false,
        addedDate: '1 week ago'
      },
      {
        id: 8,
        title: 'Synth Paradise',
        artist: 'Future Beats',
        duration: '5:45',
        plays: 1934,
        isLiked: true,
        addedDate: '2 weeks ago'
      }
    ]
  },
  '3': {
    id: 3,
    name: 'Jazz Collection',
    description: 'Smooth jazz classics and modern interpretations',
    totalDuration: '3h 8m',
    coverColor: 'from-amber-500 to-orange-600',
    isPublic: true,
    createdDate: '2 months ago',
    tracks: [
      {
        id: 9,
        title: 'Blue Notes',
        artist: 'Jazz Masters',
        duration: '6:32',
        plays: 1876,
        isLiked: true,
        addedDate: '1 day ago'
      },
      {
        id: 10,
        title: 'Smooth Operator',
        artist: 'Cool Jazz Trio',
        duration: '4:47',
        plays: 2341,
        isLiked: false,
        addedDate: '4 days ago'
      },
      {
        id: 11,
        title: 'Midnight Jazz',
        artist: 'Urban Jazz Collective',
        duration: '5:29',
        plays: 1654,
        isLiked: true,
        addedDate: '1 week ago'
      }
    ]
  }
};

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);

  const playlist = id ? mockPlaylists[id] : null;

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Music className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
        <p className="text-muted-foreground">The playlist you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handlePlayPlaylist = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0].id);
    }
  };

  const handlePlayTrack = (trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  const getTotalPlays = () => {
    return playlist.tracks.reduce((total, track) => total + track.plays, 0);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Playlist Cover */}
          <div className={`w-64 h-64 bg-gradient-to-br ${playlist.coverColor} rounded-xl flex items-center justify-center shadow-2xl`}>
            <Music className="w-24 h-24 text-white opacity-80" />
          </div>

          {/* Playlist Info */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="mb-4">
              <Badge variant={playlist.isPublic ? "default" : "secondary"} className="mb-3">
                {playlist.isPublic ? "Public Playlist" : "Private Playlist"}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{playlist.name}</h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {playlist.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span>{playlist.tracks.length} songs</span>
              <span>•</span>
              <span>{playlist.totalDuration}</span>
              <span>•</span>
              <span>{getTotalPlays().toLocaleString()} total plays</span>
              <span>•</span>
              <span>Created {playlist.createdDate}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                size="lg" 
                className="rounded-full w-14 h-14 p-0"
                onClick={handlePlayPlaylist}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              
              <Button variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button variant="ghost" size="lg" className="w-12 h-12 p-0">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm">
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
          <Button variant="ghost" size="sm">
            <Repeat className="w-4 h-4 mr-2" />
            Repeat
          </Button>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border/50">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Plays</div>
            <div className="col-span-2">Added</div>
            <div className="col-span-1 text-center">
              <Clock className="w-4 h-4 mx-auto" />
            </div>
          </div>

          {/* Track Rows */}
          {playlist.tracks.map((track, index) => {
            const isCurrentTrack = currentTrack === track.id;
            const isTrackPlaying = isCurrentTrack && isPlaying;

            return (
              <div 
                key={track.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-colors ${
                  isCurrentTrack ? 'bg-accent/30' : ''
                }`}
                onClick={() => handlePlayTrack(track.id)}
              >
                {/* Track Number / Play Button */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="relative">
                    <span className={`text-sm ${isCurrentTrack ? 'text-primary' : 'text-muted-foreground'} group-hover:opacity-0 transition-opacity`}>
                      {index + 1}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Track Info */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>
                  {track.isLiked && (
                    <Heart className="w-4 h-4 fill-red-500 text-red-500 flex-shrink-0" />
                  )}
                </div>

                {/* Plays */}
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                  {track.plays.toLocaleString()}
                </div>

                {/* Added Date */}
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                  {track.addedDate}
                </div>

                {/* Duration */}
                <div className="col-span-1 flex items-center justify-center text-sm text-muted-foreground">
                  {track.duration}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
