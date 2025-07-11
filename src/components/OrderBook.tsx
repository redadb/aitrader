import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export default function OrderBook() {
  const bids: OrderBookEntry[] = [
    { price: 44245, amount: 0.5234, total: 23156.23 },
    { price: 44240, amount: 1.2456, total: 55089.34 },
    { price: 44235, amount: 0.8901, total: 39378.45 },
    { price: 44230, amount: 2.1234, total: 93912.56 },
    { price: 44225, amount: 0.6789, total: 30023.67 },
  ];

  const asks: OrderBookEntry[] = [
    { price: 44255, amount: 0.4567, total: 20201.89 },
    { price: 44260, amount: 1.1234, total: 49723.45 },
    { price: 44265, amount: 0.7890, total: 34925.12 },
    { price: 44270, amount: 1.8901, total: 83678.90 },
    { price: 44275, amount: 0.5678, total: 25134.56 },
  ];

  const formatPrice = (price: number) => price.toLocaleString();
  const formatAmount = (amount: number) => amount.toFixed(4);
  const formatTotal = (total: number) => total.toLocaleString();

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
          Order Book
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Spread:</span>
          <span className="text-white font-semibold">$10.00</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2 px-2">
        <span>Price (USD)</span>
        <span className="text-right">Amount (BTC)</span>
        <span className="text-right">Total (USD)</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="space-y-1 mb-3">
        {asks.reverse().map((ask, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1 px-2 hover:bg-red-500/10 rounded transition-colors">
            <span className="text-red-400 font-mono">{formatPrice(ask.price)}</span>
            <span className="text-white text-right font-mono">{formatAmount(ask.amount)}</span>
            <span className="text-gray-300 text-right font-mono">{formatTotal(ask.total)}</span>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="bg-gray-900 rounded-lg p-3 mb-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-2xl font-bold text-emerald-400">$44,250.00</span>
        </div>
        <span className="text-sm text-gray-400">Last Price</span>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="space-y-1">
        {bids.map((bid, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1 px-2 hover:bg-emerald-500/10 rounded transition-colors">
            <span className="text-emerald-400 font-mono">{formatPrice(bid.price)}</span>
            <span className="text-white text-right font-mono">{formatAmount(bid.amount)}</span>
            <span className="text-gray-300 text-right font-mono">{formatTotal(bid.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}