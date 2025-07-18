import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { 
  Play, 
  Pause, 
  Music, 
  Clock,
  Calendar,
  User
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
    };
  };
  isPlaying?: boolean;
  onPlayPause?: () => void;
  showAuthor?: boolean;
}

export function TrackCard({ track, isPlaying = false, onPlayPause, showAuthor = false }: TrackCardProps) {
  const [imageError, setImageError] = useState(false);
  const author = useAuthor(track.event.pubkey);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const authorName = author.data?.metadata?.name || genUserName(track.event.pubkey);
  const authorPicture = author.data?.metadata?.picture;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Cover Art */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
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
              className="absolute inset-0 w-full h-full bg-black/60 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{track.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artist}
                </p>
                
                {/* Author info (for discover/home page) */}
                {showAuthor && (
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-4 h-4">
                      {authorPicture && <AvatarImage src={authorPicture} />}
                      <AvatarFallback className="text-xs">
                        <User className="w-2 h-2" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      by {authorName}
                    </span>
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDuration(track.duration)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(track.createdAt)}
                  </div>
                  {track.genre && (
                    <Badge variant="secondary" className="text-xs">
                      {track.genre}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {track.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {track.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function TrackCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
