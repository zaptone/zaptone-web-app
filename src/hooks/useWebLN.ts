import { useState, useEffect } from 'react';

declare global {
  interface Window {
    webln?: {
      enable(): Promise<void>;
      sendPayment(paymentRequest: string): Promise<{ preimage: string }>;
      isEnabled: boolean;
    };
  }
}

export function useWebLN() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check if WebLN is available
    if (typeof window !== 'undefined' && window.webln) {
      setIsAvailable(true);
      setIsEnabled(window.webln.isEnabled || false);
    }
  }, []);

  const enable = async (): Promise<boolean> => {
    if (!window.webln) {
      throw new Error('WebLN is not available');
    }

    try {
      await window.webln.enable();
      setIsEnabled(true);
      return true;
    } catch (error) {
      console.error('Failed to enable WebLN:', error);
      setIsEnabled(false);
      return false;
    }
  };

  const sendPayment = async (paymentRequest: string): Promise<{ preimage: string }> => {
    if (!window.webln) {
      throw new Error('WebLN is not available');
    }

    if (!isEnabled) {
      const enabled = await enable();
      if (!enabled) {
        throw new Error('WebLN could not be enabled');
      }
    }

    return await window.webln.sendPayment(paymentRequest);
  };

  return {
    isAvailable,
    isEnabled,
    enable,
    sendPayment,
  };
}
