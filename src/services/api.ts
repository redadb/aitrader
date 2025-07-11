// API service for handling external data sources
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookData {
  bids: Array<[number, number]>; // [price, amount]
  asks: Array<[number, number]>; // [price, amount]
}

class CryptoAPI {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private wsUrl = 'wss://stream.binance.com:9443';
  
  // CoinGecko API methods
  async getTopCryptos(limit: number = 10): Promise<CryptoPrice[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      const data = await response.json();
      
      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        volume: coin.total_volume,
        marketCap: coin.market_cap,
      }));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return [];
    }
  }

  async getCryptoPrice(coinId: string): Promise<CryptoPrice | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      const data = await response.json();
      
      return {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        price: data.market_data.current_price.usd,
        change24h: data.market_data.price_change_24h,
        changePercent: data.market_data.price_change_percentage_24h,
        volume: data.market_data.total_volume.usd,
        marketCap: data.market_data.market_cap.usd,
      };
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      return null;
    }
  }

  async getHistoricalData(coinId: string, days: number = 30): Promise<ChartData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      
      return data.map((candle: number[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0, // CoinGecko OHLC doesn't include volume
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }

  // WebSocket connection for real-time data
  connectWebSocket(symbols: string[], onMessage: (data: any) => void): WebSocket | null {
    try {
      const streams = symbols.map(symbol => `${symbol.toLowerCase()}usdt@ticker`).join('/');
      const ws = new WebSocket(`${this.wsUrl}/stream?streams=${streams}`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
      
      return ws;
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      return null;
    }
  }

  // Market data aggregation
  async getMarketOverview() {
    try {
      const response = await fetch(`${this.baseUrl}/global`);
      const data = await response.json();
      
      return {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        activeCryptocurrencies: data.data.active_cryptocurrencies,
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return null;
    }
  }

  // News API integration (placeholder for future implementation)
  async getCryptoNews(limit: number = 10) {
    // This would integrate with news APIs like NewsAPI, CryptoPanic, etc.
    // For now, returning mock data
    return [
      {
        title: 'Bitcoin ETF Approval Drives Market Rally',
        summary: 'SEC approves multiple Bitcoin ETFs, leading to significant price increases.',
        source: 'CoinDesk',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive',
        impact: 'high',
      },
    ];
  }
}

export const cryptoAPI = new CryptoAPI();

// Technical Analysis utilities
export class TechnicalAnalysis {
  static calculateSMA(prices: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  static calculateEMA(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(firstSMA);
    
    for (let i = period; i < prices.length; i++) {
      const currentEMA = (prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(currentEMA);
    }
    
    return ema;
  }

  static calculateRSI(prices: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  static calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    
    const macdLine: number[] = [];
    const startIndex = slowPeriod - fastPeriod;
    
    for (let i = 0; i < fastEMA.length - startIndex; i++) {
      macdLine.push(fastEMA[i + startIndex] - slowEMA[i]);
    }
    
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    const histogram: number[] = [];
    
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[i + signalPeriod - 1] - signalLine[i]);
    }
    
    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram,
    };
  }
}