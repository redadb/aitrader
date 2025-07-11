import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function MarketOverview() {
  const marketStats = [
    { label: 'Total Market Cap', value: '$2.1T', change: '+2.5%', positive: true },
    { label: '24h Volume', value: '$89.2B', change: '-1.2%', positive: false },
    { label: 'BTC Dominance', value: '42.3%', change: '+0.8%', positive: true },
    { label: 'Fear & Greed', value: '72', change: 'Greed', positive: true },
  ];

  const topGainers = [
    { symbol: 'SOL', change: '+12.4%' },
    { symbol: 'AVAX', change: '+8.7%' },
    { symbol: 'MATIC', change: '+6.2%' },
  ];

  const topLosers = [
    { symbol: 'DOGE', change: '-5.3%' },
    { symbol: 'SHIB', change: '-4.1%' },
    { symbol: 'AXS', change: '-3.8%' },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-400" />
          Market Overview
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {marketStats.map((stat, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className="text-lg font-semibold text-white">{stat.value}</p>
            <p className={`text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
            <span className="text-sm font-semibold text-white">Top Gainers</span>
          </div>
          <div className="space-y-1">
            {topGainers.map((coin, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{coin.symbol}</span>
                <span className="text-sm text-emerald-400">{coin.change}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            <span className="text-sm font-semibold text-white">Top Losers</span>
          </div>
          <div className="space-y-1">
            {topLosers.map((coin, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{coin.symbol}</span>
                <span className="text-sm text-red-400">{coin.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}