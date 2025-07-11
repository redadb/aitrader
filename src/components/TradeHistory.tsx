import React from 'react';
import { History, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function TradeHistory() {
  const trades: Trade[] = [
    {
      id: '1',
      symbol: 'BTC',
      side: 'buy',
      amount: 0.1234,
      price: 44200,
      total: 5454.28,
      timestamp: '2024-01-15 14:30:25',
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'ETH',
      side: 'sell',
      amount: 2.5,
      price: 2485,
      total: 6212.50,
      timestamp: '2024-01-15 13:45:12',
      status: 'completed'
    },
    {
      id: '3',
      symbol: 'SOL',
      side: 'buy',
      amount: 10,
      price: 126.84,
      total: 1268.40,
      timestamp: '2024-01-15 12:20:08',
      status: 'pending'
    },
    {
      id: '4',
      symbol: 'ADA',
      side: 'buy',
      amount: 1000,
      price: 0.612,
      total: 612.00,
      timestamp: '2024-01-15 11:15:33',
      status: 'completed'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSideIcon = (side: string) => {
    return side === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-emerald-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <History className="h-5 w-5 mr-2 text-emerald-400" />
          Trade History
        </h3>
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getSideIcon(trade.side)}
                <span className="font-semibold text-white">{trade.symbol}</span>
                <span className={`text-sm uppercase ${
                  trade.side === 'buy' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {trade.side}
                </span>
              </div>
              <span className={`text-sm ${getStatusColor(trade.status)}`}>
                {trade.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-400">Amount</p>
                <p className="text-white font-mono">{trade.amount}</p>
              </div>
              <div>
                <p className="text-gray-400">Price</p>
                <p className="text-white font-mono">${trade.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Total</p>
                <p className="text-white font-mono">${trade.total.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {trade.timestamp}
              </div>
              <span>ID: {trade.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}