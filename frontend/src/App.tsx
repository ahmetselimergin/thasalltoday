import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/navigation/main';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationLayout from './components/layout/ApplicationLayout';
import Home from './pages/Home';
import Application from './pages/Application';
import TelegramTrends from './pages/TelegramTrends';
import TwitterTrends from './pages/TwitterTrends';
import OnchainAnalysis from './pages/OnchainAnalysis';
import Profile from './pages/Profile';
import WalletDetails from './pages/WalletDetails';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
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
