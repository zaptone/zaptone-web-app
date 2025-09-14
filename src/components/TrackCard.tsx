import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { genUserName } from '@/lib/genUserName';
import { ZapDialog } from '@/components/ZapDialog';
import { useToast } from '@/hooks/useToast';
import LoginDialog from '@/components/auth/LoginDialog';
import { 
  Play, 
  Pause, 
  Music, 
  Clock,
  Calendar,
  User,
  Heart,
  Zap,
  Share,
  MoreHorizontal
} from 'lucide-react';

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    genre: string;
    audioUrl: string;
    coverUrl?: string;
    description: string;
    createdAt: number;
    event: {
      pubkey: string;
      created_at: number;
      id: string;
    };
  };
  isPlaying?: boolean;
  onPlayPause?: () => void;
  showAuthor?: boolean;
}

export function TrackCard({ track, isPlaying = false, onPlayPause, showAuthor = false }: TrackCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50)); // Mock data
  const [zapCount] = useState(Math.floor(Math.random() * 20)); // Mock data
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
  
  const author = useAuthor(track.event.pubkey);
  const { user } = useCurrentUser();
  const { mutate: createEvent } = useNostrPublish();
  const { toast } = useToast();
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleLike = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    // Create a like event (kind 7)
    createEvent({
      kind: 7,
      content: isLiked ? '-' : '+',
      tags: [
        ['e', track.event.id],
        ['p', track.event.pubkey]
      ],
      created_at: Math.floor(Date.now() / 1000)
    });

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    toast({
      title: isLiked ? "Removed like" : "Liked!",
      description: `${isLiked ? "Removed like from" : "Liked"} "${track.title}"`,
    });
  };

  const handleZap = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    // Check if author metadata is still loading
    if (author.isLoading) {
      toast({
        title: "Loading Author Info",
        description: "Please wait while we load the artist information...",
      });
      return;
    }

    // Check if author has Lightning address
    const authorMetadata = author.data?.metadata;
    const { lud06, lud16 } = authorMetadata || {};
    
    if (!lud16 && !lud06) {
      toast({
        title: "No Lightning Address",
        description: "This artist hasn't configured a Lightning address for receiving zaps yet",
        variant: "destructive"
      });
      return;
    }

    setZapDialog({
      open: true,
      target: {
        id: track.event.id,
        pubkey: track.event.pubkey,
        kind: 30023, // Music track event kind
        content: track.description || '',
        tags: [['d', track.id]],
        created_at: track.event.created_at,
        sig: ''
      },
      content: {
        type: 'track',
        title: track.title,
        id: track.id
      }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${track.title} by ${track.artist}`,
      text: `Check out this track on ZapTone: ${track.title} by ${track.artist}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast({
        title: "Copied to clipboard",
        description: "Track link copied to clipboard",
      });
    }
  };

  const authorName = author.data?.metadata?.name || genUserName(track.event.pubkey);
  const authorPicture = author.data?.metadata?.picture;

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border bg-card/50 backdrop-blur-sm py-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Cover Art with Play Button */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                {track.coverUrl && !imageError ? (
                  <img 
                    src={track.coverUrl} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Music className="w-6 h-6 text-white" />
                )}
              </div>
              
              {/* Play/Pause Button Overlay */}
              <Button
                size="sm"
                className="absolute inset-0 w-full h-full bg-black/60 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl border-0"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                )}
              </Button>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base truncate text-foreground">
                    {track.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {track.artist}
                  </p>
                  
                  {/* Author info and metadata in single row */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {showAuthor && (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="w-4 h-4">
                          {authorPicture && <AvatarImage src={authorPicture} />}
                          <AvatarFallback className="text-[8px] bg-muted">
                            <User className="w-2 h-2" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-20">
                          {authorName}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(track.duration)}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(track.createdAt)}
                    </div>
                    
                    {track.genre && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5">
                        {track.genre}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-yellow-500 transition-colors"
                onClick={handleZap}
              >
                <Zap className="w-4 h-4 mr-1" />
                <span className="text-xs">{zapCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleShare}
              >
                <Share className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zap Dialog */}
      <ZapDialog
        open={zapDialog.open}
        onOpenChange={(open) => setZapDialog({ ...zapDialog, open })}
        target={zapDialog.target || { 
          id: track.event.id, 
          pubkey: track.event.pubkey, 
          kind: 30023, 
          content: '', 
          tags: [], 
          created_at: track.event.created_at, 
          sig: '' 
        }}
        content={zapDialog.content}
      />

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        onLogin={() => setShowLoginDialog(false)}
      />
    </>
  );
}

export function TrackCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm py-0">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
