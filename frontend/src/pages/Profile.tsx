import React from 'react';
import { useWallet } from '../context/WalletContext';
import './Profile.scss';
import Container from 'react-bootstrap/Container';

const Profile: React.FC = () => {
  const { account, formatAddress, disconnectWallet } = useWallet();

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {account && account.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="profile-info">
              <h2>Wallet Address</h2>
              <p className="address-full">{account}</p>
              <p className="address-short">{account && formatAddress(account)}</p>
            </div>
            <div className="profile-actions">
              <button className="btn-disconnect" onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;

