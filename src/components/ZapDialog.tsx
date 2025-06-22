import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Zap, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

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
  const [amount, setAmount] = useState<number>(100);
  const [message, setMessage] = useState('');
  const [isZapping, setIsZapping] = useState(false);
  const [zapSent, setZapSent] = useState(false);
  const [invoice, setInvoice] = useState<string>('');

  const handleAmountSelect = (value: number) => {
    setAmount(value);
  };

  const generateInvoice = async (): Promise<string> => {
    // Mock Lightning invoice generation
    // In a real implementation, this would call the recipient's Lightning Address
    // or LNURL to generate an actual invoice
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`lnbc${amount}n1p3xnhl2pp5yhkrpw...`);
      }, 1000);
    });
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

    setIsZapping(true);

    try {
      // Generate Lightning invoice
      const lightningInvoice = await generateInvoice();
      setInvoice(lightningInvoice);

      // In a real implementation, this would:
      // 1. Get the recipient's Lightning Address or LNURL
      // 2. Request an invoice for the specified amount
      // 3. Open the user's Lightning wallet to pay
      // 4. Broadcast a zap event to Nostr when payment is confirmed

      // Mock payment success
      setTimeout(() => {
        setIsZapping(false);
        setZapSent(true);
        
        toast({
          title: "⚡ Zap Sent!",
          description: `Successfully zapped ${amount} sats to ${recipient.name || 'artist'}`,
        });

        // Reset after showing success
        setTimeout(() => {
          setZapSent(false);
          setAmount(100);
          setMessage('');
          setInvoice('');
          onOpenChange(false);
        }, 2000);
      }, 2000);

    } catch (error) {
      console.error('Zap failed:', error);
      toast({
        title: "Zap Failed",
        description: "Failed to send zap. Please try again.",
        variant: "destructive"
      });
      setIsZapping(false);
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

  const formatSats = (sats: number): string => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}k`;
    }
    return sats.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Send Lightning Zap
          </DialogTitle>
        </DialogHeader>

        {!zapSent ? (
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
                <div className="text-lg font-bold text-yellow-600">~$0.{(amount * 0.0003).toFixed(2).slice(-2)}</div>
                <div className="text-xs text-muted-foreground">USD</div>
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
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>

            {/* Lightning Invoice (if generated) */}
            {invoice && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Lightning Invoice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                    {invoice}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyInvoice} className="flex-1">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
