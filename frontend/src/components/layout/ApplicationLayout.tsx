import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import './ApplicationLayout.scss';

const ApplicationLayout: React.FC = () => {
  return (
    <div className="application-layout">
      <Sidebar />
      <div className="application-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ApplicationLayout;

