import { useState, useEffect } from 'react';
import { cryptoAPI, CryptoPrice } from '../services/api';
import { useWebSocket } from './useWebSocket';

export function useCryptoData(symbols: string[] = ['BTC', 'ETH', 'SOL', 'ADA']) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get WebSocket configuration
  const wsConfig = cryptoAPI.getWebSocketConfig(symbols);
  
  // Use the robust WebSocket hook
  const { isConnected, error: wsError } = useWebSocket(
    wsConfig.url,
    (data) => {
      const parsedData = wsConfig.parseMessage({ data } as MessageEvent);
      if (parsedData && parsedData.s && parsedData.c) {
        const symbol = parsedData.s.replace('USDT', '');
        setPrices(prev => prev.map(price => 
          price.symbol === symbol 
            ? { ...price, price: parseFloat(parsedData.c) }
            : price
        ));
      }
    },
    {
      reconnectAttempts: 5,
      reconnectInterval: 3000,
    }
  );
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const data = await cryptoAPI.getTopCryptos(10);
        setPrices(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch crypto data');
        console.error('Error fetching crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Update error state from WebSocket
  useEffect(() => {
    if (wsError) {
      setError(`WebSocket error: ${wsError}`);
    } else if (isConnected && error?.includes('WebSocket')) {
      setError(null);
    }
  }, [wsError, isConnected, error]);

  // Periodic data refresh (fallback for WebSocket)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isConnected) {
        try {
          const data = await cryptoAPI.getTopCryptos(10);
          setPrices(data);
        } catch (err) {
          console.error('Error refreshing crypto data:', err);
        }
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    prices,
    loading,
    error,
    isConnected,
  };
}