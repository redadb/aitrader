import React from 'react';
import Header from './components/Header';
import PriceCard from './components/PriceCard';
import Chart from './components/Chart';
import Portfolio from './components/Portfolio';
import SignalAlerts from './components/SignalAlerts';
import MarketOverview from './components/MarketOverview';
import OrderBook from './components/OrderBook';
import TradingPanel from './components/TradingPanel';
import TradeHistory from './components/TradeHistory';
import NewsPanel from './components/NewsPanel';
import SignalBuilder from './components/SignalBuilder';
import StrategyBuilder from './components/StrategyBuilder';
import BacktestingEngine from './components/BacktestingEngine';
import AIAnalysis from './components/AIAnalysis';
import { useCryptoData } from './hooks/useCryptoData';

function App() {
  const { prices: topCryptos, loading, error, isConnected } = useCryptoData();
  const [activeSection, setActiveSection] = React.useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="container mx-auto px-6 py-6">
        {/* Connection Status */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Live Data Connected' : 'Offline Mode'}
            </span>
          </div>
          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Top Cryptocurrencies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Top Cryptocurrencies</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-6 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topCryptos.slice(0, 4).map((crypto) => (
                    <PriceCard key={crypto.symbol} {...crypto} />
                  ))}
                </div>
              )}
            </section>

            {/* Trading Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
              {/* Chart Section */}
              <div className="xl:col-span-2">
                <Chart symbol="BTC/USD" />
              </div>
              
              {/* Order Book */}
              <div>
                <OrderBook />
              </div>
              
              {/* Trading Panel */}
              <div>
                <TradingPanel />
              </div>
            </div>

            {/* Secondary Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Portfolio */}
              <div>
                <Portfolio />
              </div>
              
              {/* Signal Alerts */}
              <div>
                <SignalAlerts />
              </div>
              
              {/* Trade History */}
              <div>
                <TradeHistory />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Overview */}
              <div>
                <MarketOverview />
              </div>
              
              {/* News Panel */}
              <div>
                <NewsPanel />
              </div>
            </div>
          </>
        )}

        {/* Signal Builder Section */}
        {activeSection === 'signals' && <SignalBuilder />}

        {/* Strategy Builder Section */}
        {activeSection === 'strategies' && <StrategyBuilder />}

        {/* Backtesting Section */}
        {activeSection === 'backtesting' && <BacktestingEngine />}

        {/* AI Analysis Section */}
        {activeSection === 'ai-analysis' && <AIAnalysis />}
      </main>
    </div>
  );
}

export default App;