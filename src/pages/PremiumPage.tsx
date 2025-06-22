import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Crown, 
  Star, 
  Check, 
  Sparkles,
  Shield,
  Infinity,
  Globe,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';

export function PremiumPage() {
  const { user, metadata } = useCurrentUser();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [customUsername, setCustomUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const plans = [    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      zapCost: 0,
      period: 'Free Forever',
      description: 'Perfect for casual listeners',
      features: [
        'Listen to all music',
        'Basic playlists',
        'Standard audio quality',
        'Community features',
        'Mobile app access'
      ],
      disabled: false,
      current: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 100,
      zapCost: 100,
      period: 'per month',
      description: 'Enhanced experience for music lovers',
      features: [
        'Everything in Basic',
        'High-quality audio (320kbps)',
        'Unlimited playlists',
        'Download for offline',
        'Ad-free experience',
        'Early access to new features'
      ],
      disabled: false,
      popular: true,
      current: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 500,
      zapCost: 500,
      period: 'per month',
      description: 'Ultimate music experience',
      features: [
        'Everything in Pro',
        'Lossless audio quality',
        'Custom username reservation',
        'Priority customer support',
        'Exclusive content access',
        'Advanced analytics',
        'API access for developers'
      ],
      disabled: false
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 5000,
      zapCost: 5000,
      period: 'one-time payment',
      description: 'Never pay again',
      features: [
        'Everything in Premium',
        'Lifetime access',
        'Permanent username',
        'VIP support',
        'Beta testing access',
        'Founder badge',
        'Revenue sharing program'
      ],
      disabled: false,
      exclusive: true
    }
  ];

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    // Simulate API call
    setTimeout(() => {
      const isAvailable = !['admin', 'support', 'api', 'www', 'test', 'demo'].includes(username.toLowerCase());
      setUsernameAvailable(isAvailable);
      setIsCheckingUsername(false);
    }, 1000);
  };

  const handleUsernameChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setCustomUsername(cleanValue);
    if (cleanValue !== value) {
      toast({
        title: "Username cleaned",
        description: "Only lowercase letters and numbers are allowed",
      });
    }
    checkUsernameAvailability(cleanValue);
  };

  const handleUpgrade = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // TODO: Implement actual payment with Lightning/Zap
    toast({
      title: "Payment Required",
      description: `Please send ${plan.zapCost} ⚡ to complete your upgrade to ${plan.name}`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const userDisplayName = metadata?.name || `User ${user?.pubkey.slice(0, 8)}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            ZapTone Premium
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of decentralized music with Lightning-powered subscriptions
        </p>
      </div>

      {/* Current Status */}
      {user && (
        <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {userDisplayName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{userDisplayName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Basic Plan
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {user.pubkey.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold text-amber-600">Pro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}      {/* Username Reservation - Only for Pro+ users */}
      {user && (
        <Card className="mb-8 border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/10 dark:to-indigo-950/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Custom Username Reservation</CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">
                    Pro Feature • Create your unique ZapTone identity
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Pro Only
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-4 p-4 rounded-xl bg-white/60 dark:bg-gray-900/20 border border-purple-100/50 dark:border-purple-900/20">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm">Web Identity</h4>
                <p className="text-xs text-muted-foreground">Your personal zaptone.app page</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm">NIP-05 Verified</h4>
                <p className="text-xs text-muted-foreground">Verified Nostr identity</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-sm">Lightning Address</h4>
                <p className="text-xs text-muted-foreground">Receive payments easily</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-base font-semibold">Choose Your Username</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create a unique identifier that represents you across the ZapTone ecosystem
                  </p>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={customUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`pr-12 ${
                        usernameAvailable === true 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/10 dark:border-green-700/50' 
                          : usernameAvailable === false 
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/10 dark:border-red-700/50' 
                          : 'border-purple-200 dark:border-purple-800/50 focus:border-purple-500 dark:focus:border-purple-600'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingUsername ? (
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      ) : usernameAvailable === true ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : usernameAvailable === false ? (
                        <span className="w-4 h-4 text-red-500">✕</span>
                      ) : null}
                    </div>
                  </div>
                  
                  {isCheckingUsername && (
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-2">
                      <div className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin" />
                      Checking availability...
                    </p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 mt-2">
                      <Check className="w-4 h-4" />
                      Great choice! This username is available
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      This username is already taken. Try another one.
                    </p>
                  )}
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30">
                  <h5 className="font-medium text-sm mb-2 text-purple-700 dark:text-purple-300">Username Requirements:</h5>
                  <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                    <li>• 3-20 characters long</li>
                    <li>• Only lowercase letters and numbers</li>
                    <li>• Must start with a letter</li>
                    <li>• No special characters or spaces</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Your ZapTone Identity</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Once reserved, you'll get these powerful features:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10 border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => copyToClipboard(`https://zaptone.app/${customUsername || 'yourname'}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">Personal Website</p>
                        <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                          zaptone.app/{customUsername || 'yourname'}
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div 
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10 border border-green-100 dark:border-green-900/30 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => copyToClipboard(`${customUsername || 'yourname'}@zaptone.app`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-green-700 dark:text-green-300">NIP-05 Verification</p>
                        <p className="font-mono text-sm text-green-600 dark:text-green-400">
                          {customUsername || 'yourname'}@zaptone.app
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div 
                    className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/10 dark:to-orange-950/10 border border-amber-100 dark:border-amber-900/30 cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => copyToClipboard(`${customUsername || 'yourname'}@zaptone.app`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-amber-700 dark:text-amber-300">Lightning Address</p>
                        <p className="font-mono text-sm text-amber-600 dark:text-amber-400">
                          {customUsername || 'yourname'}@zaptone.app
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>
                </div>
                
                {customUsername && usernameAvailable === true && (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold h-12"
                    onClick={() => handleUpgrade('premium')}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Reserve Username (500 ⚡)
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border border-gray-100 dark:border-gray-800/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm mb-1">Premium Feature</h5>
                  <p className="text-xs text-muted-foreground">
                    Username reservation is available with Premium and Lifetime plans. 
                    Upgrade to claim your unique ZapTone identity and unlock advanced features.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-amber-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${
              plan.popular 
                ? 'border-amber-500 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20' 
                : ''
            } ${
              plan.exclusive
                ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20'
                : ''
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            {plan.exclusive && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Exclusive
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                {plan.zapCost === 0 ? (
                  <div className="text-3xl font-bold">Free</div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold flex items-center justify-center gap-1">
                      {plan.zapCost}
                      <Zap className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  plan.current 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                    : plan.exclusive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                    : ''
                }`}
                disabled={plan.current || plan.disabled}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Lightning Payment
          </CardTitle>
          <CardDescription>
            All payments are processed through the Lightning Network for instant, low-fee transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Zap className="w-8 h-8 text-amber-500" />
              <div>
                <h4 className="font-medium">Lightning Fast</h4>
                <p className="text-sm text-muted-foreground">Instant payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <h4 className="font-medium">Secure</h4>
                <p className="text-sm text-muted-foreground">Self-sovereign payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <Infinity className="w-8 h-8 text-blue-500" />
              <div>
                <h4 className="font-medium">Global</h4>
                <p className="text-sm text-muted-foreground">Works anywhere</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <h4 className="font-medium">Need help with Lightning payments?</h4>
            <p className="text-sm text-muted-foreground">
              We recommend using wallets like Phoenix, Breez, or Wallet of Satoshi
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More About Lightning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PremiumPage;
