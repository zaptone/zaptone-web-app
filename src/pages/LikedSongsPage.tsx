import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Music, 
  PlayCircle,
  Pause,
  Shuffle,
  Download,
  MoreHorizontal,
  Clock,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export function LikedSongsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const likedSongs = [
    {
      id: 1,
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      album: 'Neon Nights',
      duration: '3:42',
      addedDate: '2 days ago',
      plays: '2.4K'
    },
    {
      id: 2,
      title: 'Coffee Shop Blues',
      artist: 'Jazz Collective',
      album: 'Smooth Sounds',
      duration: '4:15',
      addedDate: '5 days ago',
      plays: '1.8K'
    },
    {
      id: 3,
      title: 'Midnight Drive',
      artist: 'Retro Runner',
      album: 'Highway Dreams',
      duration: '3:28',
      addedDate: '1 week ago',
      plays: '3.1K'
    },
    {
      id: 4,
      title: 'Ocean Waves',
      artist: 'Ambient Soul',
      album: 'Natural Sounds',
      duration: '5:22',
      addedDate: '2 weeks ago',
      plays: '892'
    },
    {
      id: 5,
      title: 'Electric Pulse',
      artist: 'Beat Machine',
      album: 'Electronic Vibes',
      duration: '3:55',
      addedDate: '3 weeks ago',
      plays: '4.2K'
    }
  ];

  const filteredSongs = likedSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDuration = likedSongs.reduce((total, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number);
    return total + minutes * 60 + seconds;
  }, 0);

  const formatTotalDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent" />
        
        <div className="relative p-6 pb-8">
          <div className="flex items-end gap-6">
            {/* Large Heart Icon */}
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-xl">
              <Heart className="w-16 h-16 text-white fill-white" />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-2">PLAYLIST</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Liked Songs</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">ZapTone</span>
                <span>•</span>
                <span>{likedSongs.length} songs</span>
                <span>•</span>
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <PlayCircle className="w-6 h-6" />
              )}
            </Button>
            
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              <Shuffle className="w-6 h-6" />
            </Button>
            
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              <Download className="w-6 h-6" />
            </Button>
            
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find in liked songs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-6">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border mb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-3">ALBUM</div>
            <div className="col-span-2">DATE ADDED</div>
            <div className="col-span-1 text-right">
              <Clock className="w-4 h-4 ml-auto" />
            </div>
          </div>

          {/* Songs */}
          <div className="space-y-1">
            {filteredSongs.map((song, index) => (
              <div key={song.id} className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 cursor-pointer group">
                <div className="col-span-1 flex items-center">
                  <span className="group-hover:hidden text-muted-foreground">{index + 1}</span>
                  <PlayCircle className="w-4 h-4 hidden group-hover:block text-white" />
                </div>
                
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-white">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <span className="text-muted-foreground truncate">{song.album}</span>
                </div>
                
                <div className="col-span-2 flex items-center">
                  <span className="text-muted-foreground">{song.addedDate}</span>
                </div>
                
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Heart className="w-4 h-4 fill-green-500 text-green-500 opacity-100" />
                  <span className="text-muted-foreground text-sm">{song.duration}</span>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredSongs.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No songs found</h3>
              <p className="text-muted-foreground">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
