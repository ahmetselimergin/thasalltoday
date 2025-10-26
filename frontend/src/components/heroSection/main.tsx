import React from 'react';
import './style.scss';
import Button from 'react-bootstrap/esm/Button';
import { useWallet } from '../../context/WalletContext';

const HeroSection: React.FC = () => {
  const { account, isConnecting, connectWallet } = useWallet();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to That's All Today</h1>
        <p>Your amazing content goes here</p>
        
        {account ? (
          <Button className='tdy-border-button-text' disabled>
            Connected
          </Button>
        ) : (
          <Button 
            className='tdy-border-button-text' 
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

