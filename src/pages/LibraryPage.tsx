import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  PlayCircle, 
  Heart,
  Plus,
  List,
  Grid3X3,
  MoreHorizontal,
  Download
} from 'lucide-react';

interface PlaylistItem {
  id: number;
  type: 'playlist';
  name: string;
  description: string;
  trackCount: number;
  duration: string;
  coverUrl: string | null;
  isLiked: boolean;
}

interface TrackItem {
  id: number;
  type: 'track';
  name: string;
  artist: string;
  duration: string;
  coverUrl: string | null;
  isLiked: boolean;
  addedDate: string;
}

type LibraryItem = PlaylistItem | TrackItem;

export function LibraryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'liked', label: 'Liked Songs' },
    { id: 'downloaded', label: 'Downloaded' }
  ];

  const libraryItems: LibraryItem[] = [
    {
      id: 1,
      type: 'playlist',
      name: 'My Favorites',
      description: 'Your most loved tracks',
      trackCount: 24,
      duration: '1h 45m',
      coverUrl: null,
      isLiked: false
    },
    {
      id: 2,
      type: 'playlist',
      name: 'Chill Vibes',
      description: 'Perfect for relaxing',
      trackCount: 18,
      duration: '1h 12m',
      coverUrl: null,
      isLiked: false
    },
    {
      id: 3,
      type: 'track',
      name: 'Digital Dreams',
      artist: 'Synth Wave',
      duration: '3:42',
      coverUrl: null,
      isLiked: true,
      addedDate: '2 days ago'
    },
    {
      id: 4,
      type: 'track',
      name: 'Coffee Shop Blues',
      artist: 'Jazz Collective',
      duration: '4:15',
      coverUrl: null,
      isLiked: true,
      addedDate: '5 days ago'
    }
  ];

  const filteredItems = libraryItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'playlists') return item.type === 'playlist';
    if (activeTab === 'liked') return item.isLiked;
    if (activeTab === 'downloaded') return false; // No downloaded items in mock data
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Library</h1>
            <p className="text-muted-foreground">Your personal music collection</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-none border-b-2 ${
                activeTab === tab.id ? 'border-primary' : 'border-transparent'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Music className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-4">Start by creating a playlist or liking some songs</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Playlist
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                  <Music className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground truncate">                    {item.type === 'playlist' 
                      ? `${item.trackCount} tracks • ${item.duration}` 
                      : `${item.artist} • Added ${item.addedDate}`
                    }
                  </p>
                </div>

                {item.type === 'track' && (
                  <div className="text-sm text-muted-foreground">{item.duration}</div>
                )}

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.isLiked && <Heart className="w-4 h-4 fill-red-500 text-red-500" />}
                  {item.type === 'playlist' && <Download className="w-4 h-4 text-muted-foreground" />}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="font-medium truncate">{item.name}</h3>                <p className="text-sm text-muted-foreground truncate">
                  {item.type === 'playlist' 
                    ? `${item.trackCount} tracks` 
                    : item.artist
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
