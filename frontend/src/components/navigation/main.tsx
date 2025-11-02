import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import './style.scss';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { account, connectWallet, formatAddress, disconnectWallet } = useWallet();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/application',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      label: 'Dashboard',
      exact: true,
      requiresWallet: false
    },
    {
      path: '/application/telegram',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
      ),
      label: 'Telegram Trends',
      requiresWallet: true
    },
    {
      path: '/application/twitter',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      label: 'Twitter Trends',
      requiresWallet: true
    },
    {
      path: '/application/onchain',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      label: 'Onchain Analysis',
      requiresWallet: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    disconnectWallet();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" bg="dark" className={`tdy-navigation ${isScrolled ? 'scrolled' : ''}`}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/">ThatsAllToday</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='ms-auto'>
            {isAuthenticated && (
              <>
                {/* Application Menu Items */}
                {menuItems.map((item) => {
                  const isDisabled = item.requiresWallet && !account;
                  
                  return (
                    <Nav.Link
                      key={item.path}
                      as={NavLink}
                      to={isDisabled ? '#' : item.path}
                      end={item.exact}
                      className={`nav-menu-item ${isDisabled ? 'disabled' : ''}`}
                      onClick={(e: React.MouseEvent) => {
                        if (isDisabled) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span className="nav-menu-icon">{item.icon}</span>
                      <span className="nav-menu-label">{item.label}</span>
                      {isDisabled && (
                        <span className="nav-lock-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </span>
                      )}
                    </Nav.Link>
                  );
                })}
              </>
            )}
            <Nav.Link className='tdy-border-button'>
              {isAuthenticated ? (
                <>
                  <span className='tdy-border-button-text-span'>
                    {account ? formatAddress(account) : user?.name || 'Not Connected'}
                  </span>
                  <div 
                    className="wallet-dropdown" 
                    ref={dropdownRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button 
                      className='tdy-border-button-text'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDropdown(!showDropdown);
                      }}
                    >
                      {account ? 'Connected' : 'Connect Wallet'}
                    </Button>
                    {showDropdown && (
                      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        {account && (
                          <>
                            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                              <span className="dropdown-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                              </span>
                              Profile
                            </Link>
                            <Link to="/wallet-details" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                              <span className="dropdown-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                  <path d="M7 15h0M2 9.5h20"></path>
                                </svg>
                              </span>
                              Wallet Details
                            </Link>
                            <button className="dropdown-item" onClick={handleDisconnect}>
                              <span className="dropdown-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                  <polyline points="16 17 21 12 16 7"></polyline>
                                  <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                              </span>
                              Disconnect Wallet
                            </button>
                            <div className="dropdown-divider"></div>
                          </>
                        )}
                        {!account && (
                          <button className="dropdown-item" onClick={() => {
                            connectWallet();
                            setShowDropdown(false);
                          }}>
                            <span className="dropdown-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="M7 15h0M2 9.5h20"></path>
                              </svg>
                            </span>
                            Connect Wallet
                          </button>
                        )}
                        <button className="dropdown-item disconnect" onClick={handleLogout}>
                          <span className="dropdown-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                          </span>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button className='tdy-border-button-text me-2'>
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className='tdy-border-button-text'>
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
