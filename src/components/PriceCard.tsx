import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume?: number;
}

export default function PriceCard({ symbol, name, price, change24h, changePercent, volume }: PriceCardProps) {
  const isPositive = change24h >= 0;
  const formatPrice = (price: number) => {
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
        <div className={`p-2 rounded-full ${isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{formatPrice(price)}</p>
        <div className="flex items-center justify-between">
          <p className={`text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)} ({changePercent.toFixed(2)}%)
          </p>
          {volume && (
            <p className="text-sm text-gray-400">Vol: {formatVolume(volume)}</p>
          )}
        </div>
      </div>
    </div>
  );
}