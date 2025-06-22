import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Volume2, 
  Wifi, 
  Shield, 
  Bell,
  Download,
  Trash2,
  Plus,
  X,
  Check
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Audio Settings
    volume: [75],
    audioQuality: 'high',
    autoplay: true,
    crossfade: false,
    
    // Notification Settings
    pushNotifications: true,
    emailNotifications: false,
    newMusicAlerts: true,
    followingActivity: true,
    
    // Privacy Settings
    publicProfile: true,
    showListeningActivity: true,
    allowDirectMessages: true,
    
    // App Settings
    downloadLocation: '/downloads',
    cacheSize: [5],
    autoDownload: false
  });

  const [relays, setRelays] = useState([
    { url: 'wss://relay.damus.io', status: 'connected', read: true, write: true },
    { url: 'wss://nos.lol', status: 'connected', read: true, write: false },
    { url: 'wss://relay.nostr.band', status: 'disconnected', read: true, write: true }
  ]);

  const [newRelay, setNewRelay] = useState('');

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting updated",
      description: "Your preferences have been saved",
    });
  };

  const addRelay = () => {
    if (newRelay && !relays.some(r => r.url === newRelay)) {
      setRelays(prev => [...prev, {
        url: newRelay,
        status: 'connecting',
        read: true,
        write: true
      }]);
      setNewRelay('');
      toast({
        title: "Relay added",
        description: "New relay has been added to your list",
      });
    }
  };

  const removeRelay = (url: string) => {
    setRelays(prev => prev.filter(r => r.url !== url));
    toast({
      title: "Relay removed",
      description: "Relay has been removed from your list",
    });
  };

  const toggleRelayPermission = (url: string, type: 'read' | 'write') => {
    setRelays(prev => prev.map(relay => 
      relay.url === url 
        ? { ...relay, [type]: !relay[type] }
        : relay
    ));
  };

  const clearCache = () => {
    toast({
      title: "Cache cleared",
      description: "Application cache has been cleared successfully",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your ZapTone experience</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="relays">Relays</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications for important updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Music Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when artists you follow release new music
                    </p>
                  </div>
                  <Switch
                    checked={settings.newMusicAlerts}
                    onCheckedChange={(checked) => updateSetting('newMusicAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Following Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for activity from people you follow
                    </p>
                  </div>
                  <Switch
                    checked={settings.followingActivity}
                    onCheckedChange={(checked) => updateSetting('followingActivity', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio Preferences
                </CardTitle>
                <CardDescription>
                  Configure audio playback settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Master Volume</Label>
                    <span className="text-sm text-muted-foreground">{settings.volume[0]}%</span>
                  </div>
                  <Slider
                    value={settings.volume}
                    onValueChange={(value) => updateSetting('volume', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audio Quality</Label>
                    <p className="text-sm text-muted-foreground">
                      Higher quality uses more bandwidth
                    </p>
                  </div>
                  <Select 
                    value={settings.audioQuality} 
                    onValueChange={(value) => updateSetting('audioQuality', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="lossless">Lossless</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autoplay</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play similar music when queue ends
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Crossfade</Label>
                    <p className="text-sm text-muted-foreground">
                      Smooth transition between tracks
                    </p>
                  </div>
                  <Switch
                    checked={settings.crossfade}
                    onCheckedChange={(checked) => updateSetting('crossfade', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relays Settings */}
          <TabsContent value="relays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Nostr Relays
                </CardTitle>
                <CardDescription>
                  Manage your Nostr relay connections for publishing and receiving events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Relay */}
                <div className="flex gap-2">
                  <Input
                    placeholder="wss://relay.example.com"
                    value={newRelay}
                    onChange={(e) => setNewRelay(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRelay()}
                  />
                  <Button onClick={addRelay} disabled={!newRelay}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Separator />

                {/* Relay List */}
                <div className="space-y-3">
                  {relays.map((relay) => (
                    <div key={relay.url} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono">{relay.url}</code>
                          <Badge 
                            variant={relay.status === 'connected' ? 'default' : relay.status === 'connecting' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {relay.status === 'connected' && <Check className="w-3 h-3 mr-1" />}
                            {relay.status === 'disconnected' && <X className="w-3 h-3 mr-1" />}
                            {relay.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={relay.read}
                              onCheckedChange={() => toggleRelayPermission(relay.url, 'read')}
                            />
                            Read
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={relay.write}
                              onCheckedChange={() => toggleRelayPermission(relay.url, 'write')}
                            />
                            Write
                          </label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRelay(relay.url)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={settings.publicProfile}
                    onCheckedChange={(checked) => updateSetting('publicProfile', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Listening Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see what you're currently listening to
                    </p>
                  </div>
                  <Switch
                    checked={settings.showListeningActivity}
                    onCheckedChange={(checked) => updateSetting('showListeningActivity', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive direct messages from other users
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowDirectMessages}
                    onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Settings */}
          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Storage & Downloads
                </CardTitle>
                <CardDescription>
                  Manage local storage and download preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Cache Size</Label>
                    <span className="text-sm text-muted-foreground">{settings.cacheSize[0]} GB</span>
                  </div>
                  <Slider
                    value={settings.cacheSize}
                    onValueChange={(value) => updateSetting('cacheSize', value)}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher cache size improves performance but uses more storage
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Download</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download liked songs for offline listening
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoDownload}
                    onCheckedChange={(checked) => updateSetting('autoDownload', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Clear Cache</Label>
                    <p className="text-sm text-muted-foreground">
                      Free up space by clearing temporary files
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearCache}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsPage;
