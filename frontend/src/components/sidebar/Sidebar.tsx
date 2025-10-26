import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      path: '/application',
      icon: '🏠',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/application/telegram',
      icon: '✈️',
      label: 'Telegram Gündem'
    },
    {
      path: '/application/twitter',
      icon: '🐦',
      label: 'Twitter Gündem'
    },
    {
      path: '/application/onchain',
      icon: '⛓️',
      label: 'Onchain Analiz'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

