import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import './OnchainAnalysis.scss';

// Crypto icons
import btcIcon from 'cryptocurrency-icons/svg/color/btc.svg';
import ethIcon from 'cryptocurrency-icons/svg/color/eth.svg';
import solIcon from 'cryptocurrency-icons/svg/color/sol.svg';
import adaIcon from 'cryptocurrency-icons/svg/color/ada.svg';
import dotIcon from 'cryptocurrency-icons/svg/color/dot.svg';
import bnbIcon from 'cryptocurrency-icons/svg/color/bnb.svg';
import maticIcon from 'cryptocurrency-icons/svg/color/matic.svg';
import avaxIcon from 'cryptocurrency-icons/svg/color/avax.svg';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: string;
  change24h: number;
  marketCap: string;
  volume24h: string;
  whaleActivity: number;
  activeAddresses: string;
  gasPrice: string;
  tvl: string;
}

const OnchainAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const allCoins: CoinData[] = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: btcIcon,
      price: '$45,234',
      change24h: 5.2,
      marketCap: '$880B',
      volume24h: '$28.5B',
      whaleActivity: 85,
      activeAddresses: '1.2M',
      gasPrice: 'N/A',
      tvl: 'N/A'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: ethIcon,
      price: '$2,456',
      change24h: 3.8,
      marketCap: '$295B',
      volume24h: '$15.2B',
      whaleActivity: 78,
      activeAddresses: '543K',
      gasPrice: '35 Gwei',
      tvl: '$45.2B'
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      icon: solIcon,
      price: '$98.45',
      change24h: -1.2,
      marketCap: '$42B',
      volume24h: '$3.8B',
      whaleActivity: 62,
      activeAddresses: '187K',
      gasPrice: '0.00001 SOL',
      tvl: '$8.4B'
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      icon: bnbIcon,
      price: '$312.45',
      change24h: 2.1,
      marketCap: '$48B',
      volume24h: '$1.2B',
      whaleActivity: 55,
      activeAddresses: '432K',
      gasPrice: '3 Gwei',
      tvl: '$12.8B'
    },
    {
      id: 'ada',
      name: 'Cardano',
      symbol: 'ADA',
      icon: adaIcon,
      price: '$0.52',
      change24h: -4.5,
      marketCap: '$18B',
      volume24h: '$420M',
      whaleActivity: 48,
      activeAddresses: '98K',
      gasPrice: '0.17 ADA',
      tvl: '$450M'
    },
    {
      id: 'dot',
      name: 'Polkadot',
      symbol: 'DOT',
      icon: dotIcon,
      price: '$7.23',
      change24h: 8.7,
      marketCap: '$9.5B',
      volume24h: '$285M',
      whaleActivity: 41,
      activeAddresses: '45K',
      gasPrice: 'N/A',
      tvl: '$2.1B'
    },
    {
      id: 'matic',
      name: 'Polygon',
      symbol: 'MATIC',
      icon: maticIcon,
      price: '$0.85',
      change24h: 6.3,
      marketCap: '$7.8B',
      volume24h: '$380M',
      whaleActivity: 52,
      activeAddresses: '321K',
      gasPrice: '25 Gwei',
      tvl: '$8.4B'
    },
    {
      id: 'avax',
      name: 'Avalanche',
      symbol: 'AVAX',
      icon: avaxIcon,
      price: '$38.50',
      change24h: 4.2,
      marketCap: '$14.2B',
      volume24h: '$520M',
      whaleActivity: 58,
      activeAddresses: '156K',
      gasPrice: '25 nAVAX',
      tvl: '$4.2B'
    }
  ];

  const filteredCoins = allCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (coinId: string) => {
    setFavorites(prev =>
      prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin);
  };

  // Generate mock chart data based on selected coin
  const generatePriceData = (coin: CoinData) => {
    const basePrice = parseFloat(coin.price.replace(/[$,]/g, ''));
    const data: Array<{ x: number; y: number }> = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = Date.now() - i * 24 * 60 * 60 * 1000;
      const variance = (Math.random() - 0.5) * basePrice * 0.1;
      data.push({
        x: date,
        y: parseFloat((basePrice + variance).toFixed(2))
      });
    }
    return data;
  };

  const generateVolumeData = () => {
    const data: Array<{ x: number; y: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const date = Date.now() - i * 24 * 60 * 60 * 1000;
      data.push({
        x: date,
        y: Math.floor(Math.random() * 50000000) + 10000000
      });
    }
    return data;
  };

  const generateWhaleData = () => {
    const data: Array<{ x: number; y: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = Date.now() - i * 24 * 60 * 60 * 1000;
      data.push({
        x: date,
        y: Math.floor(Math.random() * 50) + 30
      });
    }
    return data;
  };

  // Chart configurations
  const priceChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true
        }
      }
    },
    theme: {
      mode: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#0194FE'],
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#8e8e93'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8e93'
        },
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    grid: {
      borderColor: '#2d2d44',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy'
      }
    }
  };

  const volumeChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 250,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#667eea'],
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#8e8e93'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8e93'
        },
        formatter: (value) => `$${(value / 1000000).toFixed(1)}M`
      }
    },
    grid: {
      borderColor: '#2d2d44',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => `$${(value / 1000000).toFixed(2)}M`
      }
    }
  };

  const whaleChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 250,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
      colors: ['#f093fb'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    colors: ['#f093fb'],
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#8e8e93'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8e93'
        },
        formatter: (value) => `${value}%`
      }
    },
    grid: {
      borderColor: '#2d2d44',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => `${value}% Activity`
      }
    }
  };

  return (
    <div className="onchain-analysis-page">
      <Container fluid>
        <Row>
          {/* Left Sidebar - Coin List */}
          <Col lg={4} xl={3} className="coin-sidebar">
            <div className="sidebar-card">
              {/* Search */}
              <div className="search-section">
                <input
                  type="text"
                  className="coin-search"
                  placeholder="🔍 Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Coin List */}
              <div className="coin-list">
                {filteredCoins.map(coin => (
                  <div
                    key={coin.id}
                    className={`coin-item ${selectedCoin?.id === coin.id ? 'active' : ''}`}
                    onClick={() => handleCoinSelect(coin)}
                  >
                    <div className="coin-info">
                      <img src={coin.icon} alt={coin.symbol} className="coin-icon" />
                      <div className="coin-details">
                        <h4>{coin.name}</h4>
                        <span className="coin-symbol">{coin.symbol}</span>
                      </div>
                    </div>
                    <div className="coin-actions">
                      <span className={`price-change ${coin.change24h > 0 ? 'positive' : 'negative'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                      </span>
                      <button
                        className={`favorite-btn ${favorites.includes(coin.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(coin.id);
                        }}
                      >
                        {favorites.includes(coin.id) ? '⭐' : '☆'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right Panel - Analysis */}
          <Col lg={8} xl={9} className="analysis-panel">
            {selectedCoin ? (
              <div className="analysis-content">
                {/* Header */}
                <div className="analysis-header">
                  <div className="coin-title">
                    <img src={selectedCoin.icon} alt={selectedCoin.symbol} className="header-icon" />
                    <div>
                      <h2>{selectedCoin.name}</h2>
                      <span className="header-symbol">{selectedCoin.symbol}</span>
                    </div>
                  </div>
                  <div className="coin-price-section">
                    <div className="current-price">{selectedCoin.price}</div>
                    <span className={`price-badge ${selectedCoin.change24h > 0 ? 'positive' : 'negative'}`}>
                      {selectedCoin.change24h > 0 ? '↑' : '↓'} {Math.abs(selectedCoin.change24h)}%
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Market Cap</span>
                    <span className="metric-value">{selectedCoin.marketCap}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">24h Volume</span>
                    <span className="metric-value">{selectedCoin.volume24h}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Active Addresses</span>
                    <span className="metric-value">{selectedCoin.activeAddresses}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Gas Price</span>
                    <span className="metric-value">{selectedCoin.gasPrice}</span>
                  </div>
                </div>

                {/* Price Chart */}
                <div className="chart-section">
                  <h3>📈 Price Chart (30 Days)</h3>
                  <div className="chart-container">
                    <Chart
                      options={priceChartOptions}
                      series={[{
                        name: `${selectedCoin.symbol} Price`,
                        data: generatePriceData(selectedCoin)
                      }]}
                      type="area"
                      height={350}
                    />
                  </div>
                </div>

                {/* Trading Volume Chart */}
                <div className="chart-section">
                  <h3>📊 Trading Volume (30 Days)</h3>
                  <div className="chart-container">
                    <Chart
                      options={volumeChartOptions}
                      series={[{
                        name: 'Volume',
                        data: generateVolumeData()
                      }]}
                      type="bar"
                      height={250}
                    />
                  </div>
                </div>

                {/* Whale Activity Chart */}
                <div className="chart-section">
                  <h3>🐋 Whale Activity Trend (7 Days)</h3>
                  <div className="chart-container">
                    <Chart
                      options={whaleChartOptions}
                      series={[{
                        name: 'Whale Activity',
                        data: generateWhaleData()
                      }]}
                      type="line"
                      height={250}
                    />
                  </div>
                </div>

                {/* Whale Activity */}
                <div className="analysis-section">
                  <h3>🐋 Whale Activity</h3>
                  <div className="whale-indicator">
                    <div className="whale-bar">
                      <div
                        className="whale-fill"
                        style={{ width: `${selectedCoin.whaleActivity}%` }}
                      >
                        <span className="whale-percentage">{selectedCoin.whaleActivity}%</span>
                      </div>
                    </div>
                    <p className="whale-description">
                      {selectedCoin.whaleActivity > 70 ? 'Very High' :
                       selectedCoin.whaleActivity > 50 ? 'High' :
                       selectedCoin.whaleActivity > 30 ? 'Moderate' : 'Low'} whale activity detected
                    </p>
                  </div>
                </div>

                {/* Network Stats */}
                {selectedCoin.tvl !== 'N/A' && (
                  <div className="analysis-section">
                    <h3>📊 DeFi Stats</h3>
                    <div className="defi-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total Value Locked</span>
                        <span className="stat-value-large">{selectedCoin.tvl}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Transactions */}
                <div className="analysis-section">
                  <h3>📝 Recent Large Transactions</h3>
                  <div className="transactions-list">
                    <div className="transaction-item buy">
                      <div className="tx-badge">BUY</div>
                      <div className="tx-details">
                        <span className="tx-amount">1,234.56 {selectedCoin.symbol}</span>
                        <span className="tx-wallet">0x742d...4d2a</span>
                      </div>
                      <span className="tx-time">5 min ago</span>
                    </div>
                    <div className="transaction-item sell">
                      <div className="tx-badge">SELL</div>
                      <div className="tx-details">
                        <span className="tx-amount">890.12 {selectedCoin.symbol}</span>
                        <span className="tx-wallet">0x8b3f...9c1e</span>
                      </div>
                      <span className="tx-time">12 min ago</span>
                    </div>
                    <div className="transaction-item buy">
                      <div className="tx-badge">BUY</div>
                      <div className="tx-details">
                        <span className="tx-amount">567.89 {selectedCoin.symbol}</span>
                        <span className="tx-wallet">0x3a21...7f8d</span>
                      </div>
                      <span className="tx-time">28 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Select a coin to view analysis</h3>
                <p>Choose a cryptocurrency from the list to see detailed onchain metrics</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OnchainAnalysis;
