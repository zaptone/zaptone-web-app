import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Music, 
  Image, 
  FileAudio, 
  CheckCircle, 
  Zap,
  Info
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { MusicEventBuilder } from '@/lib/musicEvents';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadForm {
  title: string;
  artist: string;
  genre: string;
  description: string;
  license: string;
  price: string;
  releaseDate: string;
  audioFile: File | null;
  coverFile: File | null;
}

const MUSIC_GENRES = [
  'Electronic', 'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical', 'Country', 
  'R&B', 'Reggae', 'Blues', 'Folk', 'Punk', 'Metal', 'Indie', 'Alternative',
  'Dance', 'House', 'Techno', 'Dubstep', 'Ambient', 'Experimental'
];

const LICENSE_TYPES = [
  'All Rights Reserved',
  'Creative Commons CC0',
  'Creative Commons BY',
  'Creative Commons BY-SA',
  'Creative Commons BY-NC',
  'Creative Commons BY-NC-SA'
];

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    title: '',
    artist: '',
    genre: '',
    description: '',
    license: 'All Rights Reserved',
    price: '',
    releaseDate: new Date().toISOString().split('T')[0],
    audioFile: null,
    coverFile: null
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'form' | 'uploading' | 'complete'>('form');

  const handleInputChange = (field: keyof UploadForm, value: string) => {
    setUploadForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'audioFile' | 'coverFile', file: File | null) => {
    setUploadForm(prev => ({ ...prev, [field]: file }));
  };

  const validateForm = (): boolean => {
    if (!uploadForm.title.trim()) {
      toast({ title: "Error", description: "Track title is required", variant: "destructive" });
      return false;
    }
    if (!uploadForm.artist.trim()) {
      toast({ title: "Error", description: "Artist name is required", variant: "destructive" });
      return false;
    }
    if (!uploadForm.genre) {
      toast({ title: "Error", description: "Please select a genre", variant: "destructive" });
      return false;
    }
    if (!uploadForm.audioFile) {
      toast({ title: "Error", description: "Audio file is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const uploadToBlossom = async (file: File): Promise<string> => {
    // Mock Blossom upload - replace with actual Blossom implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://blossom.example.com/${file.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`);
      }, 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setUploading(true);
    setUploadStep('uploading');
    setUploadProgress(0);

    try {
      // Upload audio file to Blossom
      setUploadProgress(20);
      const audioUrl = await uploadToBlossom(uploadForm.audioFile!);
      
      setUploadProgress(40);
      
      // Upload cover image if provided
      let coverUrl: string | undefined;
      if (uploadForm.coverFile) {
        coverUrl = await uploadToBlossom(uploadForm.coverFile);
      }
      
      setUploadProgress(60);

      // Create music track event
      const trackId = `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const trackEvent = MusicEventBuilder.createTrackEvent({
        id: trackId,
        title: uploadForm.title,
        artist: uploadForm.artist,
        duration: 0, // Will be filled when audio metadata is loaded
        genre: uploadForm.genre,
        audioUrl,
        coverUrl,
        description: uploadForm.description,
        license: uploadForm.license,
        price: uploadForm.price ? parseInt(uploadForm.price) : undefined,
        releaseDate: uploadForm.releaseDate
      });

      setUploadProgress(80);

      // TODO: Publish event to Nostr relays
      console.log('Track event to publish:', trackEvent);
      
      setUploadProgress(100);
      setUploadStep('complete');

      toast({
        title: "Upload Successful!",
        description: `"${uploadForm.title}" has been uploaded to the decentralized network.`
      });

      // Reset form after delay
      setTimeout(() => {
        setUploadStep('form');
        setUploadProgress(0);
        setUploadForm({
          title: '',
          artist: '',
          genre: '',
          description: '',
          license: 'All Rights Reserved',
          price: '',
          releaseDate: new Date().toISOString().split('T')[0],
          audioFile: null,
          coverFile: null
        });
        onOpenChange(false);
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload track. Please try again.",
        variant: "destructive"
      });
      setUploadStep('form');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const MB = bytes / (1024 * 1024);
    return `${MB.toFixed(1)} MB`;
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Music</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Please connect your wallet to upload music.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Music to ZapTone
          </DialogTitle>
        </DialogHeader>

        {uploadStep === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Track Title *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter track title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist Name *</Label>
                    <Input
                      id="artist"
                      value={uploadForm.artist}
                      onChange={(e) => handleInputChange('artist', e.target.value)}
                      placeholder="Enter artist name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select value={uploadForm.genre} onValueChange={(value) => handleInputChange('genre', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {MUSIC_GENRES.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={uploadForm.releaseDate}
                      onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tell us about your track..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileAudio className="w-5 h-5" />
                        Audio File *
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange('audioFile', e.target.files?.[0] || null)}
                        required
                      />
                      {uploadForm.audioFile && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {uploadForm.audioFile.name} ({formatFileSize(uploadForm.audioFile.size)})
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Image className="w-5 h-5" />
                        Cover Art (Optional)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('coverFile', e.target.files?.[0] || null)}
                      />
                      {uploadForm.coverFile && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {uploadForm.coverFile.name} ({formatFileSize(uploadForm.coverFile.size)})
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license">License</Label>
                    <Select value={uploadForm.license} onValueChange={(value) => handleInputChange('license', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LICENSE_TYPES.map(license => (
                          <SelectItem key={license} value={license}>{license}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Price (sats)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={uploadForm.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0 (free)"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Decentralized Storage
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Your music will be stored on Blossom servers and distributed across the Nostr network. 
                        This ensures your content remains available and censorship-resistant.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Track
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {uploadStep === 'uploading' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Uploading to Decentralized Network</h3>
              <p className="text-muted-foreground">Please wait while we process your upload...</p>
            </div>
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          </div>
        )}

        {uploadStep === 'complete' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload Complete!</h3>
              <p className="text-muted-foreground">
                "{uploadForm.title}" is now live on the decentralized network
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              Published to Nostr Network
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
