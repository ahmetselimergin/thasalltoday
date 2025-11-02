import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/navigation/main';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationLayout from './components/layout/ApplicationLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Application from './pages/Application';
import TelegramTrends from './pages/TelegramTrends';
import TwitterTrends from './pages/TwitterTrends';
import OnchainAnalysis from './pages/OnchainAnalysis';
import Profile from './pages/Profile';
import WalletDetails from './pages/WalletDetails';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-content">
          <div className="loader-logo">
            <div className="logo-circle"></div>
            <div className="logo-pulse"></div>
          </div>
          <h2 className="loader-title">That's All Today</h2>
          <div className="loader-spinner">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/application" 
          element={
            <ProtectedRoute>
              <ApplicationLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Application />} />
          <Route path="telegram" element={<TelegramTrends />} />
          <Route path="twitter" element={<TwitterTrends />} />
          <Route path="onchain" element={<OnchainAnalysis />} />
        </Route>
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet-details" 
          element={
            <ProtectedRoute>
              <WalletDetails />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
