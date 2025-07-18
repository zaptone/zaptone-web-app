import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useUserTracks } from '@/hooks/useMusicTracks';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Edit, 
  Shield, 
  Music, 
  Upload, 
  Copy, 
  Check,
  Camera,
  Save,
  X,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { AnimatePresence, motion } from 'framer-motion';
import type { ChangeEvent } from 'react';

export default function ProfilePage() {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playerSeek] = useState<number | undefined>(undefined);
  const { user, metadata } = useCurrentUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const pictureFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: publishEvent } = useNostrPublish();
  
  const [editData, setEditData] = useState({
    name: metadata?.name || '',
    about: metadata?.about || '',
    picture: metadata?.picture || '',
    banner: metadata?.banner || '',
    nip05: metadata?.nip05 || '',
    website: metadata?.website || ''
  });

  const userDisplayName = metadata?.name || `User ${user?.pubkey.slice(0, 8)}`;
  const userPicture = metadata?.picture;
  const userBanner = metadata?.banner;

  const { data: musicList = [], isLoading: isMusicLoading } = useUserTracks(user?.pubkey);

  // When metadata changes, update the edit data
  useEffect(() => {
    if (metadata && !isEditing) {
      setEditData({
        name: metadata.name || '',
        about: metadata.about || '',
        picture: metadata.picture || '',
        banner: metadata.banner || '',
        nip05: metadata.nip05 || '',
        website: metadata.website || ''
      });
    }
  }, [metadata, isEditing]);

  // When entering edit mode, sync the form with the latest metadata
  useEffect(() => {
    if (isEditing && metadata) {
      setEditData({
        name: metadata.name || '',
        about: metadata.about || '',
        picture: metadata.picture || '',
        banner: metadata.banner || '',
        nip05: metadata.nip05 || '',
        website: metadata.website || ''
      });
    }
  }, [isEditing, metadata]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Public key copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handlePictureUpload = async (file: File) => {
    setIsUploadingPicture(true);
    try {
      const [[, url]] = await uploadFile(file);
      setEditData(prev => ({ ...prev, picture: url }));
      toast({
        title: "Picture uploaded",
        description: "Profile picture uploaded successfully",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload picture",
        variant: "destructive"
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    setIsUploadingBanner(true);
    try {
      const [[, url]] = await uploadFile(file);
      setEditData(prev => ({ ...prev, banner: url }));
      toast({
        title: "Banner uploaded",
        description: "Profile banner uploaded successfully",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not upload banner",
        variant: "destructive"
      });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    if (!user?.signer) {
      toast({
        title: "Cannot save profile",
        description: "No signer available",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Create new profile event
      const profileData = {
        name: editData.name,
        about: editData.about,
        picture: editData.picture,
        banner: editData.banner,
        nip05: editData.nip05,
        website: editData.website
      };

      // Optimistically update the cache immediately for smooth UX
      queryClient.setQueryData(['author', user.pubkey], (oldData: any) => {
        if (!oldData) return { metadata: profileData };
        return {
          ...oldData,
          metadata: {
            ...oldData.metadata,
            ...profileData,
          },
        };
      });

      // Exit editing mode immediately for smooth UX
      setIsEditing(false);

      // Show success message immediately
      toast({
        title: "Profile Updated!",
        description: "Your changes have been saved successfully.",
      });

      // Publish profile event in the background
      await publishEvent({
        kind: 0,
        content: JSON.stringify(profileData),
        tags: [],
        created_at: Math.floor(Date.now() / 1000)
      });

      // Invalidate cache after a short delay to refetch from relays
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['author', user.pubkey]
        });
      }, 1000);

    } catch (error) {
      console.error('Profile save error:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your profile changes. Please try again.",
        variant: "destructive"
      });
      
      // Revert optimistic update on failure
      queryClient.invalidateQueries({ queryKey: ['author', user.pubkey] });
      setIsEditing(true); // Re-enable editing mode
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset edit data to current metadata
    if (metadata) {
      setEditData({
        name: metadata.name || '',
        about: metadata.about || '',
        picture: metadata.picture || '',
        banner: metadata.banner || '',
        nip05: metadata.nip05 || '',
        website: metadata.website || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to sign in with Nostr to view your profile
            </p>
            <Button>Sign in with Nostr</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <AnimatePresence>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your Nostr identity and preferences</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} className="gap-2" disabled={isSaving}>
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              {/* Main Profile Card */}
              <Card className="overflow-hidden pt-0">
                <CardContent className="p-0">
                  {/* Banner Section */}
                  <div className="relative h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    {(isEditing ? editData.banner : userBanner) && (
                      <AnimatePresence>
                        <motion.img
                          key={isEditing ? editData.banner : userBanner}
                          src={isEditing ? editData.banner : userBanner}
                          alt="Profile Banner"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                    )}
                    {isEditing && (
                      <div className="absolute top-4 right-4">
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={() => bannerFileRef.current?.click()}
                          disabled={isUploadingBanner}
                          className="bg-black/60 hover:bg-black/80 text-white border-white/20 backdrop-blur-sm"
                        >
                          {isUploadingBanner ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Banner
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Profile Info Section */}
                  <div className="px-6 py-6">
                    {/* Avatar and Name Row */}
                    <div className="flex items-end gap-4 -mt-16 mb-6">
                      <div className="relative">
                        <Avatar className="w-32 h-32 ring-4 ring-background shadow-2xl">
                          <AnimatePresence>
                            <motion.div
                              key={isEditing ? editData.picture : userPicture}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                              className="w-full h-full"
                            >
                              {(isEditing ? editData.picture : userPicture) ? (
                                <AvatarImage 
                                  src={isEditing ? editData.picture : userPicture} 
                                  className="object-cover"
                                />
                              ) : null}
                            </motion.div>
                          </AnimatePresence>
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-3xl font-bold">
                            {(isEditing ? editData.name : userDisplayName).slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button 
                            size="sm" 
                            className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                            variant="default"
                            onClick={() => pictureFileRef.current?.click()}
                            disabled={isUploadingPicture}
                          >
                            {isUploadingPicture ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Camera className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isEditing ? 'edit' : 'view'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isEditing ? (
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                                    Display Name
                                  </Label>
                                  <Input
                                    id="name"
                                    value={editData.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your display name"
                                    className="text-xl font-bold mt-1 p-3 border-2 border-muted-foreground/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                                    disabled={isSaving}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h1 className="text-3xl font-bold text-foreground">{userDisplayName}</h1>
                                {metadata?.nip05 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                      <Shield className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">{metadata.nip05}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hidden File Inputs */}
                    <input
                      ref={pictureFileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePictureUpload(file);
                      }}
                    />
                    <input
                      ref={bannerFileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBannerUpload(file);
                      }}
                    />

                    {/* URL Inputs (only in edit mode) */}
                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-muted-foreground/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <Label className="text-sm font-medium text-muted-foreground">
                              Or enter image URLs directly
                            </Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="pictureUrl" className="text-sm font-medium">
                                Profile Picture URL
                              </Label>
                              <Input
                                id="pictureUrl"
                                value={editData.picture}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, picture: e.target.value }))}
                                placeholder="https://example.com/picture.jpg"
                                className="mt-1"
                                disabled={isSaving}
                              />
                            </div>
                            <div>
                              <Label htmlFor="bannerUrl" className="text-sm font-medium">
                                Banner Image URL
                              </Label>
                              <Input
                                id="bannerUrl"
                                value={editData.banner}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, banner: e.target.value }))}
                                placeholder="https://example.com/banner.jpg"
                                className="mt-1"
                                disabled={isSaving}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Separator className="my-6" />

                    {/* About Section */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">About</Label>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isEditing ? 'edit-about' : 'view-about'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isEditing ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editData.about}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditData(prev => ({ ...prev, about: e.target.value }))}
                                placeholder="Tell the world about yourself..."
                                rows={4}
                                className="resize-none"
                                disabled={isSaving}
                              />
                              <div className="text-xs text-muted-foreground">
                                {editData.about.length}/500 characters
                              </div>
                            </div>
                          ) : (
                            <div className="bg-muted/30 rounded-lg p-4 min-h-[100px] flex items-center">
                              <p className="text-muted-foreground leading-relaxed">
                                {metadata?.about || (
                                  <span className="italic">No bio provided yet. Click 'Edit Profile' to add one!</span>
                                )}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <Separator className="my-6" />

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Website</Label>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isEditing ? 'edit-website' : 'view-website'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.website}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                                placeholder="https://yourwebsite.com"
                                disabled={isSaving}
                              />
                            ) : (
                              <div className="bg-muted/30 rounded-lg p-3">
                                {metadata?.website ? (
                                  <a 
                                    href={metadata.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium hover:underline break-all"
                                  >
                                    {metadata.website}
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground italic">No website provided</span>
                                )}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">NIP-05 Verification</Label>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isEditing ? 'edit-nip05' : 'view-nip05'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.nip05}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, nip05: e.target.value }))}
                                placeholder="username@domain.com"
                                disabled={isSaving}
                              />
                            ) : (
                              <div className="bg-muted/30 rounded-lg p-3">
                                {metadata?.nip05 ? (
                                  <span className="text-foreground font-mono text-sm">{metadata.nip05}</span>
                                ) : (
                                  <span className="text-muted-foreground italic">Not verified</span>
                                )}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Public Key Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="w-5 h-5" />
                    Public Key
                  </CardTitle>
                  <CardDescription>
                    Your unique Nostr identifier - share this with others to connect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                    <code className="flex-1 text-sm font-mono break-all text-muted-foreground">
                      {user.pubkey}
                    </code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(user.pubkey)} className="shrink-0">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Music Tab */}
            <TabsContent value="music" className="space-y-6">
              {/* Music Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {musicList.length}
                    </CardTitle>
                    <CardDescription className="font-medium">Total Tracks</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {musicList.reduce((acc: number, m: any) => {
                        const playsTag = m.event.tags.find((t: string[]) => t[0] === 'plays');
                        return acc + (playsTag ? parseInt(playsTag[1]) : 0);
                      }, 0)}
                    </CardTitle>
                    <CardDescription className="font-medium">Total Plays</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {musicList.filter((track: any) => track.coverUrl).length}
                    </CardTitle>
                    <CardDescription className="font-medium">With Artwork</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Music Collection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        My Music Collection
                      </CardTitle>
                      <CardDescription>
                        Your published music tracks on Nostr
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm font-medium">
                      {musicList.length} {musicList.length === 1 ? 'track' : 'tracks'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {isMusicLoading ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Music className="w-12 h-12 text-muted-foreground animate-pulse" />
                      </div>
                      <p className="text-muted-foreground">Loading your music...</p>
                    </div>
                  ) : musicList.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Music className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No Music Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        You haven't uploaded any music tracks yet. Start sharing your music with the world!
                      </p>
                      <Button className="gap-2" onClick={() => navigate('/upload')}>
                        <Upload className="w-4 h-4" />
                        Upload Your First Track
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {musicList.map((track: any, index: number) => {
                        const isPlaying = playingTrackId === track.id;
                        const playsTag = track.event.tags.find((t: string[]) => t[0] === 'plays');
                        const plays = playsTag ? parseInt(playsTag[1]) : 0;
                        
                        return (
                          <div
                            key={track.id}
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors group"
                          >
                            {/* Track Number & Artwork */}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {index + 1}
                              </div>
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                                {track.coverUrl ? (
                                  <img 
                                    src={track.coverUrl} 
                                    alt={`${track.title} artwork`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Music className="w-6 h-6 text-white/80" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Track Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate text-lg">
                                {track.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span>{track.artist}</span>
                                <span>•</span>
                                <span>{plays} plays</span>
                                <span>•</span>
                                <span>{track.duration}s</span>
                              </div>
                            </div>

                            {/* Play Controls */}
                            <div className="flex items-center gap-2">
                              {track.audioUrl && (
                                <>
                                  <Button
                                    variant={isPlaying ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPlayingTrackId(isPlaying ? null : track.id)}
                                    className="gap-2"
                                  >
                                    {isPlaying ? (
                                      <>
                                        <Pause className="w-4 h-4" />
                                        Pause
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-4 h-4" />
                                        Play
                                      </>
                                    )}
                                  </Button>
                                  {isPlaying && (
                                    <div className="hidden">
                                      <AudioPlayer
                                        track={{ id: track.id, title: track.title, artist: track.artist, url: track.audioUrl }}
                                        isPlaying={isPlaying}
                                        onTimeUpdate={() => {}}
                                        onPlay={() => {}}
                                        onPause={() => setPlayingTrackId(null)}
                                        seekTime={playerSeek}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Music Activity Timeline */}
              {musicList.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest music uploads and activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {musicList.slice(0, 5).map((track: any) => (
                        <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg border-l-4 border-l-purple-500 bg-muted/20">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              Uploaded <span className="text-purple-600 dark:text-purple-400">"{track.title}"</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(track.event.created_at * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your Nostr keys and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Private Key Management</Label>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Your private key is securely stored and never transmitted. 
                        Always keep a backup in a safe place.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                        Export Private Key
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Connected Relays</Label>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage the relays you're connected to for publishing and receiving events.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                        Manage Relays
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatePresence>
    </div>
  );
}
