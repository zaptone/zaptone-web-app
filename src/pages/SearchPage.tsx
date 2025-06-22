import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Music, 
  PlayCircle, 
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Artist {
  name: string;
  followers: number;
  tracks: number;
}

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'tracks', label: 'Tracks', icon: Music },
    { id: 'artists', label: 'Artists', icon: Avatar },
    { id: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  const mockResults = [
    {
      id: 1,
      type: 'track' as const,
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      duration: '3:42',
      coverUrl: null,
      plays: '2.4K'
    },
    {
      id: 2,
      type: 'track' as const,
      title: 'Coffee Shop Blues',
      artist: 'Jazz Collective',
      duration: '4:15',
      coverUrl: null,
      plays: '1.8K'
    },
    {
      id: 3,
      type: 'artist' as const,
      name: 'Neon Nights',
      followers: '12.5K',
      tracks: 24,
      verified: true
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="p-6 pb-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground mb-6">Find your favorite tracks and artists</p>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
        {searchQuery ? (
          <div className="space-y-6">
            {/* Search Results */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <div className="space-y-2">
                {mockResults.map((result) => (
                  <div key={result.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group">
                    {result.type === 'track' ? (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                          <Music className="w-6 h-6 text-white" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{result.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{result.artist}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{result.duration}</div>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                            {(result as unknown as Artist).name?.slice(0, 2).toUpperCase() || 'AR'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{(result as unknown as Artist).name}</p>
                          <p className="text-sm text-muted-foreground">{(result as unknown as Artist).followers} followers • {(result as unknown as Artist).tracks} tracks</p>
                        </div>
                        <Button size="sm" variant="outline">Follow</Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Trending Searches */}
            <div>             
                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Electronic', 'Jazz', 'Indie Rock', 'Lo-fi', 'Classical', 'Hip Hop'].map((genre) => (
                  <div key={genre} className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 cursor-pointer transition-colors">
                    <p className="font-medium">{genre}</p>
                    <p className="text-sm text-muted-foreground">Trending genre</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Searches
              </h2>
              <div className="space-y-2">
                {['Synthwave Mix', 'Coffee Shop Jazz', 'Indie Vibes'].map((search) => (
                  <div key={search} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
