import React from 'react';
import { Outlet } from 'react-router-dom';
import WalletWarning from '../walletWarning/WalletWarning';
import './ApplicationLayout.scss';

const ApplicationLayout: React.FC = () => {
  return (
    <div className="application-layout">
      <div className="application-content">
        <WalletWarning />
        <Outlet />
      </div>
    </div>
  );
};

export default ApplicationLayout;

