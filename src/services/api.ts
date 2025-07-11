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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((coin: any) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        change24h: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
      }));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Return mock data as fallback
      return this.getMockCryptoData();
    }
  }

  private getMockCryptoData(): CryptoPrice[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 44250.00,
        change24h: 1125.50,
        changePercent: 2.61,
        volume: 28500000000,
        marketCap: 865000000000,
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2485.75,
        change24h: -45.25,
        changePercent: -1.79,
        volume: 15200000000,
        marketCap: 298000000000,
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 126.84,
        change24h: 6.47,
        changePercent: 5.37,
        volume: 2800000000,
        marketCap: 57000000000,
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.612,
        change24h: 0.019,
        changePercent: 3.20,
        volume: 890000000,
        marketCap: 21500000000,
      },
    ];
  }

  async getCryptoPrice(coinId: string): Promise<CryptoPrice | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((candle: number[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: Math.random() * 1000000, // Mock volume data
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.getMockChartData();
    }
  }

  private getMockChartData(): ChartData[] {
    const data: ChartData[] = [];
    const now = Date.now();
    let price = 44000;
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const change = (Math.random() - 0.5) * 1000;
      price += change;
      
      const open = price;
      const high = price + Math.random() * 500;
      const low = price - Math.random() * 500;
      const close = low + Math.random() * (high - low);
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000,
      });
      
      price = close;
    }
    
    return data;
  }

  // WebSocket connection for real-time data
  getWebSocketConfig(symbols: string[]) {
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}usdt@ticker`).join('/');
    const url = `${this.wsUrl}/stream?streams=${streams}`;
    
    const parseMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.stream && data.data) {
          return data.data;
        }
        return null;
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        return null;
      }
    };
    
    return { url, parseMessage };
  }

  // Market data aggregation
  async getMarketOverview() {
    try {
      const response = await fetch(`${this.baseUrl}/global`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        activeCryptocurrencies: data.data.active_cryptocurrencies,
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return {
        totalMarketCap: 2100000000000,
        totalVolume: 89200000000,
        btcDominance: 42.3,
        activeCryptocurrencies: 13500,
      };
    }
  }

  // News API integration (mock data for now)
  async getCryptoNews(limit: number = 10) {
    return [
      {
        id: '1',
        title: 'Bitcoin ETF Approval Drives Market Rally',
        summary: 'SEC approves multiple Bitcoin ETFs, leading to significant price increases across major cryptocurrencies.',
        source: 'CoinDesk',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive' as const,
        impact: 'high' as const,
        url: '#'
      },
      {
        id: '2',
        title: 'Ethereum Network Upgrade Scheduled',
        summary: 'Major network upgrade expected to improve transaction speeds and reduce gas fees.',
        source: 'Ethereum Foundation',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive' as const,
        impact: 'medium' as const,
        url: '#'
      },
      {
        id: '3',
        title: 'Regulatory Concerns in Asian Markets',
        summary: 'New regulations proposed in several Asian countries may impact crypto trading volumes.',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sentiment: 'negative' as const,
        impact: 'medium' as const,
        url: '#'
      },
    ];
  }

  // Order book simulation
  generateOrderBook(symbol: string): OrderBookData {
    const basePrice = 44250; // Mock BTC price
    const bids: Array<[number, number]> = [];
    const asks: Array<[number, number]> = [];
    
    // Generate bids (buy orders) below current price
    for (let i = 0; i < 10; i++) {
      const price = basePrice - (i + 1) * 5;
      const amount = Math.random() * 2;
      bids.push([price, amount]);
    }
    
    // Generate asks (sell orders) above current price
    for (let i = 0; i < 10; i++) {
      const price = basePrice + (i + 1) * 5;
      const amount = Math.random() * 2;
      asks.push([price, amount]);
    }
    
    return { bids, asks };
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

  static generateSignals(prices: number[]): Array<{type: 'buy' | 'sell', strength: number, reason: string}> {
    const signals = [];
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    
    const currentRSI = rsi[rsi.length - 1];
    const currentMACD = macd.macd[macd.macd.length - 1];
    const currentSignal = macd.signal[macd.signal.length - 1];
    
    // RSI signals
    if (currentRSI < 30) {
      signals.push({
        type: 'buy' as const,
        strength: Math.min(95, 100 - currentRSI * 2),
        reason: 'RSI oversold condition'
      });
    } else if (currentRSI > 70) {
      signals.push({
        type: 'sell' as const,
        strength: Math.min(95, (currentRSI - 50) * 2),
        reason: 'RSI overbought condition'
      });
    }
    
    // MACD signals
    if (currentMACD > currentSignal && macd.macd[macd.macd.length - 2] <= macd.signal[macd.signal.length - 2]) {
      signals.push({
        type: 'buy' as const,
        strength: 75,
        reason: 'MACD bullish crossover'
      });
    } else if (currentMACD < currentSignal && macd.macd[macd.macd.length - 2] >= macd.signal[macd.signal.length - 2]) {
      signals.push({
        type: 'sell' as const,
        strength: 75,
        reason: 'MACD bearish crossover'
      });
    }
    
    return signals;
  }
}

// Trading utilities
export class TradingEngine {
  private static instance: TradingEngine;
  private positions: Map<string, any> = new Map();
  private orders: Array<any> = [];
  private balance = 50000; // Mock starting balance

  static getInstance(): TradingEngine {
    if (!TradingEngine.instance) {
      TradingEngine.instance = new TradingEngine();
    }
    return TradingEngine.instance;
  }

  getBalance(): number {
    return this.balance;
  }

  getPositions(): Array<any> {
    return Array.from(this.positions.values());
  }

  getOrders(): Array<any> {
    return this.orders;
  }

  placeOrder(order: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    amount: number;
    price?: number;
  }): { success: boolean; orderId?: string; error?: string } {
    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newOrder = {
        id: orderId,
        ...order,
        status: 'pending',
        timestamp: new Date().toISOString(),
        filled: 0,
      };

      this.orders.unshift(newOrder);

      // Simulate order execution for market orders
      if (order.type === 'market') {
        setTimeout(() => {
          this.executeOrder(orderId);
        }, Math.random() * 2000 + 500);
      }

      return { success: true, orderId };
    } catch (error) {
      return { success: false, error: 'Failed to place order' };
    }
  }

  private executeOrder(orderId: string): void {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;

    const order = this.orders[orderIndex];
    const executionPrice = order.price || 44250; // Mock execution price
    const total = order.amount * executionPrice;

    if (order.side === 'buy') {
      if (this.balance >= total) {
        this.balance -= total;
        order.status = 'filled';
        order.filled = order.amount;
        order.executionPrice = executionPrice;

        // Add to positions
        const existingPosition = this.positions.get(order.symbol);
        if (existingPosition) {
          existingPosition.amount += order.amount;
          existingPosition.averagePrice = 
            (existingPosition.averagePrice * existingPosition.amount + total) / 
            (existingPosition.amount + order.amount);
        } else {
          this.positions.set(order.symbol, {
            symbol: order.symbol,
            amount: order.amount,
            averagePrice: executionPrice,
            unrealizedPnL: 0,
          });
        }
      } else {
        order.status = 'rejected';
        order.error = 'Insufficient balance';
      }
    } else {
      // Sell logic
      const position = this.positions.get(order.symbol);
      if (position && position.amount >= order.amount) {
        this.balance += total;
        position.amount -= order.amount;
        order.status = 'filled';
        order.filled = order.amount;
        order.executionPrice = executionPrice;

        if (position.amount === 0) {
          this.positions.delete(order.symbol);
        }
      } else {
        order.status = 'rejected';
        order.error = 'Insufficient position';
      }
    }

    this.orders[orderIndex] = order;
  }

  cancelOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return false;

    const order = this.orders[orderIndex];
    if (order.status === 'pending') {
      order.status = 'cancelled';
      this.orders[orderIndex] = order;
      return true;
    }
    return false;
  }
}