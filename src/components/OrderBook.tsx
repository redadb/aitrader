import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';
import { cryptoAPI, OrderBookData } from '../services/api';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export default function OrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const updateOrderBook = () => {
      setLoading(true);
      const newOrderBook = cryptoAPI.generateOrderBook('BTC');
      
      // Convert to the format we need
      const bids: OrderBookEntry[] = newOrderBook.bids.map(([price, amount]) => ({
        price,
        amount,
        total: price * amount
      }));
      
      const asks: OrderBookEntry[] = newOrderBook.asks.map(([price, amount]) => ({
        price,
        amount,
        total: price * amount
      }));

      setOrderBook({ bids, asks });
      setLastUpdate(new Date());
      setLoading(false);
    };

    updateOrderBook();
    
    // Update every 2 seconds to simulate real-time data
    const interval = setInterval(updateOrderBook, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatAmount = (amount: number) => amount.toFixed(4);
  const formatTotal = (total: number) => total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const bids = orderBook.bids.map(([price, amount]) => ({
    price,
    amount,
    total: price * amount
  }));

  const asks = orderBook.asks.map(([price, amount]) => ({
    price,
    amount,
    total: price * amount
  }));

  const spread = asks.length > 0 && bids.length > 0 ? asks[0].price - bids[0].price : 0;
  const spreadPercent = bids.length > 0 ? (spread / bids[0].price) * 100 : 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
          Order Book
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Spread:</span>
            <span className="text-white font-semibold">${formatPrice(spread)}</span>
            <span className="text-gray-400">({spreadPercent.toFixed(3)}%)</span>
          </div>
          {loading && <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2 px-2">
        <span>Price (USD)</span>
        <span className="text-right">Amount (BTC)</span>
        <span className="text-right">Total (USD)</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
        {asks.slice().reverse().map((ask, index) => {
          const maxTotal = Math.max(...asks.map(a => a.total));
          const fillPercent = (ask.total / maxTotal) * 100;
          
          return (
            <div 
              key={index} 
              className="relative grid grid-cols-3 gap-2 text-sm py-1 px-2 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-red-500/5 rounded"
                style={{ width: `${fillPercent}%` }}
              />
              <span className="text-red-400 font-mono relative z-10">{formatPrice(ask.price)}</span>
              <span className="text-white text-right font-mono relative z-10">{formatAmount(ask.amount)}</span>
              <span className="text-gray-300 text-right font-mono relative z-10">{formatTotal(ask.total)}</span>
            </div>
          );
        })}
      </div>

      {/* Current Price */}
      <div className="bg-gray-900 rounded-lg p-3 mb-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-2xl font-bold text-emerald-400">
            ${bids.length > 0 ? formatPrice((bids[0].price + asks[0].price) / 2) : '44,250.00'}
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 mt-1">
          <span>Last Price</span>
          <span>•</span>
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {bids.map((bid, index) => {
          const maxTotal = Math.max(...bids.map(b => b.total));
          const fillPercent = (bid.total / maxTotal) * 100;
          
          return (
            <div 
              key={index} 
              className="relative grid grid-cols-3 gap-2 text-sm py-1 px-2 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-emerald-500/5 rounded"
                style={{ width: `${fillPercent}%` }}
              />
              <span className="text-emerald-400 font-mono relative z-10">{formatPrice(bid.price)}</span>
              <span className="text-white text-right font-mono relative z-10">{formatAmount(bid.amount)}</span>
              <span className="text-gray-300 text-right font-mono relative z-10">{formatTotal(bid.total)}</span>
            </div>
          );
        })}
      </div>

      {/* Order Book Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="bg-gray-900 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400">Total Bids</span>
            <TrendingUp className="h-3 w-3 text-emerald-400" />
          </div>
          <div className="text-emerald-400 font-semibold">
            {formatAmount(bids.reduce((sum, bid) => sum + bid.amount, 0))} BTC
          </div>
          <div className="text-gray-400">
            ${formatTotal(bids.reduce((sum, bid) => sum + bid.total, 0))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400">Total Asks</span>
            <TrendingDown className="h-3 w-3 text-red-400" />
          </div>
          <div className="text-red-400 font-semibold">
            {formatAmount(asks.reduce((sum, ask) => sum + ask.amount, 0))} BTC
          </div>
          <div className="text-gray-400">
            ${formatTotal(asks.reduce((sum, ask) => sum + ask.total, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}