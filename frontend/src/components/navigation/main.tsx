import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { useWallet } from '../../context/WalletContext';

const Navigation: React.FC = () => {
  const { account, isConnecting, connectWallet, formatAddress, disconnectWallet } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" bg="dark" className={`tdy-navigation ${isScrolled ? 'scrolled' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} to="/">ThatsAllToday</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='ms-auto'>
            {account && (
              <Nav.Link as={Link} to="/application" className="nav-app-link">
                Application
              </Nav.Link>
            )}
            <Nav.Link className='tdy-border-button' eventKey={2}>
              <span className='tdy-border-button-text-span'>
                {account ? formatAddress(account) : 'Not Connected'}
              </span>
              {account ? (
                <div className="wallet-dropdown" ref={dropdownRef}>
                  <Button 
                    className='tdy-border-button-text'
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    Connected
                  </Button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <span className="dropdown-icon">👤</span>
                        Profile
                      </Link>
                      <Link to="/wallet-details" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <span className="dropdown-icon">💳</span>
                        Wallet Details
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item disconnect" onClick={handleDisconnect}>
                        <span className="dropdown-icon">🚪</span>
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  className='tdy-border-button-text'
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
