import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { BrowserProvider } from 'ethers';
import './Application.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Application: React.FC = () => {
  const { account } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<string>('ETH');
  const [stakedBalance] = useState<string>('125.50');
  const [rewards] = useState<string>('8.42');
  const [apy] = useState<string>('12.5');

  const availableCoins = ['ETH', 'BTC', 'USDT', 'BNB', 'SOL'];

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
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    // Stake logic will be implemented here
    console.log('Staking:', stakeAmount);
    alert(`Staking ${stakeAmount} ETH...`);
    setStakeAmount('');
  };

  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    // Unstake logic will be implemented here
    console.log('Unstaking:', unstakeAmount);
    alert(`Unstaking ${unstakeAmount} ETH...`);
    setUnstakeAmount('');
  };

  const handleClaimRewards = () => {
    // Claim rewards logic will be implemented here
    console.log('Claiming rewards:', rewards);
    alert(`Claiming ${rewards} ETH rewards...`);
  };

  const setMaxStake = () => {
    setStakeAmount(balance);
  };

  const setMaxUnstake = () => {
    setUnstakeAmount(stakedBalance);
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
              <Col md={3}>
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8"></circle>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3>Available</h3>
                  <p className="stat-value">{balance} {selectedCoin}</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card staked-card">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h3>Staked</h3>
                  <p className="stat-value">{stakedBalance} {selectedCoin}</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card rewards-card">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <polyline points="12 12 12 22"></polyline>
                    </svg>
                  </div>
                  <h3>Rewards</h3>
                  <p className="stat-value">{rewards} {selectedCoin}</p>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card apy-card">
                  <div className="stat-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                  </div>
                  <h3>APY</h3>
                  <p className="stat-value">{apy}%</p>
                </div>
              </Col>
            </Row>

            {/* Staking Section */}
            <Row className="staking-section">
              <Col lg={6}>
                <div className="stake-card">
                  <div className="stake-header">
                    <h2>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      Stake Crypto
                    </h2>
                    <p className="subtitle">Lock your crypto to earn rewards</p>
                  </div>
                  
                  <div className="stake-body">
                    <div className="input-group-custom">
                      <label>Select Coin</label>
                      <select 
                        className="coin-select" 
                        value={selectedCoin} 
                        onChange={(e) => setSelectedCoin(e.target.value)}
                      >
                        {availableCoins.map((coin) => (
                          <option key={coin} value={coin}>{coin}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group-custom">
                      <label>Amount to Stake</label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="0.0"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="stake-input"
                        />
                        <button className="max-btn" onClick={setMaxStake}>MAX</button>
                      </div>
                      <span className="balance-info">Available: {balance} {selectedCoin}</span>
                    </div>

                    <Button className="stake-btn" onClick={handleStake}>
                      <span>Stake Now</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <div className="unstake-card">
                  <div className="stake-header">
                    <h2>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M16 12H8M12 8v8"/>
                      </svg>
                      Unstake & Claim
                    </h2>
                    <p className="subtitle">Withdraw your staked ETH and rewards</p>
                  </div>
                  
                  <div className="stake-body">
                    <div className="input-group-custom">
                      <label>Amount to Unstake</label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          placeholder="0.0"
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                          className="stake-input"
                        />
                        <button className="max-btn" onClick={setMaxUnstake}>MAX</button>
                      </div>
                      <span className="balance-info">Staked: {stakedBalance} {selectedCoin}</span>
                    </div>

                    <div className="action-buttons">
                      <Button className="unstake-btn" onClick={handleUnstake}>
                        <span>Unstake</span>
                      </Button>
                      <Button className="claim-btn" onClick={handleClaimRewards}>
                        <span>Claim {rewards} {selectedCoin}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
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

