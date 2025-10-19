import React from 'react';
import './style.scss';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { useWallet } from '../../context/WalletContext';

const Navigation: React.FC = () => {
  const { account, isConnecting, connectWallet, formatAddress } = useWallet();

  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" bg="dark"  className="tdy-navigation">
    <Container>
      <Navbar.Brand href="#home">ThatsAllToday</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" >
        <Nav className='ms-auto'>
          <Nav.Link className='tdy-border-button' eventKey={2} href="#">
            <span className='tdy-border-button-text-span'>
              {account ? formatAddress(account) : 'Not Connected'}
            </span>
            <Button 
              className='tdy-border-button-text'
              onClick={connectWallet}
              disabled={isConnecting || !!account}
            >
              {isConnecting ? 'Connecting...' : account ? 'Connected' : 'Connect Wallet'}
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default Navigation;