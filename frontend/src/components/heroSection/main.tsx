import React from 'react';
import './style.scss';
import Button from 'react-bootstrap/esm/Button';
import { useWallet } from '../../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { account, isConnecting, connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (account) {
      navigate('/application');
    } else {
      connectWallet();
    }
  };

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
      ),
      title: 'Telegram Trends',
      description: 'Real-time crypto signals and trends from 12+ premium Telegram channels',
      gradient: 'linear-gradient(135deg, #0088cc 0%, #00b4d8 100%)',
      iconBg: 'rgba(0, 136, 204, 0.15)'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      title: 'Twitter Analytics',
      description: 'Track trending crypto topics and influencer sentiment on Twitter',
      gradient: 'linear-gradient(135deg, #1da1f2 0%, #0d8bd9 100%)',
      iconBg: 'rgba(29, 161, 242, 0.15)'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: 'Onchain Analysis',
      description: 'Deep blockchain analytics and whale movement tracking',
      gradient: 'linear-gradient(135deg, #f7931a 0%, #ff9500 100%)',
      iconBg: 'rgba(247, 147, 26, 0.15)'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      title: 'Multi-Source Data',
      description: 'Aggregated insights from multiple trusted crypto data sources',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      iconBg: 'rgba(139, 92, 246, 0.15)'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
      ),
      title: 'Real-Time Alerts',
      description: 'Instant notifications for significant market movements and opportunities',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      iconBg: 'rgba(251, 191, 36, 0.15)'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      title: 'Secure & Private',
      description: 'MetaMask integration with secure wallet connection and data privacy',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      iconBg: 'rgba(16, 185, 129, 0.15)'
    }
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to That's All Today</h1>
        <p>Your amazing content goes here</p>
        
        <Button 
          className='tdy-border-button-text' 
          onClick={handleButtonClick}
          disabled={isConnecting}
        >
          {isConnecting 
            ? 'Connecting...' 
            : account 
              ? 'Go to Application' 
              : 'Connect Wallet to Application'
          }
        </Button>
      </div>

      {/* Features Section */}
      <div className="features-container">
        <h2 className="features-title">
          <span className="gradient-text">Crypto Community Pulse</span>
        </h2>
        <p className="features-subtitle">Hot takes from the blockchain ecosystem</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{
                borderColor: feature.gradient.match(/#[a-f0-9]{6}/gi)?.[0] + '40',
              }}
            >
              <div 
                className="feature-icon"
                style={{
                  background: feature.iconBg,
                  color: feature.gradient.match(/#[a-f0-9]{6}/gi)?.[0]
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div 
                className="feature-glow"
                style={{ background: feature.gradient }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

