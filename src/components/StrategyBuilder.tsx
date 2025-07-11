import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Copy, Play, Save, TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface EntryCondition {
  id: string;
  signal: string;
  strength: number;
  timeframe: string;
}

interface ExitCondition {
  id: string;
  type: 'take_profit' | 'stop_loss' | 'signal';
  value: number;
  signal?: string;
}

interface RiskManagement {
  maxPositionSize: number;
  maxDrawdown: number;
  riskPerTrade: number;
  maxConcurrentTrades: number;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  entryConditions: EntryCondition[];
  exitConditions: ExitCondition[];
  riskManagement: RiskManagement;
  isActive: boolean;
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
const MOCK_SIGNALS = [
  'RSI Oversold',
  'MACD Bullish Cross',
  'SMA Golden Cross',
  'Bollinger Squeeze',
  'Volume Breakout',
];

export default function StrategyBuilder() {
  const [strategy, setStrategy] = useState<Strategy>({
    id: '',
    name: '',
    description: '',
    entryConditions: [],
    exitConditions: [],
    riskManagement: {
      maxPositionSize: 10,
      maxDrawdown: 20,
      riskPerTrade: 2,
      maxConcurrentTrades: 3,
    },
    isActive: false,
  });

  const [activeTab, setActiveTab] = useState<'entry' | 'exit' | 'risk'>('entry');

  const addEntryCondition = useCallback(() => {
    const newCondition: EntryCondition = {
      id: `entry_${Date.now()}`,
      signal: MOCK_SIGNALS[0],
      strength: 70,
      timeframe: '1h',
    };

    setStrategy(prev => ({
      ...prev,
      entryConditions: [...prev.entryConditions, newCondition],
    }));
  }, []);

  const updateEntryCondition = useCallback((id: string, field: string, value: string | number) => {
    setStrategy(prev => ({
      ...prev,
      entryConditions: prev.entryConditions.map(cond =>
        cond.id === id ? { ...cond, [field]: value } : cond
      ),
    }));
  }, []);

  const removeEntryCondition = useCallback((id: string) => {
    setStrategy(prev => ({
      ...prev,
      entryConditions: prev.entryConditions.filter(cond => cond.id !== id),
    }));
  }, []);

  const addExitCondition = useCallback((type: 'take_profit' | 'stop_loss' | 'signal') => {
    const newCondition: ExitCondition = {
      id: `exit_${Date.now()}`,
      type,
      value: type === 'take_profit' ? 5 : type === 'stop_loss' ? -2 : 50,
      signal: type === 'signal' ? MOCK_SIGNALS[0] : undefined,
    };

    setStrategy(prev => ({
      ...prev,
      exitConditions: [...prev.exitConditions, newCondition],
    }));
  }, []);

  const updateExitCondition = useCallback((id: string, field: string, value: string | number) => {
    setStrategy(prev => ({
      ...prev,
      exitConditions: prev.exitConditions.map(cond =>
        cond.id === id ? { ...cond, [field]: value } : cond
      ),
    }));
  }, []);

  const removeExitCondition = useCallback((id: string) => {
    setStrategy(prev => ({
      ...prev,
      exitConditions: prev.exitConditions.filter(cond => cond.id !== id),
    }));
  }, []);

  const updateRiskManagement = useCallback((field: string, value: number) => {
    setStrategy(prev => ({
      ...prev,
      riskManagement: { ...prev.riskManagement, [field]: value },
    }));
  }, []);

  const testStrategy = useCallback(() => {
    console.log('Testing strategy:', strategy);
    // Implement strategy testing logic
  }, [strategy]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Strategy Builder</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={testStrategy}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Test Strategy</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Strategy Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Strategy Name</label>
          <input
            type="text"
            value={strategy.name}
            onChange={(e) => setStrategy(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter strategy name"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={strategy.isActive}
              onChange={(e) => setStrategy(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
            />
            <span className="text-white">Active Strategy</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Description</label>
        <textarea
          value={strategy.description}
          onChange={(e) => setStrategy(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          rows={3}
          placeholder="Describe your trading strategy"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'entry', label: 'Entry Conditions', icon: TrendingUp },
          { key: 'exit', label: 'Exit Conditions', icon: TrendingDown },
          { key: 'risk', label: 'Risk Management', icon: Shield },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'entry' | 'exit' | 'risk')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === key
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Entry Conditions Tab */}
      {activeTab === 'entry' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Entry Conditions</h3>
            <button
              onClick={addEntryCondition}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Condition</span>
            </button>
          </div>

          <div className="space-y-3">
            {strategy.entryConditions.map((condition) => (
              <div key={condition.id} className="bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Signal</label>
                    <select
                      value={condition.signal}
                      onChange={(e) => updateEntryCondition(condition.id, 'signal', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                    >
                      {MOCK_SIGNALS.map((signal) => (
                        <option key={signal} value={signal}>{signal}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Min Strength (%)</label>
                    <input
                      type="number"
                      value={condition.strength}
                      onChange={(e) => updateEntryCondition(condition.id, 'strength', Number(e.target.value))}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Timeframe</label>
                    <select
                      value={condition.timeframe}
                      onChange={(e) => updateEntryCondition(condition.id, 'timeframe', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                    >
                      {TIMEFRAMES.map((tf) => (
                        <option key={tf} value={tf}>{tf}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <Trash2
                      onClick={() => removeEntryCondition(condition.id)}
                      className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exit Conditions Tab */}
      {activeTab === 'exit' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Exit Conditions</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => addExitCondition('take_profit')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Take Profit
              </button>
              <button
                onClick={() => addExitCondition('stop_loss')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Stop Loss
              </button>
              <button
                onClick={() => addExitCondition('signal')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Signal Exit
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {strategy.exitConditions.map((condition) => (
              <div key={condition.id} className="bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      condition.type === 'take_profit' ? 'bg-emerald-500/20 text-emerald-400' :
                      condition.type === 'stop_loss' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {condition.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {condition.type === 'signal' ? (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Exit Signal</label>
                      <select
                        value={condition.signal || ''}
                        onChange={(e) => updateExitCondition(condition.id, 'signal', e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                      >
                        {MOCK_SIGNALS.map((signal) => (
                          <option key={signal} value={signal}>{signal}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        {condition.type === 'take_profit' ? 'Profit %' : 'Loss %'}
                      </label>
                      <input
                        type="number"
                        value={condition.value}
                        onChange={(e) => updateExitCondition(condition.id, 'value', Number(e.target.value))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                        step="0.1"
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Trash2
                      onClick={() => removeExitCondition(condition.id)}
                      className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Management Tab */}
      {activeTab === 'risk' && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Risk Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Position Size (%)</label>
                <input
                  type="number"
                  value={strategy.riskManagement.maxPositionSize}
                  onChange={(e) => updateRiskManagement('maxPositionSize', Number(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Risk Per Trade (%)</label>
                <input
                  type="number"
                  value={strategy.riskManagement.riskPerTrade}
                  onChange={(e) => updateRiskManagement('riskPerTrade', Number(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Drawdown (%)</label>
                <input
                  type="number"
                  value={strategy.riskManagement.maxDrawdown}
                  onChange={(e) => updateRiskManagement('maxDrawdown', Number(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  min="5"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Concurrent Trades</label>
                <input
                  type="number"
                  value={strategy.riskManagement.maxConcurrentTrades}
                  onChange={(e) => updateRiskManagement('maxConcurrentTrades', Number(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Risk Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Max Position:</span>
                <span className="text-white ml-2">{strategy.riskManagement.maxPositionSize}%</span>
              </div>
              <div>
                <span className="text-gray-400">Risk/Trade:</span>
                <span className="text-white ml-2">{strategy.riskManagement.riskPerTrade}%</span>
              </div>
              <div>
                <span className="text-gray-400">Max Drawdown:</span>
                <span className="text-white ml-2">{strategy.riskManagement.maxDrawdown}%</span>
              </div>
              <div>
                <span className="text-gray-400">Max Trades:</span>
                <span className="text-white ml-2">{strategy.riskManagement.maxConcurrentTrades}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}