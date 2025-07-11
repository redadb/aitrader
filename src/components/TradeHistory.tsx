import React, { useState, useEffect } from 'react';
import { History, TrendingUp, TrendingDown, Clock, X, RefreshCw } from 'lucide-react';
import { TradingEngine } from '../services/api';

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  executionPrice?: number;
  total: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled' | 'filled' | 'rejected';
  filled: number;
  type: 'market' | 'limit' | 'stop';
  error?: string;
}

export default function TradeHistory() {
  const [orders, setOrders] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'filled' | 'cancelled'>('all');
  const [loading, setLoading] = useState(false);

  const tradingEngine = TradingEngine.getInstance();

  const refreshOrders = () => {
    setLoading(true);
    const currentOrders = tradingEngine.getOrders();
    setOrders(currentOrders);
    setLoading(false);
  };

  useEffect(() => {
    refreshOrders();
    
    // Refresh orders every 5 seconds
    const interval = setInterval(refreshOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const cancelOrder = (orderId: string) => {
    const success = tradingEngine.cancelOrder(orderId);
    if (success) {
      refreshOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'filled') return order.status === 'filled';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'text-emerald-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-gray-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'filled':
        return `${baseClasses} bg-emerald-500/20 text-emerald-400`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      case 'cancelled':
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
      case 'rejected':
        return `${baseClasses} bg-red-500/20 text-red-400`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
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
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshOrders}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'filled', label: 'Filled' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              filter === key
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label} ({orders.filter(o => key === 'all' || o.status === key).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No orders found</p>
            <p className="text-sm text-gray-500">Your trading history will appear here</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSideIcon(order.side)}
                  <span className="font-semibold text-white">{order.symbol}</span>
                  <span className={`text-sm uppercase font-semibold ${
                    order.side === 'buy' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {order.side}
                  </span>
                  <span className="text-xs text-gray-400 uppercase">
                    {order.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Cancel Order"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                <div>
                  <p className="text-gray-400">Amount</p>
                  <p className="text-white font-mono">{order.amount.toFixed(8)}</p>
                  {order.filled > 0 && order.filled < order.amount && (
                    <p className="text-xs text-yellow-400">
                      Filled: {order.filled.toFixed(8)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400">Price</p>
                  <p className="text-white font-mono">
                    {order.executionPrice 
                      ? `$${order.executionPrice.toLocaleString()}` 
                      : order.price 
                        ? `$${order.price.toLocaleString()}`
                        : 'Market'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total</p>
                  <p className="text-white font-mono">
                    ${(order.executionPrice ? order.filled * order.executionPrice : order.total).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {order.error && (
                <div className="mb-2 p-2 bg-red-500/20 rounded text-red-400 text-sm">
                  {order.error}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(order.timestamp).toLocaleString()}
                </div>
                <span>ID: {order.id.slice(-8)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-400">Total Orders</p>
              <p className="text-white font-semibold">{orders.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Filled</p>
              <p className="text-emerald-400 font-semibold">
                {orders.filter(o => o.status === 'filled').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Pending</p>
              <p className="text-yellow-400 font-semibold">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}