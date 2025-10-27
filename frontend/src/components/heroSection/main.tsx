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
    </section>
  );
};

export default HeroSection;

