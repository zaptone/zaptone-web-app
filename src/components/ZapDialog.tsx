import { useWebLN } from '@/hooks/useWebLN';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import type { NostrMetadata } from '@nostrify/nostrify';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { withLoading } from '@/hooks/useGlobalLoading';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LNURL } from '@nostrify/nostrify/ln';
import { NSchema as n, type NostrEvent } from '@nostrify/nostrify';

interface ZapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: NostrEvent; // The event to be zapped (artist profile, track, etc.)
  content?: {
    type: 'track' | 'artist' | 'album';
    title: string;
    id: string;
  };
}

const PRESET_AMOUNTS = [21, 100, 500, 1000, 5000, 10000];

export function ZapDialog({ open, onOpenChange, target, content }: ZapDialogProps) {
  const { toast } = useToast();
  const { formatSatsToUsd, bitcoinPrice, isLoading: isPriceLoading } = useBitcoinPrice();
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { sendPayment: weblnSendPayment, isAvailable: weblnAvailable } = useWebLN();
  const [amount, setAmount] = useState<number>(100);
  const [message, setMessage] = useState('');
  const [isZapping, setIsZapping] = useState(false);
  const [zapSent, setZapSent] = useState(false);
  const [invoice, setInvoice] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [authorMetadata, setAuthorMetadata] = useState<NostrMetadata | null>(null);
  const [isListeningForReceipt, setIsListeningForReceipt] = useState(false);
  const [cleanupZapListener, setCleanupZapListener] = useState<(() => void) | null>(null);

  /**
   * Trigger celebration confetti animation
   */
  const triggerCelebration = () => {
    // Fire confetti from different angles
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        gravity: 0.8,
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Additional burst from center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        gravity: 1,
        scalar: 1.5,
      });
    }, 500);
  };

  /**
   * Listen for zap receipt (kind 9735) to confirm payment
   * Enhanced implementation based on proven nostr-zap pattern
   */
  const listenForZapReceipt = (invoice: string): () => void => {
    setIsListeningForReceipt(true);
    const since = Math.floor(Date.now() / 1000);
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout | undefined;
    // eslint-disable-next-line prefer-const
    let timeoutId: NodeJS.Timeout | undefined;

    const checkForReceipt = async () => {
      try {
        // Query for zap receipts (kind 9735)
        const receipts = await nostr.query(
          [{ kinds: [9735], since }],
          { signal: AbortSignal.timeout(5000) }
        );

        // Check if any receipt contains our invoice
        const matchingReceipt = receipts.find(event => 
          event.tags.some(tag => tag[0] === 'bolt11' && tag[1] === invoice)
        );        if (matchingReceipt) {
          setZapSent(true);
          setIsListeningForReceipt(false);
          
          if (intervalId) clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
          
          // Trigger celebration animation
          triggerCelebration();
          
          toast({
            title: "⚡ Zap Confirmed!",
            description: `Payment received and confirmed on Nostr!`,
          });

          // Close modal after celebration
          setTimeout(() => {
            onOpenChange(false);
          }, 4000); // Close after 4 seconds to let user enjoy the animation
        }
      } catch {
        // Error checking for zap receipt - silently continue
      }
    };

    // Check immediately, then every 3 seconds
    checkForReceipt();
    intervalId = setInterval(checkForReceipt, 3000);
    
    // Stop after 2 minutes
    timeoutId = setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      setIsListeningForReceipt(false);
    }, 120000);

    // Return cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      setIsListeningForReceipt(false);
    };
  };

  // Fetch author metadata when dialog opens
  useEffect(() => {
    if (open && target) {
      const fetchAuthor = async () => {
        try {
          const [authorEvent] = await nostr.query(
            [{ kinds: [0], authors: [target.pubkey], limit: 1 }],
            { signal: AbortSignal.timeout(5000) }
          );

          if (authorEvent) {
            const metadata = n.json().pipe(n.metadata()).parse(authorEvent.content);
            setAuthorMetadata(metadata);
          }
        } catch (error) {
          console.error('Failed to fetch author metadata:', error);
        }
      };

      fetchAuthor();
    }
  }, [open, target, nostr]);

  // Handle cleanup when modal closes
  useEffect(() => {
    if (!open) {
      // Cleanup when modal is closed
      if (cleanupZapListener) {
        cleanupZapListener();
        setCleanupZapListener(null);
      }
      
      // Reset all state
      setAmount(100);
      setMessage('');
      setInvoice('');
      setQrCodeDataUrl('');
      setZapSent(false);
      setShowInvoiceView(false);
      setAuthorMetadata(null);
      setIsListeningForReceipt(false);
    }
  }, [open, cleanupZapListener]);

  // Generate QR code when invoice changes
  useEffect(() => {
    if (invoice) {
      QRCode.toDataURL(invoice, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
    } else {
      setQrCodeDataUrl('');
    }
  }, [invoice]);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
  };

  /**
   * Create a zap request using Nostrify LNURL implementation
   * Based on NIP-57 Lightning Zaps specification
   */
  const createZapRequest = async (): Promise<string> => {
    if (!user) {
      throw new Error('User must be logged in to send zaps');
    }

    // Fetch the target event author's kind 0 metadata
    const [authorEvent] = await nostr.query(
      [{ kinds: [0], authors: [target.pubkey], limit: 1 }],
      { signal: AbortSignal.timeout(5000) }
    );

    if (!authorEvent) {
      throw new Error('Author metadata not found');
    }

    // Parse author metadata to get Lightning address
    const metadata = n.json().pipe(n.metadata()).parse(authorEvent.content);
    const { lud06, lud16 } = metadata;

    // Get author's LNURL
    let lnurl: LNURL | undefined;
    if (lud16) {
      lnurl = LNURL.fromLightningAddress(lud16);
    } else if (lud06) {
      lnurl = LNURL.fromString(lud06);
    }

    if (!lnurl) {
      throw new Error('No Lightning address found for this user');
    }

    // Create zap request event (kind 9734)
    const zapRequest = await user.signer.signEvent({
      kind: 9734,
      content: message || '',
      tags: [
        ['e', target.id], // Event being zapped
        ['p', target.pubkey], // Author being zapped
        ['amount', (amount * 1000).toString()], // Amount in millisats
        ['relays', 'wss://relay.nostr.band'], // Relay for zap receipt
        ['lnurl', lnurl.toString()],
      ],
      created_at: Math.floor(Date.now() / 1000),
    });

    // Try Nostrify LNURL first
    try {
      const { pr } = await lnurl.getInvoice({
        amount: amount * 1000, // Convert sats to millisats
        nostr: zapRequest,
        signal: AbortSignal.timeout(10000)
      });

      return pr;
    } catch (nostrifyError) {
      console.warn('Nostrify LNURL failed, trying manual LNURL:', nostrifyError);
      
      // Fallback to manual LNURL implementation
      return await createZapRequestManual(lud16 || lud06!, zapRequest);
    }
  };

  /**
   * Manual LNURL implementation as fallback
   */
  const createZapRequestManual = async (lightningAddress: string, zapRequest: NostrEvent): Promise<string> => {
    const [username, domain] = lightningAddress.split('@');
    if (!username || !domain) {
      throw new Error('Invalid Lightning address format');
    }

    // Step 1: Get LNURL pay endpoint from .well-known
    const wellKnownUrl = `https://${domain}/.well-known/lnurlp/${username}`;
    
    const wellKnownResponse = await fetch(wellKnownUrl);
    
    if (!wellKnownResponse.ok) {
      throw new Error(`Failed to fetch LNURL pay endpoint: ${wellKnownResponse.status}`);
    }

    const wellKnownData = await wellKnownResponse.json();
    
    if (!wellKnownData.callback) {
      throw new Error('No callback URL found in LNURL response');
    }

    // Step 2: Request invoice from callback URL
    const amountMsat = amount * 1000; // Convert sats to millisats
    const callbackUrl = new URL(wellKnownData.callback);
    callbackUrl.searchParams.set('amount', amountMsat.toString());
    callbackUrl.searchParams.set('nostr', JSON.stringify(zapRequest));
    
    if (message) {
      callbackUrl.searchParams.set('comment', message);
    }

    const invoiceResponse = await fetch(callbackUrl.toString());
    
    if (!invoiceResponse.ok) {
      throw new Error(`Failed to get invoice from Lightning service: ${invoiceResponse.status}`);
    }

    const invoiceData = await invoiceResponse.json();
    
    if (invoiceData.status === 'ERROR') {
      throw new Error(invoiceData.reason || 'Lightning service returned an error');
    }

    if (!invoiceData.pr) {
      throw new Error('No payment request received from Lightning service');
    }

    return invoiceData.pr;
  };

  const generateInvoice = async (): Promise<string> => {
    return await createZapRequest();
  };

  const handleZap = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send zaps",
        variant: "destructive"
      });
      return;
    }

    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0 sats",
        variant: "destructive"
      });
      return;
    }

    setIsZapping(true);

    try {
      await withLoading(async () => {
        // Generate real Lightning invoice using LNURL
        const lightningInvoice = await generateInvoice();
        
        setInvoice(lightningInvoice);
        setShowInvoiceView(true); // Switch to invoice view

        // Start listening for zap receipt in the background
        const cleanup = listenForZapReceipt(lightningInvoice);
        setCleanupZapListener(() => cleanup);

        // Try WebLN payment if available
        if (weblnAvailable) {
          try {
            await weblnSendPayment(lightningInvoice);
            // Don't set zapSent here, let listenForZapReceipt handle it
            toast({
              title: "⚡ Payment Sent!",
              description: `Sent ${amount} sats via WebLN. Waiting for confirmation...`,
            });
            return;
          } catch {
            // Fall through to show manual invoice
          }
        }
      }, 'Generating Lightning invoice...');

      setIsZapping(false);
      
      if (!weblnAvailable) {
        toast({
          title: "⚡ Invoice Generated!",
          description: `Invoice for ${amount} sats created. Please complete payment in your Lightning wallet.`,
        });
      }
      
    } catch (error) {
      setIsZapping(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Zap Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const copyInvoice = async () => {
    if (invoice) {
      await navigator.clipboard.writeText(invoice);
      toast({
        title: "Copied!",
        description: "Lightning invoice copied to clipboard",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleBackToForm = () => {
    setShowInvoiceView(false);
    setInvoice('');
    setQrCodeDataUrl('');
  };

  const formatSats = (sats: number): string => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}k`;
    }
    return sats.toString();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showInvoiceView && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToForm}
                className="mr-2 p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Zap className="w-5 h-5 text-yellow-400" />
            {showInvoiceView ? 'Lightning Invoice' : 'Send Lightning Zap'}
          </DialogTitle>
          <DialogDescription>
            {showInvoiceView 
              ? 'Complete your Lightning payment using one of the methods below'
              : 'Send a Lightning zap to support this artist'
            }
          </DialogDescription>
        </DialogHeader>

        {showInvoiceView ? (
          /* Invoice View */
          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={authorMetadata?.picture} alt={authorMetadata?.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {authorMetadata?.name?.slice(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{authorMetadata?.name || 'Unknown Artist'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {formatSats(amount)} sats
                    {content && ` • For "${content.title}"`}
                  </p>
                  {isListeningForReceipt && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-xs text-yellow-600">Listening for payment...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs for QR Code and Invoice Text */}
            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="invoice">Invoice Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="qr" className="mt-4">
                {qrCodeDataUrl && (
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg shadow-sm border">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Lightning Invoice QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                )}
                <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md">
                  Scan this QR code with your Lightning wallet to pay the invoice
                </div>
              </TabsContent>
              
              <TabsContent value="invoice" className="mt-4">
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-md font-mono text-xs break-all max-h-32 overflow-y-auto border">
                    {invoice}
                  </div>
                  <div className="text-center text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                    Copy this invoice text and paste it into your Lightning wallet
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyInvoice} className="flex-1">
                <Copy className="w-3 h-3 mr-1" />
                Copy Invoice
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const lightningUrl = `lightning:${invoice}`;
                  window.open(lightningUrl, '_blank');
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Wallet
              </Button>
            </div>
          </div>
        ) : !zapSent ? (
          /* Payment Form */
          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={authorMetadata?.picture} alt={authorMetadata?.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {authorMetadata?.name?.slice(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{authorMetadata?.name || 'Unknown Artist'}</p>
                {content && (
                  <p className="text-sm text-muted-foreground">
                    For "{content.title}"
                  </p>
                )}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <Label>Amount (sats)</Label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAmountSelect(preset)}
                  >
                    {formatSats(preset)}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="Custom amount"
                min="1"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message with your zap..."
                rows={3}
              />
            </div>

            {/* Zap Statistics */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{formatSats(amount)}</div>
                <div className="text-xs text-muted-foreground">Sats</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {isPriceLoading ? '...' : formatSatsToUsd(amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  USD {bitcoinPrice > 0 && (
                    <span className="text-[10px] opacity-70">
                      (${bitcoinPrice.toLocaleString()}/BTC)
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">⚡</div>
                <div className="text-xs text-muted-foreground">Lightning</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleZap} 
                disabled={isZapping || !amount}
                className="flex-1"
              >
                {isZapping ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Zap {formatSats(amount)} sats
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          /* Success State - Celebration Mode! */
          <div className="text-center py-8 space-y-6 relative">
            {/* Animated celebration icon */}
            <div className="relative mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              {/* Celebration rings */}
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-yellow-400/30 animate-ping"></div>
              <div className="absolute inset-2 w-16 h-16 rounded-full bg-orange-400/20 animate-pulse"></div>
            </div>

            {/* Celebration text with gradient */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                🎉 Zap Sent Successfully! 🎉
              </h3>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-yellow-600">{formatSats(amount)} sats</span> sent to{' '}
                <span className="font-semibold">{authorMetadata?.name || 'artist'}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Your support means the world! ⚡💝
              </p>
            </div>

            {/* Animated badges */}
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                Confirmed
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300">
                ✅ Receipt Received
              </Badge>
            </div>

            {/* Closing message */}
            <p className="text-xs text-muted-foreground mt-4">
              Modal will close automatically in a few seconds...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
