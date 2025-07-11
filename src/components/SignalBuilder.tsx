import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Settings, Play, Save, Download } from 'lucide-react';

interface Indicator {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, number>;
  color: string;
}

interface Condition {
  id: string;
  indicator1: string;
  operator: string;
  indicator2: string;
  value?: number;
}

interface Signal {
  id: string;
  name: string;
  description: string;
  indicators: Indicator[];
  conditions: Condition[];
  signalType: 'buy' | 'sell' | 'neutral';
  strength: number;
}

const INDICATOR_TYPES = [
  { value: 'sma', label: 'Simple Moving Average', params: { period: 20 } },
  { value: 'ema', label: 'Exponential Moving Average', params: { period: 20 } },
  { value: 'rsi', label: 'RSI', params: { period: 14 } },
  { value: 'macd', label: 'MACD', params: { fast: 12, slow: 26, signal: 9 } },
  { value: 'bb', label: 'Bollinger Bands', params: { period: 20, deviation: 2 } },
  { value: 'stoch', label: 'Stochastic', params: { k: 14, d: 3 } },
  { value: 'williams', label: 'Williams %R', params: { period: 14 } },
  { value: 'obv', label: 'On Balance Volume', params: {} },
  { value: 'vwap', label: 'VWAP', params: {} },
];

const OPERATORS = [
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'eq', label: '=' },
  { value: 'cross_above', label: 'Crosses Above' },
  { value: 'cross_below', label: 'Crosses Below' },
];

export default function SignalBuilder() {
  const [signal, setSignal] = useState<Signal>({
    id: '',
    name: '',
    description: '',
    indicators: [],
    conditions: [],
    signalType: 'buy',
    strength: 0,
  });

  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [selectedIndicatorType, setSelectedIndicatorType] = useState('');

  const addIndicator = useCallback((type: string) => {
    const indicatorType = INDICATOR_TYPES.find(t => t.value === type);
    if (!indicatorType) return;

    const newIndicator: Indicator = {
      id: `indicator_${Date.now()}`,
      type,
      name: indicatorType.label,
      parameters: { ...indicatorType.params },
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };

    setSignal(prev => ({
      ...prev,
      indicators: [...prev.indicators, newIndicator],
    }));
    setShowIndicatorModal(false);
  }, []);

  const removeIndicator = useCallback((id: string) => {
    setSignal(prev => ({
      ...prev,
      indicators: prev.indicators.filter(ind => ind.id !== id),
      conditions: prev.conditions.filter(cond => 
        cond.indicator1 !== id && cond.indicator2 !== id
      ),
    }));
  }, []);

  const addCondition = useCallback(() => {
    if (signal.indicators.length < 2) return;

    const newCondition: Condition = {
      id: `condition_${Date.now()}`,
      indicator1: signal.indicators[0].id,
      operator: 'gt',
      indicator2: signal.indicators[1]?.id || '',
    };

    setSignal(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
  }, [signal.indicators]);

  const updateCondition = useCallback((id: string, field: string, value: string | number) => {
    setSignal(prev => ({
      ...prev,
      conditions: prev.conditions.map(cond =>
        cond.id === id ? { ...cond, [field]: value } : cond
      ),
    }));
  }, []);

  const removeCondition = useCallback((id: string) => {
    setSignal(prev => ({
      ...prev,
      conditions: prev.conditions.filter(cond => cond.id !== id),
    }));
  }, []);

  const testSignal = useCallback(() => {
    // Simulate signal testing
    const strength = Math.floor(Math.random() * 100);
    setSignal(prev => ({ ...prev, strength }));
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Signal Builder</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={testSignal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Test Signal</span>
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Signal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Signal Name</label>
          <input
            type="text"
            value={signal.name}
            onChange={(e) => setSignal(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter signal name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Signal Type</label>
          <select
            value={signal.signalType}
            onChange={(e) => setSignal(prev => ({ ...prev, signalType: e.target.value as 'buy' | 'sell' | 'neutral' }))}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="buy">Buy Signal</option>
            <option value="sell">Sell Signal</option>
            <option value="neutral">Neutral Signal</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Description</label>
        <textarea
          value={signal.description}
          onChange={(e) => setSignal(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          rows={3}
          placeholder="Describe your signal logic"
        />
      </div>

      {/* Indicators Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Technical Indicators</h3>
          <button
            onClick={() => setShowIndicatorModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Indicator</span>
          </button>
        </div>

        <div className="space-y-3">
          {signal.indicators.map((indicator) => (
            <div key={indicator.id} className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: indicator.color }}
                  />
                  <span className="text-white font-semibold">{indicator.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
                  <Trash2
                    onClick={() => removeIndicator(indicator.id)}
                    className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(indicator.parameters).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">{key}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newParams = { ...indicator.parameters, [key]: Number(e.target.value) };
                        setSignal(prev => ({
                          ...prev,
                          indicators: prev.indicators.map(ind =>
                            ind.id === indicator.id ? { ...ind, parameters: newParams } : ind
                          ),
                        }));
                      }}
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Signal Conditions</h3>
          <button
            onClick={addCondition}
            disabled={signal.indicators.length < 2}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Condition</span>
          </button>
        </div>

        <div className="space-y-3">
          {signal.conditions.map((condition) => (
            <div key={condition.id} className="bg-gray-900 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                <select
                  value={condition.indicator1}
                  onChange={(e) => updateCondition(condition.id, 'indicator1', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                >
                  {signal.indicators.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>

                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                {condition.operator.includes('cross') ? (
                  <select
                    value={condition.indicator2}
                    onChange={(e) => updateCondition(condition.id, 'indicator2', e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  >
                    {signal.indicators.filter(ind => ind.id !== condition.indicator1).map((ind) => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={condition.value || ''}
                    onChange={(e) => updateCondition(condition.id, 'value', Number(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
                    placeholder="Value"
                  />
                )}

                <div className="md:col-span-2 flex justify-end">
                  <Trash2
                    onClick={() => removeCondition(condition.id)}
                    className="h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signal Strength */}
      {signal.strength > 0 && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Signal Strength</span>
            <span className="text-emerald-400 font-bold">{signal.strength}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${signal.strength}%` }}
            />
          </div>
        </div>
      )}

      {/* Add Indicator Modal */}
      {showIndicatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add Technical Indicator</h3>
            <div className="space-y-3">
              {INDICATOR_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addIndicator(type.value)}
                  className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowIndicatorModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}