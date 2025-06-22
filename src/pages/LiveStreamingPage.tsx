import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  Zap,
  Calendar,
  Clock,
  Radio,
  Play,
  Pause,
  Settings,
  Share2,
  Eye,
  MessageCircle,
  Heart,
  Volume2,
  MonitorSpeaker
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

// Mock data for live streams
const liveStreams = [
  {
    id: 1,
    title: 'Electronic Music Session',
    artist: 'DJ Synthwave',
    isLive: true,
    viewers: 1247,
    startTime: '2024-01-15T20:00:00Z',
    duration: 3600, // seconds
    category: 'Electronic',
    thumbnail: '',
    description: 'Live DJ set featuring the best electronic music',
    totalZaps: 156,
    totalAmount: 2450 // sats
  },
  {
    id: 2,
    title: 'Acoustic Guitar Evening',
    artist: 'Folk Artist',
    isLive: true,
    viewers: 892,
    startTime: '2024-01-15T19:30:00Z',
    duration: 2700,
    category: 'Acoustic',
    thumbnail: '',
    description: 'Intimate acoustic performance with original songs',
    totalZaps: 89,
    totalAmount: 1330
  },
  {
    id: 3,
    title: 'Jazz Improvisation',
    artist: 'Jazz Trio',
    isLive: false,
    viewers: 0,
    startTime: '2024-01-15T22:00:00Z',
    duration: 0,
    category: 'Jazz',
    thumbnail: '',
    description: 'Scheduled: Jazz improvisation session',
    totalZaps: 0,
    totalAmount: 0
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Classical Piano Recital',
    artist: 'Piano Virtuoso',
    scheduledTime: '2024-01-16T18:00:00Z',
    category: 'Classical',
    expectedDuration: 5400
  },
  {
    id: 2,
    title: 'Rock Band Live',
    artist: 'Thunder Strike',
    scheduledTime: '2024-01-16T21:00:00Z',
    category: 'Rock',
    expectedDuration: 7200
  }
];

export function LiveStreamingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showScheduled, setShowScheduled] = useState(false);
  const { playTrack, playerState } = useMusic();

  const categories = ['All', 'Electronic', 'Acoustic', 'Jazz', 'Classical', 'Rock'];

  const filteredStreams = selectedCategory === 'All' 
    ? liveStreams 
    : liveStreams.filter(stream => stream.category === selectedCategory);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleJoinStream = (stream: typeof liveStreams[0]) => {
    // Mock joining stream
    playTrack({
      id: `stream-${stream.id}`,
      title: stream.title,
      artist: stream.artist,
      url: '/music.mp3',
      coverUrl: ''
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Live Streaming
          </h1>
          <p className="text-muted-foreground mt-2">
            Watch live performances and interact with artists in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
            <Radio className="w-3 h-3 mr-1" />
            Live Now
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground py-2">Category:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                ""
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={!showScheduled ? "default" : "outline"}
            size="sm"
            onClick={() => setShowScheduled(false)}
          >
            Live Now
          </Button>
          <Button
            variant={showScheduled ? "default" : "outline"}
            size="sm"
            onClick={() => setShowScheduled(true)}
          >
            Scheduled
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Start Stream
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{liveStreams.filter(s => s.isLive).length}</p>
                <p className="text-xs text-muted-foreground">Live Streams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {formatViewers(liveStreams.reduce((acc, stream) => acc + stream.viewers, 0))}
                </p>
                <p className="text-xs text-muted-foreground">Total Viewers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">
                  {liveStreams.reduce((acc, stream) => acc + stream.totalAmount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Sats Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold">{upcomingEvents.length}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Streams or Scheduled Events */}
      {!showScheduled ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Live Now</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStreams.filter(stream => stream.isLive).map((stream) => {
              const isCurrentStream = playerState.currentTrack?.id === `stream-${stream.id}`;
              const isPlaying = isCurrentStream && playerState.isPlaying;
              
              return (
                <Card key={stream.id} className={`group hover:shadow-lg transition-all duration-300 ${
                  isCurrentStream ? 'ring-2 ring-purple-500/20 bg-purple-500/5' : ''
                }`}>
                  <CardHeader className="pb-4">
                    <div className="relative">
                      {/* Stream Preview */}
                      <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="text-center">
                          <Video className="w-12 h-12 mx-auto mb-2 text-purple-600/60" />
                          <div className="text-sm text-muted-foreground">Live Stream</div>
                        </div>
                        
                        {/* Live Badge */}
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>

                        {/* Viewer Count */}
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                          <Eye className="w-3 h-3 inline mr-1" />
                          {formatViewers(stream.viewers)}
                        </div>
                        
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="lg"
                            onClick={() => handleJoinStream(stream)}
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
                    <div className="space-y-4">
                      {/* Stream Info */}
                      <div>
                        <h3 className={`font-semibold ${
                          isCurrentStream ? 'text-purple-600' : ''
                        }`}>
                          {stream.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{stream.artist}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stream.description}
                        </p>
                      </div>

                      {/* Stream Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{stream.category}</Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(stream.duration)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span>{stream.totalZaps}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{stream.totalAmount} sats</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          onClick={() => handleJoinStream(stream)}
                          className="flex-1 mr-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          {isPlaying ? (
                            <Volume2 className="w-4 h-4 mr-2" />
                          ) : (
                            <MonitorSpeaker className="w-4 h-4 mr-2" />
                          )}
                          {isPlaying ? 'Watching' : 'Join Stream'}
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-purple-600/60" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.artist}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{event.category}</Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.scheduledTime).toLocaleString()}</span>
                        </div>
                        <span>Duration: {formatDuration(event.expectedDuration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        Remind Me
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
