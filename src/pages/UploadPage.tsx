import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useGlobalLoading, withLoading } from '@/hooks/useGlobalLoading';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { MusicEventBuilder } from '@/lib/musicEvents';
import { 
  Upload, 
  Music, 
  Image,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  duration?: number;
}

export function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [trackInfo, setTrackInfo] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: '',
    license: 'All Rights Reserved',
    price: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useCurrentUser();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutateAsync: publishEvent, isPending: isPublishing } = useNostrPublish();
  const { toast } = useToast();
  const { updateProgress, updateMessage } = useGlobalLoading();

  // Get audio duration from file
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.floor(audio.duration));
      });
      audio.addEventListener('error', () => {
        resolve(0); // Default duration if unable to detect
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  // Upload file to Blossom server
  const uploadFileToServer = async (file: File): Promise<string> => {
    const tags = await uploadFile(file);
    // Extract URL from the upload response
    const [[, url]] = tags;
    return url;
  };

  // Upload audio file with progress tracking
  const uploadAudioFile = async (file: File, fileId: string) => {
    try {
      // Update progress to show uploading
      setUploadFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'uploading' as const, progress: 50 }
          : f
      ));

      // Get audio duration
      const duration = await getAudioDuration(file);
      
      // Upload to Blossom server
      const url = await uploadFileToServer(file);
      
      // Update file state with URL and duration
      setUploadFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed' as const, progress: 100, url, duration }
          : f
      ));
      
      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' as const }
          : f
      ));
      
      toast({
        title: 'Error',
        description: `Failed to upload ${file.name}`,
        variant: 'destructive',
      });
    }
  };

  // Upload cover image
  const uploadCoverImage = async (file: File) => {
    try {
      const url = await uploadFileToServer(file);
      setCoverUrl(url);
      toast({
        title: 'Success',
        description: 'Cover image uploaded successfully',
      });
    } catch (error) {
      console.error('Cover upload failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload cover image',
        variant: 'destructive',
      });
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const newFile: UploadFile = {
          id: Math.random().toString(),
          file,
          progress: 0,
          status: 'uploading'
        };
        
        setUploadFiles(prev => [...prev, newFile]);
        uploadAudioFile(file, newFile.id);
      }
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handlePublish = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload music',
        variant: 'destructive',
      });
      return;
    }

    if (uploadFiles.length === 0 || !trackInfo.title || !trackInfo.artist) {
      toast({
        title: 'Error',
        description: 'Please provide track title, artist, and upload an audio file',
        variant: 'destructive',
      });
      return;
    }

    const completedFiles = uploadFiles.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please wait for file uploads to complete',
        variant: 'destructive',
      });
      return;
    }

    try {
      await withLoading(async () => {
        updateMessage('Publishing track to Nostr...');
        updateProgress(20);

        // Use the first completed audio file
        const audioFile = completedFiles[0];
        
        // Generate unique track ID
        const trackId = `${trackInfo.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
        
        // Create the music track event
        const trackEvent = MusicEventBuilder.createTrackEvent({
          id: trackId,
          title: trackInfo.title,
          artist: trackInfo.artist,
          duration: audioFile.duration || 0,
          genre: trackInfo.genre || 'Unknown',
          audioUrl: audioFile.url!,
          coverUrl: coverUrl || undefined,
          description: trackInfo.description,
          license: trackInfo.license,
          price: trackInfo.price ? parseInt(trackInfo.price) : undefined,
          releaseDate: new Date().toISOString().split('T')[0],
        });

        updateProgress(50);
        updateMessage('Publishing to network...');

        // Publish the event
        await publishEvent({
          kind: trackEvent.kind!,
          content: trackEvent.content!,
          tags: trackEvent.tags!,
          created_at: Math.floor(Date.now() / 1000),
        });

        updateProgress(100);
        updateMessage('Track published successfully!');

        // Reset form
        setUploadFiles([]);
        setCoverUrl('');
        setTrackInfo({
          title: '',
          artist: '',
          album: '',
          genre: '',
          description: '',
          license: 'All Rights Reserved',
          price: ''
        });

        toast({
          title: 'Success',
          description: 'Your track has been published to the network!',
        });
      }, 'Publishing track...', (progress) => updateProgress(progress));
    } catch (error) {
      console.error('Failed to publish track:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish track. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Upload Music
          </h1>
          <p className="text-muted-foreground text-lg">Share your music with the world</p>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Upload Audio Files</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drag and drop your music files here</h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files. Supports MP3, WAV, FLAC, and more.
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </div>        {/* Upload Progress */}
        {uploadFiles.length > 0 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Upload Progress</Label>
            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mt-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'completed' && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {uploadFile.status === 'error' && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(uploadFile.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Track Information */}
        <div className="space-y-6">
          <Label className="text-lg font-semibold">Track Information</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={trackInfo.title}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={trackInfo.artist}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, artist: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                placeholder="Enter album name"
                value={trackInfo.album}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, album: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                placeholder="Enter genre"
                value={trackInfo.genre}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, genre: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Input
                id="license"
                placeholder="License type"
                value={trackInfo.license}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, license: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (optional, in sats)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={trackInfo.price}
                onChange={(e) => setTrackInfo(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your track..."
              value={trackInfo.description}
              onChange={(e) => setTrackInfo(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
        </div>

        {/* Artwork Upload */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Artwork (Optional)</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            {coverUrl ? (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                  <img 
                    src={coverUrl} 
                    alt="Cover art" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCoverUrl('')}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Image className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload cover art for your track
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Choose Image
                </Button>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadCoverImage(file);
                }
              }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pb-8">
          <Button 
            size="lg" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={!trackInfo.title || !trackInfo.artist || uploadFiles.length === 0 || isUploading || isPublishing}
            onClick={handlePublish}
          >
            {(isUploading || isPublishing) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isPublishing ? 'Publishing...' : 'Publish Track'}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            disabled={isUploading || isPublishing}
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
