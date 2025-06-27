import { cn } from '@/lib/utils';

interface ZapToneLogoProps {
  className?: string;
  animated?: boolean;
}

export function ZapToneLogo({ className, animated = false }: ZapToneLogoProps) {
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      className
    )}>
      {/* ZapTone Logo with zoom animation */}
      <div className={cn(
        "relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl",
        animated && "animate-zap-zoom"
      )}>
        <img 
          src="/icon-192.png" 
          alt="ZapTone Logo"
          className="w-full h-full object-contain"
        />
        
        {/* Glow effect when animated */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl animate-pulse" />
        )}
      </div>
    </div>
  );
}
