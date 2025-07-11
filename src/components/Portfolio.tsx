import React from 'react';
import { Wallet, TrendingUp, PieChart } from 'lucide-react';

interface PortfolioHolding {
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
  percentage: number;
}

export default function Portfolio() {
  const holdings: PortfolioHolding[] = [
    { symbol: 'BTC', amount: 0.5, value: 22000, change24h: 2.5, percentage: 45 },
    { symbol: 'ETH', amount: 5.2, value: 12500, change24h: -1.8, percentage: 25 },
    { symbol: 'ADA', amount: 1000, value: 8000, change24h: 3.2, percentage: 16 },
    { symbol: 'SOL', amount: 25, value: 6800, change24h: 5.1, percentage: 14 },
  ];

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalChange = holdings.reduce((sum, holding) => sum + (holding.value * holding.change24h / 100), 0);
  const totalChangePercent = (totalChange / totalValue) * 100;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Wallet className="h-5 w-5 mr-2 text-emerald-400" />
          Portfolio
        </h3>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Total Value</span>
          <TrendingUp className={`h-4 w-4 ${totalChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
        <p className={`text-sm ${totalChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {totalChangePercent >= 0 ? '+' : ''}${totalChange.toFixed(2)} ({totalChangePercent.toFixed(2)}%)
        </p>
      </div>
      
      <div className="space-y-3">
        {holdings.map((holding) => (
          <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{holding.symbol[0]}</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-white">{holding.symbol}</p>
                <p className="text-sm text-gray-400">{holding.amount} tokens</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-white">${holding.value.toLocaleString()}</p>
              <p className={`text-sm ${holding.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}