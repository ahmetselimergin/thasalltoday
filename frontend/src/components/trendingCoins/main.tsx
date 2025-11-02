import React, { useState, useEffect } from 'react';
import './style.scss';
import { telegramAPI } from '../../services/api';

interface TrendingCoin {
  symbol: string;
  mentions: number;
  trend: 'hot' | 'rising' | 'normal';
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    score: number;
  };
}

const TrendingCoins: React.FC = () => {
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCoins();
    // Her 5 dakikada bir güncelle
    const interval = setInterval(fetchTrendingCoins, 900000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingCoins = async () => {
    try {
      const response = await telegramAPI.getTrendingCoins();
      if (response.success) {
        setTrendingCoins(response.data);
      }
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoinIcon = (symbol: string) => {
    // Direct SVG icons from cryptocurrency-icons library (CDN)
    // Format: https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/{symbol}.svg
    return `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@latest/svg/color/${symbol.toLowerCase()}.svg`;
  };

  return (
    <div className="trending-coins-container">
      <div className="section-header">
        <h2 className="section-title">
          <span className="gradient-text">🪙 Top Trending Coins</span>
        </h2>
        <p className="section-subtitle">Most mentioned coins in Telegram channels (updates every 15 min)</p>
      </div>

      {loading ? (
        <div className="coins-loading">
          <div className="spinner-small"></div>
          <span>Loading trending coins...</span>
        </div>
      ) : (
        <div className="coins-grid">
          {trendingCoins.map((coin, index) => (
            <div key={coin.symbol} className="coin-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="coin-icon-wrapper">
                <img 
                  src={getCoinIcon(coin.symbol)} 
                  alt={coin.symbol}
                  className="coin-icon-img"
                  onError={(e) => {
                    // Fallback to emoji if image fails
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="coin-icon-fallback hidden">💎</div>
              </div>
              <div className="coin-info">
                <h3 className="coin-symbol">
                  {coin.symbol}
                </h3>
                <div className="coin-mentions">
                  <span className="mentions-count">{coin.mentions}</span>
                  <span className="mentions-label">mentions</span>
                </div>
                {/* Sentiment Progress Bar */}
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-positive" 
                    style={{ width: `${coin.sentiment.positive}%` }}
                    title={`Positive: ${coin.sentiment.positive}%`}
                  ></div>
                  <div 
                    className="sentiment-negative" 
                    style={{ width: `${coin.sentiment.negative}%` }}
                    title={`Negative: ${coin.sentiment.negative}%`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingCoins;

