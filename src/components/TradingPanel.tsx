import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Calculator, CheckCircle, XCircle } from 'lucide-react';
import { TradingEngine } from '../services/api';

interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export default function TradingPanel() {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('44250');
  const [total, setTotal] = useState('');
  const [balance, setBalance] = useState(0);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tradingEngine = TradingEngine.getInstance();

  useEffect(() => {
    setBalance(tradingEngine.getBalance());
  }, []);

  const calculateTotal = () => {
    if (amount && price) {
      const totalValue = parseFloat(amount) * parseFloat(price);
      setTotal(totalValue.toFixed(2));
    } else {
      setTotal('');
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [amount, price]);

  const handlePercentageClick = (percentage: number) => {
    if (side === 'buy') {
      const availableBalance = balance * 0.99; // Account for fees
      const currentPrice = parseFloat(price) || 44250;
      const maxAmount = (availableBalance * (percentage / 100)) / currentPrice;
      setAmount(maxAmount.toFixed(8));
    } else {
      // For sell orders, we'd need to know the current position
      // For now, just set a mock amount
      const mockPosition = 0.5; // Mock BTC position
      const sellAmount = mockPosition * (percentage / 100);
      setAmount(sellAmount.toFixed(8));
    }
  };

  const handleSubmitOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setOrderResult({ success: false, error: 'Please enter a valid amount' });
      return;
    }

    if (orderType !== 'market' && (!price || parseFloat(price) <= 0)) {
      setOrderResult({ success: false, error: 'Please enter a valid price' });
      return;
    }

    setIsSubmitting(true);
    setOrderResult(null);

    try {
      const order = {
        symbol: 'BTC',
        side,
        type: orderType,
        amount: parseFloat(amount),
        price: orderType !== 'market' ? parseFloat(price) : undefined,
      };

      const result = tradingEngine.placeOrder(order);
      setOrderResult(result);

      if (result.success) {
        // Reset form on successful order
        setAmount('');
        setTotal('');
        // Update balance
        setBalance(tradingEngine.getBalance());
      }
    } catch (error) {
      setOrderResult({ success: false, error: 'Failed to place order' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedFee = parseFloat(total || '0') * 0.001; // 0.1% fee
  const estimatedTotal = parseFloat(total || '0') + estimatedFee;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2 text-emerald-400" />
          Trading Panel
        </h3>
        <Calculator className="h-5 w-5 text-gray-400" />
      </div>

      {/* Order Result */}
      {orderResult && (
        <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
          orderResult.success 
            ? 'bg-emerald-500/20 border border-emerald-500/30' 
            : 'bg-red-500/20 border border-red-500/30'
        }`}>
          {orderResult.success ? (
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400" />
          )}
          <span className={`text-sm ${orderResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
            {orderResult.success 
              ? `Order placed successfully! ID: ${orderResult.orderId?.slice(-8)}` 
              : orderResult.error
            }
          </span>
        </div>
      )}

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
            step="0.01"
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
          step="0.00000001"
        />
        <div className="flex justify-between mt-2 text-xs">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentageClick(parseInt(percent))}
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
          onChange={(e) => {
            setTotal(e.target.value);
            if (e.target.value && price) {
              setAmount((parseFloat(e.target.value) / parseFloat(price)).toFixed(8));
            }
          }}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-emerald-500 focus:outline-none"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      {/* Available Balance */}
      <div className="mb-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Available:</span>
          <span className="text-white">
            {side === 'buy' ? `$${balance.toLocaleString()} USD` : '0.5234 BTC'}
          </span>
        </div>
        {side === 'buy' && parseFloat(total || '0') > balance && (
          <div className="text-red-400 text-xs mt-1">Insufficient balance</div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitOrder}
        disabled={isSubmitting || (side === 'buy' && parseFloat(total || '0') > balance)}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          side === 'buy'
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
      >
        {isSubmitting ? 'Placing Order...' : `${side === 'buy' ? 'Buy' : 'Sell'} BTC`}
      </button>

      {/* Order Summary */}
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Est. Fee (0.1%):</span>
          <span>${estimatedFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Total:</span>
          <span className="text-white font-semibold">${estimatedTotal.toFixed(2)}</span>
        </div>
        {orderType === 'market' && (
          <div className="text-yellow-400 text-xs mt-2">
            ⚠️ Market orders execute immediately at current market price
          </div>
        )}
      </div>
    </div>
  );
}