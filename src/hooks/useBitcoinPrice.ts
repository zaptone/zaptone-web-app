import { useQuery } from '@tanstack/react-query';

interface BitcoinPriceData {
  time: number;
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  CHF: number;
  AUD: number;
  JPY: number;
}

export function useBitcoinPrice() {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['bitcoin-price'],
    queryFn: async (): Promise<BitcoinPriceData> => {
      const response = await fetch('https://mempool.space/api/v1/prices');
      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin price');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
  });

  // Calculate sats to USD conversion rate
  const satsToUsd = priceData ? priceData.USD / 100000000 : 0.0003; // Fallback to hardcoded value

  const formatSatsToUsd = (sats: number): string => {
    if (!priceData || !sats) return `~$${(sats * 0.0003).toFixed(2)}`;
    
    const usdValue = sats * satsToUsd;
    
    if (usdValue < 0.01) {
      // For very small amounts, show more decimals
      return `~$${usdValue.toFixed(4)}`;
    } else if (usdValue < 1) {
      // For amounts under $1, show 2-3 decimals
      return `~$${usdValue.toFixed(3)}`;
    } else {
      // For amounts $1 and above, show 2 decimals
      return `~$${usdValue.toFixed(2)}`;
    }
  };

  return {
    bitcoinPrice: priceData?.USD || 0,
    satsToUsd,
    formatSatsToUsd,
    isLoading,
    error,
    lastUpdated: priceData?.time ? new Date(priceData.time * 1000) : null,
  };
}
