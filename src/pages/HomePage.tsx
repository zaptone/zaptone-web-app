import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Upload,
  Music,
  TrendingUp,
  Clock,
  Mic,
  Headphones,
  Star,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMusic } from '@/hooks/useMusic';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl?: string;
  plays: number;
  likes: number;
  isLiked?: boolean;
  genre: string;
  uploadedAt: string;
}

const featuredTracks: Track[] = [
  {
    id: '1',
    title: 'Digital Dreams',
    artist: 'SynthWave Artist',
    duration: '3:42',
    coverUrl: undefined,
    plays: 15420,
    likes: 1205,
    isLiked: false,
    genre: 'Electronic',
    uploadedAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'Coffee Shop Blues',
    artist: 'Jazz Collective',
    duration: '4:18',
    coverUrl: undefined,
    plays: 8934,
    likes: 672,
    isLiked: true,
    genre: 'Jazz',
    uploadedAt: '5 hours ago'
  },
  {
    id: '3',
    title: 'Neon Nights',
    artist: 'Retro Futurist',
    duration: '3:55',
    coverUrl: undefined,
    plays: 23891,
    likes: 1876,
    isLiked: false,
    genre: 'Synthwave',
    uploadedAt: '1 day ago'
  },
  {
    id: '4',
    title: 'Midnight Drive',
    artist: 'Electric Dreams',
    duration: '4:02',
    coverUrl: undefined,
    plays: 7532,
    likes: 543,
    isLiked: true,
    genre: 'Ambient',
    uploadedAt: '2 days ago'
  },
  {
    id: '5',
    title: 'Urban Pulse',
    artist: 'City Sounds',
    duration: '3:28',
    coverUrl: undefined,
    plays: 12456,
    likes: 967,
    isLiked: false,
    genre: 'Hip-Hop',
    uploadedAt: '3 days ago'
  },
  {
    id: '6',
    title: 'Aurora',
    artist: 'Ambient Collective',
    duration: '5:14',
    coverUrl: undefined,
    plays: 6789,
    likes: 445,
    isLiked: false,
    genre: 'Ambient',
    uploadedAt: '4 days ago'
  }
];

export default function HomePage() {
  const { user } = useCurrentUser();
  const { playTrack } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    file: null as File | null
  });

  const genres = ['all', 'Electronic', 'Jazz', 'Synthwave', 'Ambient', 'Hip-Hop', 'Rock', 'Pop'];

  const filteredTracks = featuredTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });  const handlePlayTrack = (track: Track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: `/api/tracks/${track.id}/stream`, // Mock URL
      coverUrl: track.coverUrl
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle upload logic here
    console.log('Upload form:', uploadForm);
    setShowUploadDialog(false);
    setUploadForm({ title: '', artist: '', genre: '', description: '', file: null });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative p-6 lg:p-8">
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Welcome to ZapTone
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            The decentralized music platform where artists and fans connect directly. 
            Upload, discover, and support independent music with Lightning payments.
          </p>
          
          {user ? (
            <div className="flex flex-wrap gap-4">
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" className="music-button-primary">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Your Music
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Upload New Track</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Track Title</Label>
                      <Input
                        id="title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter track title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artist">Artist Name</Label>
                      <Input
                        id="artist"
                        value={uploadForm.artist}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, artist: e.target.value }))}
                        placeholder="Enter artist name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Input
                        id="genre"
                        value={uploadForm.genre}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, genre: e.target.value }))}
                        placeholder="e.g., Electronic, Jazz, Rock"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell us about your track..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Audio File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">Upload Track</Button>
                      <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline">
                <Headphones className="w-5 h-5 mr-2" />
                Explore Tracks
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="outline">
                <Music className="w-5 h-5 mr-2" />
                Discover Music
              </Button>
              <Button size="lg" variant="outline">
                <Mic className="w-5 h-5 mr-2" />
                For Artists
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-6 lg:px-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-6 lg:px-8">
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:flex">
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTracks.map((track) => (
                <Card key={track.id} className="music-card group hover:scale-[1.02] transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 group-hover:text-purple-400 transition-colors">
                          {track.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{track.artist}</span>
                          <Badge variant="secondary" className="text-xs">
                            {track.genre}
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        className="play-button opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handlePlayTrack(track)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                      {track.coverUrl ? (
                        <img 
                          src={track.coverUrl} 
                          alt={track.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-12 h-12 text-white" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{track.duration}</span>
                      <span>{track.uploadedAt}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {formatNumber(track.plays)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className={`w-3 h-3 ${track.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                          {formatNumber(track.likes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Heart className={`w-4 h-4 ${track.isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 h-auto text-yellow-400">
                          <Zap className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Trending Tracks</h3>
              <p className="text-muted-foreground">
                Discover the hottest tracks that are gaining momentum right now
              </p>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Recent Uploads</h3>
              <p className="text-muted-foreground">
                Fresh tracks uploaded by our community of independent artists
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stats Section */}
      <div className="px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-400">25k+</div>
            <div className="text-sm text-muted-foreground">Tracks</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-pink-400">1.2M+</div>
            <div className="text-sm text-muted-foreground">Streams</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">8k+</div>
            <div className="text-sm text-muted-foreground">Artists</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-400">15k+</div>
            <div className="text-sm text-muted-foreground">Zaps Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
