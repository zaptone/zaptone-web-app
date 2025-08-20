import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrackCard, TrackCardSkeleton } from '@/components/TrackCard';
import { RelaySelector } from '@/components/RelaySelector';
import { useRecentTracks } from '@/hooks/useMusicTracks';

import { 
  Music,
  TrendingUp,
  Search,
  Zap,
  Star,
  Users,
  Radio,
  Disc3
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMusic } from '@/hooks/useMusic';
import LoginDialog from '@/components/auth/LoginDialog';
import { ZapDialog } from '@/components/ZapDialog';

export default function HomePage() {
  const { user } = useCurrentUser();
  const { playTrack, playerState, pauseTrack, resumeTrack } = useMusic();
  const { data: recentTracks, isLoading: tracksLoading } = useRecentTracks();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [zapDialog, setZapDialog] = useState<{ 
    open: boolean; 
    target?: {
      id: string;
      pubkey: string;
      kind: number;
      content: string;
      tags: string[][];
      created_at: number;
      sig: string;
    }; 
    content?: {
      type: 'track';
      title: string;
      id: string;
    }
  }>({ 
    open: false 
  });
  const navigate = useNavigate();

  const handlePlayTrack = (track: { id: string; title: string; artist: string; audioUrl: string; duration?: number; coverUrl?: string }) => {
    const isCurrentTrack = playerState.currentTrack?.id === track.id;
    
    if (isCurrentTrack && playerState.isPlaying) {
      pauseTrack();
    } else if (isCurrentTrack && !playerState.isPlaying) {
      resumeTrack();
    } else {
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.audioUrl,
        duration: track.duration || 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">       
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for music, artists, or genres..."
              className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Quick Actions */}
        {user && (
          <div className="flex justify-center gap-4 mb-12">
            <Button 
              variant="outline" 
              onClick={() => navigate('/upload')}
              className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/20 px-6 py-3"
            >
              <Music className="w-4 h-4 mr-2" />
              Upload Music
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/library')}
              className="px-6 py-3"
            >
              <Disc3 className="w-4 h-4 mr-2" />
              My Library
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/radio')}
              className="px-6 py-3"
            >
              <Radio className="w-4 h-4 mr-2" />
              Radio
            </Button>
          </div>
        )}

        {/* Trending Music Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground">Latest music uploads on Nostr</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/trending')}>
              View All
            </Button>
          </div>

          {tracksLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <TrackCardSkeleton key={i} />
              ))}
            </div>
          ) : recentTracks && recentTracks.length > 0 ? (
            <div className="space-y-3">
              {recentTracks.slice(0, 10).map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  isPlaying={playerState.currentTrack?.id === track.id && playerState.isPlaying}
                  onPlayPause={() => handlePlayTrack(track)}
                  showAuthor={true}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-6">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Music className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">No music found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try switching to a different relay to discover music content.
                    </p>
                  </div>
                  <RelaySelector className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Artists Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Featured Artists</h2>
              <p className="text-muted-foreground">Discover talented independent artists</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Luna Echo', 'Sunset Collective', 'Neon Dreams', 'Blue Horizon'].map((artist, index) => (
              <Card key={artist} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={`/placeholder-artist-${index + 1}.jpg`} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {artist.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">{artist}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{Math.floor(Math.random() * 50 + 10)}K followers</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Login CTA */}
        {!user && (
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white max-w-lg mx-auto">
              <CardContent className="p-10">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Join ZapTone</h3>
                <p className="text-white/90 mb-6">
                  Upload your music, connect with fans worldwide, and earn Bitcoin through Lightning Network
                </p>
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 px-8"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Get Started for Free
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLogin={() => setShowLoginDialog(false)}
      />

      {/* Zap Dialog */}
      <ZapDialog
        open={zapDialog.open}
        onOpenChange={(open) => setZapDialog({ ...zapDialog, open })}
        target={zapDialog.target || { 
          id: '', 
          pubkey: '', 
          kind: 0, 
          content: '{}', 
          tags: [], 
          created_at: Math.floor(Date.now() / 1000), 
          sig: '' 
        }}
        content={zapDialog.content}
      />
    </div>
  );
}
