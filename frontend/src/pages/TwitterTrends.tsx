import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './TwitterTrends.scss';

interface Tweet {
  id: number;
  author: string;
  handle: string;
  content: string;
  likes: number;
  retweets: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}

interface HashtagTrend {
  id: number;
  hashtag: string;
  count: number;
  change: number;
}

const TwitterTrends: React.FC = () => {
  const trendingHashtags: HashtagTrend[] = [
    { id: 1, hashtag: '#Bitcoin', count: 45230, change: 15 },
    { id: 2, hashtag: '#Crypto', count: 38920, change: 22 },
    { id: 3, hashtag: '#DeFi', count: 25340, change: -8 },
    { id: 4, hashtag: '#NFT', count: 19870, change: -12 },
    { id: 5, hashtag: '#Web3', count: 17650, change: 35 },
    { id: 6, hashtag: '#Ethereum', count: 15430, change: 18 },
    { id: 7, hashtag: '#Blockchain', count: 12890, change: 12 },
    { id: 8, hashtag: '#Metaverse', count: 11250, change: -5 },
    { id: 9, hashtag: '#AI', count: 9870, change: 28 },
    { id: 10, hashtag: '#Trading', count: 8540, change: -3 },
  ];

  const topTweets: Tweet[] = [
    {
      id: 1,
      author: 'Crypto Analyst',
      handle: '@cryptoanalyst',
      content: 'Bitcoin breaking through resistance levels! This could be the start of the next bull run. Technical indicators are all pointing up! 🚀📈',
      likes: 12450,
      retweets: 3420,
      sentiment: 'positive',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'DeFi Expert',
      handle: '@defiexpert',
      content: 'Major protocol update coming next week. This will revolutionize how we think about decentralized finance. Stay tuned! 🔥',
      likes: 8930,
      retweets: 2150,
      sentiment: 'positive',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      author: 'Market Watcher',
      handle: '@marketwatcher',
      content: 'Seeing some concerning volume drops across major exchanges. Traders should be cautious in the short term. 📊⚠️',
      likes: 5420,
      retweets: 1230,
      sentiment: 'negative',
      timestamp: '6 hours ago'
    },
    {
      id: 4,
      author: 'Blockchain Dev',
      handle: '@blockchaindev',
      content: 'Just deployed our new smart contract! Gas optimization reduced costs by 40%. Open source code available on GitHub. 💻',
      likes: 7230,
      retweets: 1890,
      sentiment: 'positive',
      timestamp: '8 hours ago'
    },
    {
      id: 5,
      author: 'NFT Collector',
      handle: '@nftcollector',
      content: 'The NFT market is showing signs of recovery. Blue chip collections holding strong. Time to accumulate? 🎨',
      likes: 4560,
      retweets: 980,
      sentiment: 'neutral',
      timestamp: '10 hours ago'
    },
    {
      id: 6,
      author: 'Whale Alert',
      handle: '@whalealert',
      content: '50,000 ETH transferred from unknown wallet to Binance. Large movement detected! Keep an eye on the market. 🐋',
      likes: 15670,
      retweets: 4320,
      sentiment: 'neutral',
      timestamp: '12 hours ago'
    },
    {
      id: 7,
      author: 'Trading Pro',
      handle: '@tradingpro',
      content: 'Perfect double bottom formation on BTC/USD. Entry at $42k with stop loss at $40.5k. Target $48k. Not financial advice! 📈',
      likes: 6780,
      retweets: 1450,
      sentiment: 'positive',
      timestamp: '14 hours ago'
    },
    {
      id: 8,
      author: 'Crypto News',
      handle: '@cryptonews',
      content: 'Breaking: Major institution announces $500M crypto fund. Bullish indicator for market sentiment. Details coming soon! 🔔',
      likes: 9340,
      retweets: 2890,
      sentiment: 'positive',
      timestamp: '16 hours ago'
    },
  ];

  const sentimentStats = {
    bullish: 62,
    bearish: 38
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#22c55e';
      case 'negative':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="twitter-trends-page">
      <Container fluid>
        {/* Market Sentiment Progress Bar */}
        <div className="market-sentiment">
          <div className="sentiment-progress-bar">
            <div className="progress-bullish" style={{ width: `${sentimentStats.bullish}%` }}>
              <div className="sentiment-content">
                <span className="sentiment-label">BULLISH</span>
                <span className="sentiment-percentage">{sentimentStats.bullish}%</span>
              </div>
            </div>
            <div className="progress-bearish" style={{ width: `${sentimentStats.bearish}%` }}>
              <div className="sentiment-content">
                <span className="sentiment-label">BEARISH</span>
                <span className="sentiment-percentage">{sentimentStats.bearish}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <Row>
          {/* Left Column - Hashtags */}
          <Col lg={5}>
            <div className="section">
              <h2>🔥 Trending Hashtags</h2>
              <div className="hashtags-list">
                {trendingHashtags.map((tag, index) => (
                  <div key={tag.id} className="hashtag-item">
                    <div className="hashtag-rank">#{index + 1}</div>
                    <div className="hashtag-content">
                      <h4>{tag.hashtag}</h4>
                      <p className="hashtag-count">📝 {tag.count.toLocaleString()} tweets</p>
                    </div>
                    <div className={`hashtag-change ${tag.change > 0 ? 'positive' : 'negative'}`}>
                      {tag.change > 0 ? '↑' : '↓'} {Math.abs(tag.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right Column - Tweets */}
          <Col lg={7}>
            <div className="section">
              <h2>⭐ Top Tweets</h2>
              <div className="tweets-column">
                {topTweets.map((tweet) => (
                  <div key={tweet.id} className="tweet-card-full">
                    <div className="tweet-header">
                      <div className="tweet-author">
                        <div className="author-avatar">
                          {tweet.author.charAt(0)}
                        </div>
                        <div className="author-info">
                          <h4>{tweet.author}</h4>
                          <span className="handle">{tweet.handle}</span>
                        </div>
                      </div>
                      <span className="timestamp">{tweet.timestamp}</span>
                    </div>
                    <p className="tweet-content">{tweet.content}</p>
                    <div className="tweet-footer">
                      <div className="tweet-stats">
                        <span className="stat">❤️ {(tweet.likes / 1000).toFixed(1)}K</span>
                        <span className="stat">🔄 {(tweet.retweets / 1000).toFixed(1)}K</span>
                      </div>
                      <span 
                        className="tweet-sentiment"
                        style={{ 
                          background: getSentimentColor(tweet.sentiment) + '20',
                          color: getSentimentColor(tweet.sentiment)
                        }}
                      >
                        {tweet.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TwitterTrends;

