import { useState } from 'react';
import { AudioPlayer } from '@/components/AudioPlayer';
import { useUserTracks } from '@/hooks/useMusicTracks';
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
  Heart, 
  Upload, 
  Copy, 
  Check,
  Camera,
  Save,
  X
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';

export function ProfilePage() {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playerSeek] = useState<number | undefined>(undefined);
  const { user, metadata } = useCurrentUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Public key copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    // TODO: Implement profile update via Nostr
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: metadata?.name || '',
      about: metadata?.about || '',
      picture: metadata?.picture || '',
      banner: metadata?.banner || '',
      nip05: metadata?.nip05 || '',
      website: metadata?.website || ''
    });
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
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  This information is visible to other users on the network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner Section */}
                <div className="mb-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="banner">Banner URL</Label>
                      <Input
                        id="banner"
                        value={editData.banner}
                        onChange={(e) => setEditData(prev => ({ ...prev, banner: e.target.value }))}
                        placeholder="https://yourbanner.com/banner.jpg"
                      />
                    </div>
                  ) : (
                    userBanner && (
                      <img src={userBanner} alt="Banner" className="w-full h-32 object-cover rounded-lg mb-2" />
                    )
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-purple-500/20">
                      {userPicture && <AvatarImage src={isEditing ? editData.picture : userPicture} />}
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-2xl font-bold">
                        {userDisplayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        variant="secondary"
                        // TODO: Implement file upload logic
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your display name"
                        />
                      ) : (
                        <p className="text-lg font-semibold">{userDisplayName}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Profile Fields */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    {isEditing ? (
                      <Textarea
                        id="about"
                        value={editData.about}
                        onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
                        placeholder="Tell others about yourself..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {metadata?.about || "No bio provided"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          value={editData.website}
                          onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://yourwebsite.com"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {metadata?.website || "No website provided"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nip05">NIP-05 Identifier</Label>
                      {isEditing ? (
                        <Input
                          id="nip05"
                          value={editData.nip05}
                          onChange={(e) => setEditData(prev => ({ ...prev, nip05: e.target.value }))}
                          placeholder="user@domain.com"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-muted-foreground">
                            {metadata?.nip05 || "Not verified"}
                          </p>
                          {metadata?.nip05 && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Key Card */}
            <Card>
              <CardHeader>
                <CardTitle>Public Key</CardTitle>
                <CardDescription>
                  Your unique Nostr identifier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm font-mono truncate">
                    {user.pubkey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.pubkey)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{musicList.length}</p>
                      <p className="text-sm text-muted-foreground">Tracks Uploaded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Liked Songs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{
                        musicList.reduce((acc: number, m: typeof musicList[0]) => {
                          const playsTag = m.event.tags.find((t: string[]) => t[0] === 'plays');
                          return acc + (playsTag ? parseInt(playsTag[1]) : 0);
                        }, 0)
                      }</p>
                      <p className="text-sm text-muted-foreground">Total Plays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My Music List</CardTitle>
                <CardDescription>My uploaded tracks</CardDescription>
              </CardHeader>
              <CardContent>
                {isMusicLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : musicList.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No music uploads yet. Start sharing your music!
                  </p>
                ) : (
                  <ul className="divide-y">
                    {musicList.map((track: typeof musicList[0]) => {
                      const isPlaying = playingTrackId === track.id;
                      return (
                        <li key={track.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {track.coverUrl && (
                              <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded object-cover" />
                            )}
                            <div>
                              <span className="font-medium">{track.title}</span>
                              <span className="block text-xs text-muted-foreground">{track.artist}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Plays: {
                                (() => {
                                  const playsTag = track.event.tags.find((t: string[]) => t[0] === 'plays');
                                  return playsTag ? playsTag[1] : '0';
                                })()
                              } | Duration: {track.duration}s
                            </span>
                            {track.audioUrl && (
                              <>
                                <button
                                  className={`ml-2 px-2 py-1 rounded text-xs ${isPlaying ? 'bg-green-500 text-white' : 'bg-muted'}`}
                                  onClick={() => setPlayingTrackId(isPlaying ? null : track.id)}
                                >
                                  {isPlaying ? 'Pause' : 'Play'}
                                </button>
                                {isPlaying && (
                                  <AudioPlayer
                                    track={{ id: track.id, title: track.title, artist: track.artist, url: track.audioUrl }}
                                    isPlaying={isPlaying}
                                    onTimeUpdate={() => {}}
                                    onPlay={() => {}}
                                    onPause={() => setPlayingTrackId(null)}
                                    seekTime={playerSeek}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage;
