import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface Signal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'warning';
  strength: number;
  description: string;
  timestamp: string;
}

export default function SignalAlerts() {
  const signals: Signal[] = [
    {
      id: '1',
      symbol: 'BTC',
      type: 'buy',
      strength: 85,
      description: 'Strong bullish divergence detected',
      timestamp: '2m ago'
    },
    {
      id: '2',
      symbol: 'ETH',
      type: 'sell',
      strength: 72,
      description: 'RSI overbought, potential reversal',
      timestamp: '5m ago'
    },
    {
      id: '3',
      symbol: 'ADA',
      type: 'warning',
      strength: 60,
      description: 'Support level approaching',
      timestamp: '8m ago'
    },
  ];

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'border-emerald-500 bg-emerald-500/10';
      case 'sell':
        return 'border-red-500 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-emerald-400" />
          Signal Alerts
        </h3>
        <span className="text-sm text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
          {signals.length} Active
        </span>
      </div>
      
      <div className="space-y-3">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className={`p-3 rounded-lg border ${getSignalColor(signal.type)} transition-colors hover:bg-opacity-20`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getSignalIcon(signal.type)}
                <span className="font-semibold text-white">{signal.symbol}</span>
                <span className="text-sm text-gray-400 uppercase">{signal.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{signal.strength}%</span>
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-400">{signal.timestamp}</span>
              </div>
            </div>
            <p className="text-sm text-gray-300">{signal.description}</p>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  signal.type === 'buy' ? 'bg-emerald-500' : 
                  signal.type === 'sell' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${signal.strength}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        View All Signals
      </button>
    </div>
  );
}