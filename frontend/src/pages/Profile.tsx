import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import WalletWarning from '../components/walletWarning/WalletWarning';
import './Profile.scss';
import Container from 'react-bootstrap/Container';

const Profile: React.FC = () => {
  const { account, formatAddress, disconnectWallet } = useWallet();
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-container">
          <h1>Profile</h1>
          
          <WalletWarning />
          
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user?.name.slice(0, 2).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="profile-info">
              <h2>User Information</h2>
              <div className="info-group">
                <label>Name:</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>
              {account && (
                <>
                  <h2 style={{ marginTop: '2rem' }}>Wallet Address</h2>
                  <p className="address-full">{account}</p>
                  <p className="address-short">{formatAddress(account)}</p>
                </>
              )}
            </div>
            {account && (
              <div className="profile-actions">
                <button className="btn-disconnect" onClick={disconnectWallet}>
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;

