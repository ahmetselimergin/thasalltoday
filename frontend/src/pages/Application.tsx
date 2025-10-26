import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { BrowserProvider } from 'ethers';
import './Application.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Application: React.FC = () => {
  const { account, formatAddress } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (account) {
      fetchWalletData();
    }
  }, [account]);

  const fetchWalletData = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new BrowserProvider(window.ethereum);
        
        const balance = await provider.getBalance(account);
        setBalance((Number(balance) / 1e18).toFixed(4));

        const network = await provider.getNetwork();
        setNetwork(network.name.charAt(0).toUpperCase() + network.name.slice(1));
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      <Container>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <Row className="quick-stats">
              <Col md={4}>
                <div className="stat-card">
                  <div className="stat-icon">👤</div>
                  <h3>Account</h3>
                  <p className="stat-value">{formatAddress(account)}</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-card balance-card">
                  <div className="stat-icon">💰</div>
                  <h3>Balance</h3>
                  <p className="stat-value">{balance} ETH</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-card">
                  <div className="stat-icon">🌐</div>
                  <h3>Network</h3>
                  <p className="stat-value">{network}</p>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Application;

