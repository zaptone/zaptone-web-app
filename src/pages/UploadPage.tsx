import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Music, 
  Image,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [trackInfo, setTrackInfo] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: ''
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const newFile: UploadFile = {
          id: Math.random().toString(),
          file,
          progress: 0,
          status: 'uploading'
        };
        
        setUploadFiles(prev => [...prev, newFile]);
        
        // Simulate upload progress
        simulateUpload(newFile.id);
      }
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = file.progress + 10;
          return {
            ...file,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'uploading'
          };
        }
        return file;
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold mb-2">Upload Music</h1>
        <p className="text-muted-foreground">Share your music with the world</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
        <div className="max-w-4xl space-y-8">
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
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Choose Files
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept="audio/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>
          </div>

          {/* Upload Progress */}
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
              <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload cover art for your track
              </p>
              <Button variant="outline" size="sm">
                Choose Image
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pb-8">
            <Button 
              size="lg" 
              className="flex-1"
              disabled={!trackInfo.title || !trackInfo.artist || uploadFiles.length === 0}
            >
              Publish Track
            </Button>
            <Button variant="outline" size="lg">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
