import { useState, useEffect } from 'react';
import { cryptoAPI, CryptoPrice } from '../services/api';

export function useCryptoData(symbols: string[] = ['BTC', 'ETH', 'SOL', 'ADA']) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      ws = cryptoAPI.connectWebSocket(symbols, (data) => {
        // Update real-time price data
        if (data.s && data.c) {
          const symbol = data.s.replace('USDT', '');
          setPrices(prev => prev.map(price => 
            price.symbol === symbol 
              ? { ...price, price: parseFloat(data.c) }
              : price
          ));
        }
      });

      if (ws) {
        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setError('WebSocket connection failed');
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('WebSocket disconnected');
        };
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      setIsConnected(false);
    };
  }, [symbols]);

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