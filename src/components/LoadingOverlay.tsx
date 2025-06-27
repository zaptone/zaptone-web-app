import { useEffect, useState } from 'react';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ZapToneLogo } from '@/components/ZapToneLogo';
import { cn } from '@/lib/utils';

export function LoadingOverlay() {
  const { isLoading, message, progress } = useGlobalLoading();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      // Delay hiding to allow for smooth animation
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-background/80 backdrop-blur-md",
      "transition-all duration-300 ease-in-out",
      isLoading ? "opacity-100" : "opacity-0"
    )}>
      <Card className="p-8 mx-4 max-w-sm w-full border-muted shadow-xl">
        <div className="text-center space-y-6">
          {/* ZapTone Logo */}
          <div className="flex justify-center">
            <ZapToneLogo animated={isLoading} />
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg tracking-tight">
              {message || 'Loading...'}
            </h3>
            
            {/* Progress bar */}
            {progress > 0 && (
              <div className="space-y-2">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}%
                </p>
              </div>
            )}
            
            {/* Loading dots */}
            {progress === 0 && (
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 bg-muted-foreground rounded-full",
                      isLoading && "animate-bounce"
                    )}
                    style={{
                      animationDelay: `${i * 150}ms`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Subtle brand touch */}
          <div className="text-xs text-muted-foreground/60 font-medium tracking-wider">
            ZAPTONE
          </div>
        </div>
      </Card>
    </div>
  );
}
