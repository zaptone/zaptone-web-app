import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Play, 
  Pause, 
  Heart,
  MoreHorizontal,
  HardDrive,
  Trash2,
  CheckCircle,
  Clock,
  Folder,
  SortAsc,
  Grid,
  List
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for downloaded tracks
const downloadedTracks = [
  {
    id: 1,
    title: 'Midnight Vibes',
    artist: 'Chill Collective',
    album: 'Nocturnal',
    duration: 195,
    fileSize: 7.2, // MB
    downloadedAt: '2024-01-15T14:30:00Z',
    quality: 'High (320kbps)',
    isOfflineReady: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 2,
    title: 'Electric Dreams',
    artist: 'Synthwave Master',
    album: 'Digital Future',
    duration: 234,
    fileSize: 8.9,
    downloadedAt: '2024-01-15T13:45:00Z',
    quality: 'High (320kbps)',
    isOfflineReady: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    album: 'Peaceful Moments',
    duration: 289,
    fileSize: 11.2,
    downloadedAt: '2024-01-15T12:20:00Z',
    quality: 'Lossless',
    isOfflineReady: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 4,
    title: 'Urban Beat',
    artist: 'City Rhythms',
    album: 'Street Life',
    duration: 203,
    fileSize: 6.8,
    downloadedAt: '2024-01-15T11:10:00Z',
    quality: 'Standard (128kbps)',
    isOfflineReady: false,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 5,
    title: 'Jazz Noir',
    artist: 'Smooth Jazz Trio',
    album: 'Late Night Sessions',
    duration: 256,
    fileSize: 9.4,
    downloadedAt: '2024-01-14T22:15:00Z',
    quality: 'High (320kbps)',
    isOfflineReady: true,
    coverUrl: '',
    url: '/music.mp3'
  },
  {
    id: 6,
    title: 'Cosmic Journey',
    artist: 'Space Ambient',
    album: 'Interstellar',
    duration: 367,
    fileSize: 13.7,
    downloadedAt: '2024-01-14T20:40:00Z',
    quality: 'Lossless',
    isOfflineReady: true,
    coverUrl: '',
    url: '/music.mp3'
  }
];

const sortOptions = ['Name', 'Date Downloaded', 'File Size', 'Duration'];
const qualityFilters = ['All', 'Standard', 'High', 'Lossless'];

export function DownloadedPage() {
  const [sortBy, setSortBy] = useState('Date Downloaded');
  const [qualityFilter, setQualityFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
  const { playTrack, pauseTrack, playerState } = useMusic();

  const filteredTracks = qualityFilter === 'All' 
    ? downloadedTracks 
    : downloadedTracks.filter(track => track.quality.includes(qualityFilter));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatDownloadedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getQualityColor = (quality: string) => {
    if (quality.includes('Lossless')) return 'text-green-600 bg-green-500/10 border-green-500/20';
    if (quality.includes('320')) return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
    return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
  };

  const handlePlayTrack = (track: typeof downloadedTracks[0]) => {
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

  const deleteSelected = () => {
    // In a real app, this would delete the files
    alert(`Deleting ${selectedTracks.length} tracks...`);
    setSelectedTracks([]);
  };

  const totalSize = downloadedTracks.reduce((acc, track) => acc + track.fileSize, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Downloaded Music
          </h1>
          <p className="text-muted-foreground mt-2">
            Your offline music collection - {downloadedTracks.length} tracks ({totalSize.toFixed(1)} MB)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="w-8 h-8 text-purple-600" />
          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Offline Ready
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            {sortOptions.map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option)}
                className={sortBy === option ? 
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                  ""
                }
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Quality Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Quality:</span>
            {qualityFilters.map((filter) => (
              <Button
                key={filter}
                variant={qualityFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setQualityFilter(filter)}
                className={qualityFilter === filter ? 
                  "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                  ""
                }
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          {/* Selection Actions */}
          {selectedTracks.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={clearSelected}>
                Clear ({selectedTracks.length})
              </Button>
              <Button variant="destructive" size="sm" onClick={deleteSelected}>
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{downloadedTracks.length}</p>
                <p className="text-xs text-muted-foreground">Downloaded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {downloadedTracks.filter(t => t.isOfflineReady).length}
                </p>
                <p className="text-xs text-muted-foreground">Offline Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalSize.toFixed(1)} MB</p>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {Math.floor(downloadedTracks.reduce((acc, track) => acc + track.duration, 0) / 60)}
                </p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloaded Tracks */}
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-purple-600" />
              Your Downloads ({filteredTracks.length} tracks)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredTracks.map((track) => {
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

                    {/* Offline Status */}
                    <div className="w-6 flex justify-center">
                      {track.isOfflineReady ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-500" />
                      )}
                    </div>

                    {/* Album Art */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-purple-600/60" />
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

                    {/* Quality */}
                    <Badge variant="outline" className={`text-xs ${getQualityColor(track.quality)}`}>
                      {track.quality}
                    </Badge>

                    {/* File Size */}
                    <div className="hidden md:block text-sm text-muted-foreground min-w-[80px] text-right">
                      {formatFileSize(track.fileSize)}
                    </div>

                    {/* Downloaded Date */}
                    <div className="hidden lg:block text-sm text-muted-foreground min-w-[100px] text-right">
                      {formatDownloadedAt(track.downloadedAt)}
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTracks.map((track) => {
            const isCurrentTrack = playerState.currentTrack?.id === track.id.toString();
            const isPlaying = isCurrentTrack && playerState.isPlaying;
            const isSelected = selectedTracks.includes(track.id);
            
            return (
              <Card key={track.id} className={`group hover:shadow-lg transition-all duration-300 ${
                isCurrentTrack ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
              } ${isSelected ? 'ring-2 ring-blue-500/20 bg-blue-500/5' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="relative">
                    {/* Album Art */}
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <Download className="w-12 h-12 text-purple-600/60" />
                      
                      {/* Status Badges */}
                      <div className="absolute top-2 left-2">
                        {track.isOfflineReady ? (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Processing
                          </Badge>
                        )}
                      </div>

                      {/* Selection Checkbox */}
                      <div 
                        className="absolute top-2 right-2 w-6 h-6 border-2 border-white/80 rounded cursor-pointer hover:border-purple-500 transition-colors flex items-center justify-center bg-black/20"
                        onClick={() => toggleTrackSelection(track.id)}
                      >
                        {isSelected && <div className="w-3 h-3 bg-white rounded"></div>}
                      </div>
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="lg"
                          onClick={() => handlePlayTrack(track)}
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
                        {track.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.album}
                      </p>
                    </div>

                    {/* Track Details */}
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className={getQualityColor(track.quality)}>
                        {track.quality.split(' ')[0]}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatFileSize(track.fileSize)}
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(track.duration)}
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
      )}
    </div>
  );
}
