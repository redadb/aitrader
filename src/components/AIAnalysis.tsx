import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Activity } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'pattern' | 'sentiment' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

interface MarketPrediction {
  symbol: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetPrice: number;
  timeframe: string;
  reasoning: string[];
}

export default function AIAnalysis() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  useEffect(() => {
    // Simulate AI analysis
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'pattern',
        title: 'Bullish Divergence Detected',
        description: 'RSI showing bullish divergence while price makes lower lows. Historical accuracy: 78%',
        confidence: 85,
        impact: 'high',
        timeframe: '4h',
      },
      {
        id: '2',
        type: 'sentiment',
        title: 'Social Sentiment Shift',
        description: 'Twitter sentiment for BTC shifted from 32% to 68% positive in last 6 hours',
        confidence: 72,
        impact: 'medium',
        timeframe: '6h',
      },
      {
        id: '3',
        type: 'risk',
        title: 'Volatility Spike Warning',
        description: 'ML model predicts 40% chance of >5% price movement in next 2 hours',
        confidence: 91,
        impact: 'high',
        timeframe: '2h',
      },
      {
        id: '4',
        type: 'prediction',
        title: 'Support Level Hold',
        description: 'AI predicts 83% probability of $43,200 support level holding based on volume analysis',
        confidence: 83,
        impact: 'medium',
        timeframe: '1h',
      },
    ];

    const mockPredictions: MarketPrediction[] = [
      {
        symbol: 'BTC',
        direction: 'bullish',
        confidence: 78,
        targetPrice: 46500,
        timeframe: '24h',
        reasoning: [
          'Strong institutional buying detected',
          'Technical indicators showing oversold conditions',
          'Positive correlation with traditional markets',
        ],
      },
      {
        symbol: 'ETH',
        direction: 'neutral',
        confidence: 65,
        targetPrice: 2520,
        timeframe: '12h',
        reasoning: [
          'Consolidation pattern forming',
          'Mixed signals from derivatives market',
          'Awaiting key resistance break',
        ],
      },
    ];

    setInsights(mockInsights);
    setPredictions(mockPredictions);
  }, []);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      // Update insights with new analysis
    }, 3000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Target className="h-5 w-5 text-blue-400" />;
      case 'pattern':
        return <Activity className="h-5 w-5 text-emerald-400" />;
      case 'sentiment':
        return <TrendingUp className="h-5 w-5 text-purple-400" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <Brain className="h-5 w-5 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish':
        return 'text-emerald-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Market Analysis</h2>
              <p className="text-gray-400">Real-time insights powered by machine learning</p>
            </div>
          </div>
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
          </button>
        </div>

        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Processing market data...</span>
              <span className="text-emerald-400">AI Working</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        )}

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Analysis Timeframe:</span>
          {['1h', '4h', '1d', '1w'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-emerald-400" />
            AI Insights
          </h3>
          
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <span className="text-white font-semibold">{insight.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {insight.impact}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Timeframe: {insight.timeframe}</span>
                  <span>Type: {insight.type}</span>
                </div>
                
                <div className="mt-2 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      insight.confidence >= 80 ? 'bg-emerald-500' :
                      insight.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Predictions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Price Predictions
          </h3>
          
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-lg">{prediction.symbol}</span>
                    <span className={`text-sm font-semibold uppercase ${getDirectionColor(prediction.direction)}`}>
                      {prediction.direction}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-gray-400 text-sm">Target Price</span>
                    <p className="text-white font-semibold">${prediction.targetPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Timeframe</span>
                    <p className="text-white font-semibold">{prediction.timeframe}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-sm mb-2 block">AI Reasoning:</span>
                  <ul className="space-y-1">
                    {prediction.reasoning.map((reason, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-center">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full mr-2" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getConfidenceColor(prediction.confidence).includes('emerald') ? 'bg-emerald-500' : 
                      getConfidenceColor(prediction.confidence).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Model Performance */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Model Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Prediction Accuracy</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-emerald-400">73.2%</span>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Model Confidence</span>
              <Brain className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-400">81.5%</span>
            <p className="text-xs text-gray-400 mt-1">Average</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Signals Generated</span>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-yellow-400">1,247</span>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Risk Score</span>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-400">Medium</span>
            <p className="text-xs text-gray-400 mt-1">Current market</p>
          </div>
        </div>
      </div>
    </div>
  );
}