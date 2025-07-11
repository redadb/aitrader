import React, { useState, useCallback } from 'react';
import { Play, Download, Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface BacktestResult {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
}

interface BacktestConfig {
  strategy: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
}

export default function BacktestingEngine() {
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: '',
    symbol: 'BTC/USD',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 10000,
    commission: 0.1,
  });

  const [results, setResults] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runBacktest = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);

    // Simulate backtest progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          
          // Mock results
          setResults({
            totalReturn: 45.6,
            sharpeRatio: 1.8,
            maxDrawdown: -12.3,
            winRate: 68.5,
            totalTrades: 127,
            avgWin: 3.2,
            avgLoss: -1.8,
            profitFactor: 2.1,
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [config]);

  const exportResults = useCallback(() => {
    if (!results) return;
    
    const data = {
      config,
      results,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_results_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config, results]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Backtesting Engine</h2>
        <div className="flex items-center space-x-2">
          {results && (
            <button
              onClick={exportResults}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}
          <button
            onClick={runBacktest}
            disabled={isRunning}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>{isRunning ? 'Running...' : 'Run Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Strategy</label>
          <select
            value={config.strategy}
            onChange={(e) => setConfig(prev => ({ ...prev, strategy: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select Strategy</option>
            <option value="rsi_mean_reversion">RSI Mean Reversion</option>
            <option value="macd_momentum">MACD Momentum</option>
            <option value="bollinger_breakout">Bollinger Breakout</option>
            <option value="custom_strategy_1">Custom Strategy 1</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Symbol</label>
          <select
            value={config.symbol}
            onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="BTC/USD">BTC/USD</option>
            <option value="ETH/USD">ETH/USD</option>
            <option value="SOL/USD">SOL/USD</option>
            <option value="ADA/USD">ADA/USD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Initial Capital ($)</label>
          <input
            type="number"
            value={config.initialCapital}
            onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="1000"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Start Date</label>
          <input
            type="date"
            value={config.startDate}
            onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">End Date</label>
          <input
            type="date"
            value={config.endDate}
            onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Commission (%)</label>
          <input
            type="number"
            value={config.commission}
            onChange={(e) => setConfig(prev => ({ ...prev, commission: Number(e.target.value) }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Running Backtest...</span>
            <span className="text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Return</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">
                {results.totalReturn > 0 ? '+' : ''}{results.totalReturn}%
              </span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Sharpe Ratio</span>
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{results.sharpeRatio}</span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Max Drawdown</span>
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">{results.maxDrawdown}%</span>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Win Rate</span>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-white">{results.winRate}%</span>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Total Trades</span>
                <p className="text-white font-semibold">{results.totalTrades}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Average Win</span>
                <p className="text-emerald-400 font-semibold">+{results.avgWin}%</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Average Loss</span>
                <p className="text-red-400 font-semibold">{results.avgLoss}%</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Profit Factor</span>
                <p className="text-white font-semibold">{results.profitFactor}</p>
              </div>
            </div>
          </div>

          {/* Equity Curve Placeholder */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Equity Curve</h3>
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">Equity Curve Chart</p>
                <p className="text-sm text-gray-500">Chart integration ready</p>
              </div>
            </div>
          </div>

          {/* Trade Analysis */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Trade Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Winning Trades</span>
                <span className="text-emerald-400 font-semibold">
                  {Math.round(results.totalTrades * results.winRate / 100)} ({results.winRate}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Losing Trades</span>
                <span className="text-red-400 font-semibold">
                  {results.totalTrades - Math.round(results.totalTrades * results.winRate / 100)} ({(100 - results.winRate).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best Trade</span>
                <span className="text-emerald-400 font-semibold">+8.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Worst Trade</span>
                <span className="text-red-400 font-semibold">-4.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}