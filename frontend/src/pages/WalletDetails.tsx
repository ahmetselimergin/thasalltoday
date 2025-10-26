import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { BrowserProvider } from 'ethers';
import './WalletDetails.scss';
import Container from 'react-bootstrap/Container';

const WalletDetails: React.FC = () => {
  const { account, formatAddress } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (account) {
      fetchWalletDetails();
    }
  }, [account]);

  const fetchWalletDetails = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum);
        
        // Bakiye al
        const balance = await provider.getBalance(account);
        setBalance((Number(balance) / 1e18).toFixed(4));

        // Network bilgisi al
        const network = await provider.getNetwork();
        setNetwork(network.name.charAt(0).toUpperCase() + network.name.slice(1));
      }
    } catch (error) {
      console.error('Error fetching wallet details:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Adres kopyalandı!');
  };

  if (!account) {
    return (
      <div className="wallet-details-page">
        <Container>
          <div className="wallet-details-container">
            <h1>Wallet Details</h1>
            <p className="no-wallet">Please connect your wallet first.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="wallet-details-page">
      <Container>
        <div className="wallet-details-container">
          <h1>Wallet Details</h1>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="details-grid">
              <div className="detail-card">
                <h3>Address</h3>
                <div className="address-box">
                  <p className="address-full">{account}</p>
                  <button className="btn-copy" onClick={() => copyToClipboard(account)}>
                    Copy
                  </button>
                </div>
              </div>

              <div className="detail-card">
                <h3>Balance</h3>
                <div className="balance-box">
                  <p className="balance-amount">{balance} ETH</p>
                </div>
              </div>

              <div className="detail-card">
                <h3>Network</h3>
                <div className="network-box">
                  <p className="network-name">{network}</p>
                </div>
              </div>

              <div className="detail-card">
                <h3>Short Address</h3>
                <div className="short-address-box">
                  <p className="address-short">{formatAddress(account)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default WalletDetails;

