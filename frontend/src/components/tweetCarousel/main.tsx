import React from 'react';
import './style.scss';

interface Tweet {
  id: number;
  author: string;
  username: string;
  content: string;
  likes: number;
  retweets: number;
  avatar: string;
}

const TweetCarousel: React.FC = () => {
  // Mock tweet data - 3 rows of tweets
  const tweetsRow1: Tweet[] = [
    {
      id: 1,
      author: 'Crypto Analyst',
      username: '@cryptoanalyst',
      content: 'Bitcoin hitting new highs! 🚀 The bull run is just getting started. #BTC #Crypto',
      likes: 1234,
      retweets: 567,
      avatar: '🔵'
    },
    {
      id: 2,
      author: 'Blockchain News',
      username: '@blockchainnews',
      content: 'Major adoption incoming! Fortune 500 companies are now integrating blockchain technology.',
      likes: 892,
      retweets: 423,
      avatar: '⛓️'
    },
    {
      id: 3,
      author: 'DeFi Guru',
      username: '@defiguru',
      content: 'New DeFi protocol launches with revolutionary yield farming mechanism. APY is insane! 💎',
      likes: 2341,
      retweets: 891,
      avatar: '💰'
    },
    {
      id: 4,
      author: 'NFT Creator',
      username: '@nftartist',
      content: 'Just dropped my latest NFT collection! Check it out on OpenSea 🎨',
      likes: 567,
      retweets: 234,
      avatar: '🎨'
    },
    {
      id: 5,
      author: 'Whale Alert',
      username: '@whalealert',
      content: '🚨 100,000 ETH transferred from unknown wallet to Binance! Big moves happening.',
      likes: 3456,
      retweets: 1234,
      avatar: '🐋'
    }
  ];

  const tweetsRow2: Tweet[] = [
    {
      id: 6,
      author: 'Market Watch',
      username: '@marketwatch',
      content: 'Altseason is here! Multiple altcoins pumping 50%+ in the last 24 hours 📈',
      likes: 1876,
      retweets: 678,
      avatar: '📊'
    },
    {
      id: 7,
      author: 'Crypto Trader',
      username: '@cryptotrader',
      content: 'Called it last week! SOL breaking through resistance. Next target: $200 🎯',
      likes: 945,
      retweets: 456,
      avatar: '📈'
    },
    {
      id: 8,
      author: 'Tech Enthusiast',
      username: '@techenthusiast',
      content: 'The future of finance is decentralized. Web3 is not just a trend, it\'s a revolution! 🌐',
      likes: 1567,
      retweets: 789,
      avatar: '💻'
    },
    {
      id: 9,
      author: 'Degen Ape',
      username: '@degenape',
      content: 'Just aped into this new gem 💎 Do your own research but this could be huge! NFA',
      likes: 2890,
      retweets: 1456,
      avatar: '🦍'
    },
    {
      id: 10,
      author: 'Crypto News Daily',
      username: '@cryptonewsdaily',
      content: 'Breaking: Major institutional investor announces billion dollar crypto fund. Bullish! 🐂',
      likes: 4567,
      retweets: 2345,
      avatar: '📰'
    }
  ];

  const tweetsRow3: Tweet[] = [
    {
      id: 11,
      author: 'HODL Gang',
      username: '@hodlgang',
      content: 'Been holding since 2017. Diamond hands pay off eventually! 💎🙌',
      likes: 3214,
      retweets: 1567,
      avatar: '💎'
    },
    {
      id: 12,
      author: 'Metaverse Builder',
      username: '@metaversebuilder',
      content: 'Building the future of virtual worlds. The metaverse is closer than you think! 🌍',
      likes: 1234,
      retweets: 678,
      avatar: '🌍'
    },
    {
      id: 13,
      author: 'Smart Contracts',
      username: '@smartcontracts',
      content: 'Audited a new protocol today. Code is clean, security is tight. Looks promising! ✅',
      likes: 876,
      retweets: 345,
      avatar: '✅'
    },
    {
      id: 14,
      author: 'Yield Farmer',
      username: '@yieldfarmer',
      content: 'Found a new farm with 1000% APY! Sustainable? Probably not. Worth it? Absolutely! 🌾',
      likes: 2456,
      retweets: 1123,
      avatar: '🚜'
    },
    {
      id: 15,
      author: 'DAO Contributor',
      username: '@daocontributor',
      content: 'Just voted on my first DAO proposal. This is true decentralization! Power to the people! 🗳️',
      likes: 1678,
      retweets: 890,
      avatar: '🗳️'
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderTweetRow = (tweets: Tweet[], direction: 'left' | 'right', rowNumber: number) => {
    // Duplicate tweets for seamless loop
    const duplicatedTweets = [...tweets, ...tweets];

    return (
      <div className={`tweet-row tweet-row-${rowNumber}`}>
        <div className={`tweet-track tweet-track-${direction}`}>
          {duplicatedTweets.map((tweet, index) => (
            <div key={`${tweet.id}-${index}`} className="tweet-card">
              <div className="tweet-header">
                <div className="tweet-avatar">{tweet.avatar}</div>
                <div className="tweet-author-info">
                  <div className="tweet-author">{tweet.author}</div>
                  <div className="tweet-username">{tweet.username}</div>
                </div>
              </div>
              <div className="tweet-content">{tweet.content}</div>
              <div className="tweet-stats">
                <span className="tweet-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {formatNumber(tweet.likes)}
                </span>
                <span className="tweet-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                  {formatNumber(tweet.retweets)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="tweet-carousel">
      <div className="tweet-carousel-header">
        <h2 className="carousel-title">
          <span className="gradient-text">Community Pulse</span>
        </h2>
        <p className="carousel-subtitle">What the crypto community is talking about</p>
      </div>

      <div className="tweets-container">
        {renderTweetRow(tweetsRow1, 'left', 1)}
        {renderTweetRow(tweetsRow2, 'right', 2)}
        {renderTweetRow(tweetsRow3, 'left', 3)}
      </div>
    </section>
  );
};

export default TweetCarousel;

