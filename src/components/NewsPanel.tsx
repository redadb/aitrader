import React from 'react';
import { Newspaper, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  url: string;
}

export default function NewsPanel() {
  const news: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin ETF Approval Drives Market Rally',
      summary: 'SEC approves multiple Bitcoin ETFs, leading to significant price increases across major cryptocurrencies.',
      source: 'CoinDesk',
      timestamp: '2 hours ago',
      sentiment: 'positive',
      impact: 'high',
      url: '#'
    },
    {
      id: '2',
      title: 'Ethereum Network Upgrade Scheduled',
      summary: 'Major network upgrade expected to improve transaction speeds and reduce gas fees.',
      source: 'Ethereum Foundation',
      timestamp: '4 hours ago',
      sentiment: 'positive',
      impact: 'medium',
      url: '#'
    },
    {
      id: '3',
      title: 'Regulatory Concerns in Asian Markets',
      summary: 'New regulations proposed in several Asian countries may impact crypto trading volumes.',
      source: 'Reuters',
      timestamp: '6 hours ago',
      sentiment: 'negative',
      impact: 'medium',
      url: '#'
    },
    {
      id: '4',
      title: 'DeFi Protocol Launches New Features',
      summary: 'Popular DeFi platform introduces yield farming opportunities with enhanced security measures.',
      source: 'DeFi Pulse',
      timestamp: '8 hours ago',
      sentiment: 'positive',
      impact: 'low',
      url: '#'
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-emerald-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-yellow-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-600" />;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Newspaper className="h-5 w-5 mr-2 text-emerald-400" />
          Market News
        </h3>
        <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getImpactIcon(item.impact)}
                <span className="text-xs text-gray-400 uppercase">{item.impact} impact</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-emerald-400 transition-colors" />
            </div>
            
            <h4 className="text-white font-semibold mb-2 line-clamp-2">
              {item.title}
            </h4>
            
            <p className="text-sm text-gray-300 mb-3 line-clamp-2">
              {item.summary}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{item.source}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{item.timestamp}</span>
              </div>
              <span className={`font-semibold ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Market Sentiment</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
            </div>
            <span className="text-emerald-400 font-semibold">75% Bullish</span>
          </div>
        </div>
      </div>
    </div>
  );
}