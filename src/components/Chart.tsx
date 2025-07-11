import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { cryptoAPI, ChartData } from '../services/api';

interface ChartProps {
  symbol: string;
  data?: ChartData[];
}

export default function Chart({ symbol }: ChartProps) {
  const [timeframe, setTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('candlestick');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const data = await cryptoAPI.getHistoricalData('bitcoin', 30);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, timeframe]);

  useEffect(() => {
    if (chartData.length > 0 && canvasRef.current) {
      drawChart();
    }
  }, [chartData, chartType]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (chartData.length === 0) return;

    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find min/max values
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw price labels
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${price.toFixed(0)}`, padding - 10, y + 4);
    }

    if (chartType === 'candlestick') {
      drawCandlesticks(ctx, chartData, padding, chartWidth, chartHeight, minPrice, priceRange);
    } else if (chartType === 'line') {
      drawLine(ctx, chartData, padding, chartWidth, chartHeight, minPrice, priceRange);
    } else if (chartType === 'area') {
      drawArea(ctx, chartData, padding, chartWidth, chartHeight, minPrice, priceRange);
    }
  };

  const drawCandlesticks = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    priceRange: number
  ) => {
    const candleWidth = Math.max(2, chartWidth / data.length - 2);
    
    data.forEach((candle, index) => {
      const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - candleWidth) / 2;
      const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
      const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      
      const isGreen = candle.close > candle.open;
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, bodyTop, candleWidth, Math.max(1, bodyHeight));
    });
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    priceRange: number
  ) => {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((candle, index) => {
      const x = padding + (chartWidth / data.length) * index;
      const y = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  };

  const drawArea = (
    ctx: CanvasRenderingContext2D,
    data: ChartData[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    minPrice: number,
    priceRange: number
  ) => {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // Start from bottom left
    ctx.moveTo(padding, padding + chartHeight);
    
    data.forEach((candle, index) => {
      const x = padding + (chartWidth / data.length) * index;
      const y = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      ctx.lineTo(x, y);
    });
    
    // Close path to bottom right
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw line on top
    drawLine(ctx, data, padding, chartWidth, chartHeight, minPrice, priceRange);
  };

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2].close : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-emerald-400" />
            {symbol} Chart
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-sm font-semibold ${priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
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
      
      <div className="relative">
        {loading ? (
          <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
            <div className="text-center">
              <Activity className="h-8 w-8 text-gray-600 mx-auto mb-2 animate-spin" />
              <p className="text-gray-400">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-64 bg-gray-900 rounded-lg border border-gray-700"
          />
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">Volume</p>
          <p className="text-white font-semibold">
            {chartData.length > 0 ? `${(chartData[chartData.length - 1].volume / 1000000).toFixed(1)}M` : '0'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">24h High</p>
          <p className="text-white font-semibold">
            ${chartData.length > 0 ? Math.max(...chartData.map(d => d.high)).toFixed(2) : '0'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">24h Low</p>
          <p className="text-white font-semibold">
            ${chartData.length > 0 ? Math.min(...chartData.map(d => d.low)).toFixed(2) : '0'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Market Cap</p>
          <p className="text-white font-semibold">$850B</p>
        </div>
      </div>
    </div>
  );
}