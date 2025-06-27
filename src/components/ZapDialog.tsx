import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';

interface ZapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: {
    pubkey: string;
    name?: string;
    picture?: string;
    lnAddress?: string;
  };
  content?: {
    type: 'track' | 'artist' | 'album';
    title: string;
    id: string;
  };
}

const PRESET_AMOUNTS = [21, 100, 500, 1000, 5000, 10000];

export function ZapDialog({ open, onOpenChange, recipient, content }: ZapDialogProps) {
  const { toast } = useToast();
  const { formatSatsToUsd, bitcoinPrice, isLoading: isPriceLoading } = useBitcoinPrice();
  const [amount, setAmount] = useState<number>(100);
  const [message, setMessage] = useState('');
  const [isZapping, setIsZapping] = useState(false);
  const [zapSent, setZapSent] = useState(false);
  const [invoice, setInvoice] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showInvoiceView, setShowInvoiceView] = useState(false);

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

  const generateInvoice = async (): Promise<string> => {
    if (!recipient.lnAddress) {
      throw new Error('No Lightning address provided');
    }

    try {
      // Parse Lightning Address (user@domain.com)
      const [username, domain] = recipient.lnAddress.split('@');
      if (!username || !domain) {
        throw new Error('Invalid Lightning address format');
      }

      // Step 1: Get LNURL pay endpoint from .well-known
      const wellKnownUrl = `https://${domain}/.well-known/lnurlp/${username}`;
      const wellKnownResponse = await fetch(wellKnownUrl);
      
      if (!wellKnownResponse.ok) {
        throw new Error('Failed to fetch LNURL pay endpoint');
      }

      const wellKnownData = await wellKnownResponse.json();
      
      if (!wellKnownData.callback) {
        throw new Error('No callback URL found in LNURL response');
      }

      // Step 2: Request invoice from callback URL
      const amountMsat = amount * 1000; // Convert sats to millisats
      const callbackUrl = new URL(wellKnownData.callback);
      callbackUrl.searchParams.set('amount', amountMsat.toString());
      
      if (message) {
        callbackUrl.searchParams.set('comment', message);
      }

      const invoiceResponse = await fetch(callbackUrl.toString());
      
      if (!invoiceResponse.ok) {
        throw new Error('Failed to get invoice from Lightning service');
      }

      const invoiceData = await invoiceResponse.json();
      
      if (invoiceData.status === 'ERROR') {
        throw new Error(invoiceData.reason || 'Lightning service returned an error');
      }

      if (!invoiceData.pr) {
        throw new Error('No payment request received from Lightning service');
      }

      return invoiceData.pr;
    } catch (error) {
      console.error('LNURL error:', error);
      throw error;
    }
  };

  const handleZap = async () => {
    if (!amount || amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0 sats",
        variant: "destructive"
      });
      return;
    }

    if (!recipient.lnAddress) {
      toast({
        title: "No Lightning Address",
        description: "This artist doesn't have a Lightning address configured",
        variant: "destructive"
      });
      return;
    }

    setIsZapping(true);

    try {
      // Generate real Lightning invoice using LNURL
      const lightningInvoice = await generateInvoice();
      setInvoice(lightningInvoice);
      setShowInvoiceView(true); // Switch to invoice view

      // Try to open the user's Lightning wallet
      // This will work if they have a Lightning wallet installed that supports lightning: URLs
      const lightningUrl = `lightning:${lightningInvoice}`;
      
      // Create a temporary link to trigger wallet opening
      const link = document.createElement('a');
      link.href = lightningUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsZapping(false);
      
      toast({
        title: "⚡ Invoice Generated!",
        description: `Invoice for ${amount} sats created. Please complete payment in your Lightning wallet.`,
      });

      // Note: In a production app, you would:
      // 1. Monitor the invoice for payment confirmation
      // 2. Broadcast a zap event to Nostr once payment is confirmed
      // 3. Update the UI accordingly
      
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
    setAmount(100);
    setMessage('');
    setInvoice('');
    setQrCodeDataUrl('');
    setZapSent(false);
    setShowInvoiceView(false);
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
        </DialogHeader>

        {showInvoiceView ? (
          /* Invoice View */
          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={recipient.picture} alt={recipient.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {recipient.name?.slice(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{recipient.name || 'Unknown Artist'}</p>
                <p className="text-sm text-muted-foreground">
                  {formatSats(amount)} sats
                  {content && ` • For "${content.title}"`}
                </p>
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
                <AvatarImage src={recipient.picture} alt={recipient.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {recipient.name?.slice(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{recipient.name || 'Unknown Artist'}</p>
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
                    className={amount === preset ? "bg-yellow-500 hover:bg-yellow-600" : ""}
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
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
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
          /* Success State */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">⚡ Zap Sent!</h3>
              <p className="text-muted-foreground">
                Successfully sent {formatSats(amount)} sats to {recipient.name || 'artist'}
              </p>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              <Zap className="w-3 h-3 mr-1" />
              Lightning Payment Confirmed
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
