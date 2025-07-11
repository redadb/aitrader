import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Calculator } from 'lucide-react';

export default function TradingPanel() {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('44250');
  const [total, setTotal] = useState('');

  const calculateTotal = () => {
    if (amount && price) {
      const totalValue = parseFloat(amount) * parseFloat(price);
      setTotal(totalValue.toFixed(2));
    }
  };

  React.useEffect(() => {
    calculateTotal();
  }, [amount, price]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-emerald-400" />
          Trading Panel
        </h3>
        <Calculator className="h-5 w-5 text-gray-400" />
      </div>

      {/* Buy/Sell Toggle */}
      <div className="flex mb-4">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 px-4 rounded-l-lg font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-1" />
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 px-4 rounded-r-lg font-semibold transition-colors ${
            side === 'sell'
              ? 'bg-red-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingDown className="h-4 w-4 inline mr-1" />
          Sell
        </button>
      </div>

      {/* Order Type */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Order Type</label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
          <option value="stop">Stop</option>
        </select>
      </div>

      {/* Price Input (for limit orders) */}
      {orderType !== 'market' && (
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Price (USD)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Amount (BTC)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          placeholder="0.00000000"
        />
        <div className="flex justify-between mt-2 text-xs">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <button
              key={percent}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              {percent}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Total (USD)</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          placeholder="0.00"
        />
      </div>

      {/* Available Balance */}
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Available:</span>
          <span className="text-white">
            {side === 'buy' ? '$12,450.00 USD' : '0.5234 BTC'}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          side === 'buy'
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
      </button>

      {/* Order Summary */}
      <div className="mt-4 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Est. Fee:</span>
          <span>$2.21 (0.1%)</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Total:</span>
          <span className="text-white">${(parseFloat(total || '0') + 2.21).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}