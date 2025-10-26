import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './TelegramTrends.scss';

// Crypto icons
import btcIcon from 'cryptocurrency-icons/svg/color/btc.svg';
import ethIcon from 'cryptocurrency-icons/svg/color/eth.svg';
import solIcon from 'cryptocurrency-icons/svg/color/sol.svg';
import adaIcon from 'cryptocurrency-icons/svg/color/ada.svg';
import dotIcon from 'cryptocurrency-icons/svg/color/dot.svg';

interface TrendingTopic {
  id: number;
  topic: string;
  mentions: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  change: number;
}

interface TrendingCoin {
  id: number;
  name: string;
  symbol: string;
  mentions: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  price: string;
  change24h: number;
}

const TelegramTrends: React.FC = () => {
  const trendingTopics: TrendingTopic[] = [
    { id: 1, topic: 'Bitcoin Halving', mentions: 15420, sentiment: 'positive', change: 25 },
    { id: 2, topic: 'Ethereum ETF', mentions: 12350, sentiment: 'positive', change: 18 },
    { id: 3, topic: 'DeFi Summer', mentions: 9870, sentiment: 'neutral', change: -5 },
    { id: 4, topic: 'NFT Market', mentions: 8540, sentiment: 'negative', change: -15 },
    { id: 5, topic: 'Layer 2 Solutions', mentions: 7650, sentiment: 'positive', change: 32 },
  ];

  const coinIcons: Record<string, string> = {
    BTC: btcIcon,
    ETH: ethIcon,
    SOL: solIcon,
    ADA: adaIcon,
    DOT: dotIcon,
  };

  const trendingCoins: TrendingCoin[] = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', mentions: 25430, sentiment: 'bullish', price: '$45,234', change24h: 5.2 },
    { id: 2, name: 'Ethereum', symbol: 'ETH', mentions: 18920, sentiment: 'bullish', price: '$2,456', change24h: 3.8 },
    { id: 3, name: 'Solana', symbol: 'SOL', mentions: 12340, sentiment: 'neutral', price: '$98.45', change24h: -1.2 },
    { id: 4, name: 'Cardano', symbol: 'ADA', mentions: 9870, sentiment: 'bearish', price: '$0.52', change24h: -4.5 },
    { id: 5, name: 'Polkadot', symbol: 'DOT', mentions: 7650, sentiment: 'bullish', price: '$7.23', change24h: 8.7 },
  ];

  const sentimentData = {
    positive: 58,
    neutral: 27,
    negative: 15
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
      case 'bullish':
        return '#22c55e';
      case 'negative':
      case 'bearish':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="telegram-trends-page">
      <Container fluid>

        {/* Sentiment Overview */}
        <div className="sentiment-overview">
          <h2>📊 Genel Sentiment Analizi</h2>
          <Row>
            <Col md={4}>
              <div className="sentiment-card positive">
                <div className="sentiment-icon">😊</div>
                <h3>Pozitif</h3>
                <p className="sentiment-value">{sentimentData.positive}%</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="sentiment-card neutral">
                <div className="sentiment-icon">😐</div>
                <h3>Nötr</h3>
                <p className="sentiment-value">{sentimentData.neutral}%</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="sentiment-card negative">
                <div className="sentiment-icon">😟</div>
                <h3>Negatif</h3>
                <p className="sentiment-value">{sentimentData.negative}%</p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Trending Topics */}
        <div className="section">
          <h2>🔥 En Çok Konuşulan Konular</h2>
          <div className="topics-list">
            {trendingTopics.map((topic, index) => (
              <div key={topic.id} className="topic-item">
                <div className="topic-rank">#{index + 1}</div>
                <div className="topic-content">
                  <h4>{topic.topic}</h4>
                  <div className="topic-stats">
                    <span className="mentions">💬 {topic.mentions.toLocaleString()} mentions</span>
                    <span 
                      className="sentiment-badge"
                      style={{ background: getSentimentColor(topic.sentiment) + '20', color: getSentimentColor(topic.sentiment) }}
                    >
                      {topic.sentiment === 'positive' ? '📈' : topic.sentiment === 'negative' ? '📉' : '➡️'} 
                      {topic.sentiment}
                    </span>
                  </div>
                </div>
                <div className={`topic-change ${topic.change > 0 ? 'positive' : 'negative'}`}>
                  {topic.change > 0 ? '↑' : '↓'} {Math.abs(topic.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Coins */}
        <div className="section">
          <h2>💰 En Çok Konuşulan Coinler</h2>
          <div className="coins-grid">
            <Row>
              {trendingCoins.map((coin) => (
                <Col key={coin.id} md={6} lg={4}>
                  <div className="coin-card">
                    <div className="coin-header">
                      <div className="coin-title-section">
                        <img src={coinIcons[coin.symbol]} alt={coin.symbol} className="coin-icon" />
                        <div>
                          <h3>{coin.name}</h3>
                          <span className="coin-symbol">{coin.symbol}</span>
                        </div>
                      </div>
                      <span 
                        className="coin-sentiment"
                        style={{ color: getSentimentColor(coin.sentiment) }}
                      >
                        {coin.sentiment === 'bullish' ? '🐂' : coin.sentiment === 'bearish' ? '🐻' : '➡️'}
                      </span>
                    </div>
                    <div className="coin-price">
                      <span className="price">{coin.price}</span>
                      <span className={`price-change ${coin.change24h > 0 ? 'positive' : 'negative'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                      </span>
                    </div>
                    <div className="coin-mentions">
                      💬 {coin.mentions.toLocaleString()} mentions
                    </div>
                    <div 
                      className="sentiment-bar"
                      style={{ background: getSentimentColor(coin.sentiment) + '30' }}
                    >
                      <div 
                        className="sentiment-fill"
                        style={{ 
                          width: `${(coin.mentions / trendingCoins[0].mentions) * 100}%`,
                          background: getSentimentColor(coin.sentiment)
                        }}
                      ></div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TelegramTrends;

