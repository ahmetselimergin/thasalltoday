import React from 'react';
import './style.scss';

interface Tweet {
  id: number | string;
  username: string;
  handle: string;
  content: string;
  avatar: string;
  likes?: number;
  retweets?: number;
}

const TweetHero: React.FC = () => {
  // Bitcoin & Crypto tweets (Strip 1)
  const tweets1: Tweet[] = [
    { id: 1, username: 'CryptoWhale', handle: '@cryptowhale', content: '🚀 Bitcoin just broke $50k! The bull run is here! #BTC #Crypto', avatar: '₿', likes: 5420, retweets: 1230 },
    { id: 2, username: 'Satoshi_Fan', handle: '@satoshi_fan', content: '📈 BTC dominance at 45%, altcoin season incoming! HODL strong 💎', avatar: '₿', likes: 3200, retweets: 890 },
    { id: 3, username: 'BitcoinMaxi', handle: '@bitcoinmaxi', content: '⚡ Lightning Network transactions hit all-time high! Scaling is here!', avatar: '⚡', likes: 2100, retweets: 567 },
    { id: 4, username: 'CryptoAnalyst', handle: '@cryptoanalyst', content: '📊 Bitcoin hash rate reaches new peak - network stronger than ever!', avatar: '📊', likes: 1890, retweets: 445 },
    { id: 5, username: 'OnChainWizard', handle: '@onchainwizard', content: '🔍 On-chain analysis shows massive whale accumulation. Bullish!', avatar: '🧙', likes: 4560, retweets: 1340 },
    { id: 6, username: 'BlockchainNews', handle: '@blockchainnews', content: '📰 Major bank announces Bitcoin custody services. Adoption accelerating!', avatar: '🏦', likes: 6780, retweets: 2100 },
    { id: 7, username: 'CryptoMiner', handle: '@cryptominer', content: '⛏️ Mining profitability at highest levels in months. Hashrate soaring!', avatar: '⛏️', likes: 1234, retweets: 345 },
  ];

  // Ethereum, DeFi & Smart Contracts (Strip 2)
  const tweets2: Tweet[] = [
    { id: 8, username: 'ETH_Trader', handle: '@eth_trader', content: '💎 Ethereum 2.0 staking rewards are amazing! 5.5% APY and growing!', avatar: 'Ξ', likes: 4200, retweets: 1100 },
    { id: 9, username: 'DeFi_Master', handle: '@defi_master', content: '🔥 New DeFi protocol launched with innovative yield farming strategies!', avatar: '🌊', likes: 3100, retweets: 890 },
    { id: 10, username: 'VitalikFan', handle: '@vitalikfan', content: '🦄 Ethereum scaling solutions are game-changing. Layer 2 is the future!', avatar: 'Ξ', likes: 5600, retweets: 1450 },
    { id: 11, username: 'SmartContracts', handle: '@smartcontracts', content: '⚙️ Just deployed a gas-optimized smart contract. 60% gas savings! 🎉', avatar: '🔧', likes: 2340, retweets: 678 },
    { id: 12, username: 'DeFiResearch', handle: '@defiresearch', content: '📈 Total Value Locked in DeFi hits $100B milestone. Ecosystem thriving!', avatar: '💰', likes: 7890, retweets: 2340 },
    { id: 13, username: 'UniswapTrader', handle: '@uniswaptrader', content: '🦄 Uniswap V4 hooks are revolutionary. DeFi innovation never stops!', avatar: '🔄', likes: 3450, retweets: 890 },
    { id: 14, username: 'GasOptimizer', handle: '@gasoptimizer', content: '⚡ Gas fees on mainnet lowest in 6 months. Perfect time to interact!', avatar: '⛽', likes: 1890, retweets: 456 },
  ];

  // Web3, NFTs, DAOs & Metaverse (Strip 3)
  const tweets3: Tweet[] = [
    { id: 15, username: 'NFT_Collector', handle: '@nft_collector', content: '🎨 Just minted an incredible generative art NFT collection! Floor rising 📈', avatar: '🖼️', likes: 2890, retweets: 670 },
    { id: 16, username: 'Web3_Builder', handle: '@web3_builder', content: '🛠️ Building the future of decentralized apps. Web3 is unstoppable!', avatar: '🔷', likes: 4100, retweets: 1200 },
    { id: 17, username: 'MetaverseExplorer', handle: '@metaverse_explorer', content: '🌐 Virtual land prices in top metaverses going parabolic! Early adopters winning!', avatar: '🗺️', likes: 3560, retweets: 890 },
    { id: 18, username: 'DAO_Voter', handle: '@dao_voter', content: '🗳️ Just voted on 3 governance proposals today. True decentralization!', avatar: '🏛️', likes: 1670, retweets: 445 },
    { id: 19, username: 'Web3Dev', handle: '@web3dev', content: '💻 Shipped a new dApp using Next.js + Web3.js. Developer experience is 🔥', avatar: '👨‍💻', likes: 2340, retweets: 567 },
    { id: 20, username: 'NFT_Artist', handle: '@nft_artist', content: '🎭 Dropped my latest NFT collection - sold out in 2 minutes! Thank you all!', avatar: '🎨', likes: 8900, retweets: 3400 },
    { id: 21, username: 'CryptoGaming', handle: '@cryptogaming', content: '🎮 Play-to-earn gaming economy is revolutionizing the gaming industry!', avatar: '🎮', likes: 5670, retweets: 1890 },
  ];

  const renderTweet = (tweet: Tweet) => (
    <div key={tweet.id} className="tweet-card">
      <div className="tweet-header">
        <div className="tweet-avatar">{tweet.avatar}</div>
        <div className="tweet-user-info">
          <div className="tweet-username">{tweet.username}</div>
          <div className="tweet-handle">{tweet.handle}</div>
        </div>
      </div>
      <div className="tweet-content">{tweet.content}</div>
      {(tweet.likes || tweet.retweets) && (
        <div className="tweet-stats">
          {tweet.likes && <span className="stat-item">❤️ {tweet.likes.toLocaleString()}</span>}
          {tweet.retweets && <span className="stat-item">🔄 {tweet.retweets.toLocaleString()}</span>}
        </div>
      )}
    </div>
  );

  return (
    <section className="tweet-hero">
      <div className="tweet-hero-header">
        <h1>Crypto Community Pulse</h1>
        <p>Hot takes from the blockchain ecosystem</p>
      </div>

      <div className="tweets-container">
        {/* Strip 1 - Left to Right (Bitcoin & Crypto) */}
        <div className="tweet-strip">
          <div className="tweet-track scroll-right">
            {[...tweets1, ...tweets1].map((tweet, index) => (
              <React.Fragment key={`${tweet.id}-${index}`}>
                {renderTweet({ ...tweet, id: `${tweet.id}-${index}` })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Strip 2 - Right to Left (Ethereum & DeFi) */}
        <div className="tweet-strip">
          <div className="tweet-track scroll-left">
            {[...tweets2, ...tweets2].map((tweet, index) => (
              <React.Fragment key={`${tweet.id}-${index}`}>
                {renderTweet({ ...tweet, id: `${tweet.id}-${index}` })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Strip 3 - Left to Right (Web3, NFTs & Metaverse) */}
        <div className="tweet-strip">
          <div className="tweet-track scroll-right">
            {[...tweets3, ...tweets3].map((tweet, index) => (
              <React.Fragment key={`${tweet.id}-${index}`}>
                {renderTweet({ ...tweet, id: `${tweet.id}-${index}` })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TweetHero;

