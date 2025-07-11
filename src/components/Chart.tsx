import React, { useState } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface ChartProps {
  symbol: string;
  data?: any[];
}

export default function Chart({ symbol }: ChartProps) {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-emerald-400" />
          {symbol} Chart
        </h3>
        
        <div className="flex items-center space-x-2">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-1 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="candlestick">Candlestick</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              timeframe === tf
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
      
      <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
        <div className="text-center">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400">Chart Component</p>
          <p className="text-sm text-gray-500">TradingView integration ready</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Volume</p>
          <p className="text-white font-semibold">$2.4B</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">24h High</p>
          <p className="text-white font-semibold">$45,234</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">24h Low</p>
          <p className="text-white font-semibold">$43,567</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">$850B</p>
        </div>
      </div>
    </div>
  );
}