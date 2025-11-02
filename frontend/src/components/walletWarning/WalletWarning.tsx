import React from 'react';
import { useWallet } from '../../context/WalletContext';
import './WalletWarning.scss';

const WalletWarning: React.FC = () => {
  const { account, connectWallet, isConnecting } = useWallet();

  // Wallet bağlıysa hiçbir şey gösterme
  if (account) {
    return null;
  }

  return (
    <div className="wallet-warning">
      <div className="wallet-warning-content">
        <div className="wallet-warning-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="wallet-warning-text">
          <h4>MetaMask Bağlı Değil</h4>
          <p>Bazı özelliklerden faydalanmak için lütfen MetaMask cüzdanınızı bağlayın.</p>
        </div>
        <button 
          className="wallet-warning-button" 
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Bağlanıyor...' : 'MetaMask Bağla'}
        </button>
      </div>
    </div>
  );
};

export default WalletWarning;

