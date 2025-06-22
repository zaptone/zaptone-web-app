import { Button } from '@/components/ui/button';
import { 
  Music, 
  PlayCircle,
  Heart,
  TrendingUp,
  Clock,
  Users,
  Headphones
} from 'lucide-react';

export function HomePage() {
  const featuredTracks = [
    {
      id: 1,
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      genre: 'Electronic',
      plays: '2.4K',
      duration: '3:42',
      isNew: true
    },
    {
      id: 2,
      title: 'Coffee Shop Blues',
      artist: 'Jazz Collective',
      genre: 'Jazz',
      plays: '1.8K',
      duration: '4:15',
      isNew: false
    },
    {
      id: 3,
      title: 'Midnight Drive',
      artist: 'Retro Runner',
      genre: 'Synthwave',
      plays: '3.1K',
      duration: '3:28',
      isNew: true
    },
    {
      id: 4,
      title: 'Ocean Waves',
      artist: 'Ambient Soul',
      genre: 'Ambient',
      plays: '892',
      duration: '5:22',
      isNew: false
    }
  ];

  const trendingArtists = [
    { id: 1, name: 'Synth Wave', followers: '12.5K', verified: true },
    { id: 2, name: 'Jazz Collective', followers: '8.2K', verified: false },
    { id: 3, name: 'Retro Runner', followers: '15.7K', verified: true },
    { id: 4, name: 'Ambient Soul', followers: '6.3K', verified: false }
  ];

  const recentlyPlayed = [
    { id: 1, title: 'Electric Pulse', artist: 'Beat Machine', lastPlayed: '2 hours ago' },
    { id: 2, title: 'Mountain Echo', artist: 'Nature Sounds', lastPlayed: '1 day ago' },
    { id: 3, title: 'City Lights', artist: 'Urban Vibes', lastPlayed: '3 days ago' }
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <div className="relative p-6 pb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ZapTone</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">Discover new music and connect with artists on the decentralized platform</p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Listening
            </Button>
            <Button size="lg" variant="outline">
              <Music className="w-5 h-5 mr-2" />
              Upload Music
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2K</p>
                <p className="text-sm text-muted-foreground">Tracks Available</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">350</p>
                <p className="text-sm text-muted-foreground">Active Artists</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">48K</p>
                <p className="text-sm text-muted-foreground">Monthly Listeners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tracks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Tracks</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTracks.map((track) => (
              <div key={track.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer group transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                    <Music className="w-8 h-8 text-white" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{track.title}</h3>
                      {track.isNew && (
                        <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">NEW</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{track.genre}</span>
                      <span>{track.plays} plays</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Artists */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Trending Artists
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingArtists.map((artist) => (
              <div key={artist.id} className="text-center p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {artist.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{artist.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{artist.followers} followers</p>
                <Button size="sm" variant="outline" className="w-full">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        <div className="pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recently Played
            </h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {recentlyPlayed.map((track) => (
              <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                  <Music className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                
                <p className="text-sm text-muted-foreground">{track.lastPlayed}</p>
                
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
