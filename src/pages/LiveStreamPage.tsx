import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Mic,
  Users,
  Zap,
  MessageCircle,
  Settings,
  Camera,
  MicOff,
  VideoOff,
  Play,
  Square
} from 'lucide-react';

const mockLiveStreams = [
  {
    id: 1,
    title: 'Acoustic Session - Live from Home',
    artist: 'Indie Artist',
    viewers: 234,
    isLive: true,
    duration: '1:23:45',
    tags: ['acoustic', 'indie', 'live'],
    thumbnail: ''
  },
  {
    id: 2,
    title: 'Electronic Beats Workshop',
    artist: 'DJ Producer',
    viewers: 567,
    isLive: true,
    duration: '45:30',
    tags: ['electronic', 'beats', 'workshop'],
    thumbnail: ''
  },
  {
    id: 3,
    title: 'Jazz Improvisation Session',
    artist: 'Jazz Collective',
    viewers: 123,
    isLive: false,
    duration: '2:15:20',
    tags: ['jazz', 'improvisation'],
    thumbnail: ''
  }
];

const mockChat = [
  { user: 'MusicLover23', message: 'Amazing performance! 🎵', timestamp: '2 min ago' },
  { user: 'BeatsHead', message: 'Can you play that chord again?', timestamp: '3 min ago' },
  { user: 'JazzFan', message: 'This is incredible!', timestamp: '5 min ago' },
  { user: 'VinylCollector', message: 'Just sent you a Zap! ⚡', timestamp: '7 min ago' }
];

export function LiveStreamPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  const handleStartStream = () => {
    if (streamTitle.trim()) {
      setIsStreaming(true);
    }
  };

  const handleStopStream = () => {
    setIsStreaming(false);
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
            Perform live, connect with fans, and receive instant Lightning tips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Video className="w-8 h-8 text-purple-600" />
          {isStreaming ? (
            <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-500/20">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
              Offline
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Streaming Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Setup/Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                {isStreaming ? 'Live Stream' : 'Stream Setup'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isStreaming ? (
                <div className="space-y-4">
                  {/* Stream Title Input */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Stream Title</label>
                    <input
                      type="text"
                      placeholder="Enter your stream title..."
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Stream Preview */}
                  <div className="w-full h-64 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative">
                    <div className="text-center text-muted-foreground">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p>Camera Preview</p>
                      <p className="text-sm">Ready to go live</p>
                    </div>
                    
                    {/* Camera controls overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        variant={micEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={() => setMicEnabled(!micEnabled)}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant={cameraEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={() => setCameraEnabled(!cameraEnabled)}
                      >
                        {cameraEnabled ? <Camera className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Start Stream Button */}
                  <Button
                    onClick={handleStartStream}
                    disabled={!streamTitle.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Live Stream
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Live Stream View */}
                  <div className="w-full h-64 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center relative">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Video className="w-8 h-8" />
                      </div>
                      <p className="font-semibold">{streamTitle}</p>
                      <p className="text-sm opacity-90">Live Now</p>
                    </div>
                    
                    {/* Live indicator */}
                    <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      LIVE
                    </Badge>

                    {/* Stream controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      <Button
                        variant={micEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={() => setMicEnabled(!micEnabled)}
                      >
                        {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant={cameraEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={() => setCameraEnabled(!cameraEnabled)}
                      >
                        {cameraEnabled ? <Camera className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleStopStream}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stream Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">234</div>
                        <div className="text-sm text-muted-foreground">Viewers</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-muted-foreground">Zaps</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">1:23</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stream Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Stream Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quality</label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>1080p HD</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Bitrate</label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Auto</option>
                    <option>2500 kbps</option>
                    <option>1500 kbps</option>
                    <option>1000 kbps</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="h-48 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
                  {mockChat.map((msg, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-purple-600">{msg.user}</span>
                      <span className="text-muted-foreground text-xs ml-2">{msg.timestamp}</span>
                      <p className="text-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 p-2 border border-border rounded-lg bg-background"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zap Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Lightning Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">2,156</div>
                  <div className="text-sm text-muted-foreground">Total Sats Received</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Share Zap Address
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { user: 'FanUser1', amount: 100, time: '2m ago' },
                  { user: 'MusicLover', amount: 250, time: '5m ago' },
                  { user: 'Supporter99', amount: 500, time: '8m ago' }
                ].map((tip, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{tip.user}</div>
                      <div className="text-xs text-muted-foreground">{tip.time}</div>
                    </div>
                    <div className="text-yellow-600 font-medium">
                      ⚡ {tip.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Other Live Streams */}
      <Card>
        <CardHeader>
          <CardTitle>Other Live Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockLiveStreams.map((stream) => (
              <Card key={stream.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center relative mb-3">
                    <Video className="w-8 h-8 text-purple-600/60" />
                    {stream.isLive && (
                      <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                        Live
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold truncate mb-1">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stream.artist}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{stream.viewers}</span>
                    </div>
                    <span>{stream.duration}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {stream.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
