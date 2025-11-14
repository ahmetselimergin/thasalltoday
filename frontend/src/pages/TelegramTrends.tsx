import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { telegramAPI } from '../services/api';
import TrendingCoins from '../components/trendingCoins/main';
import './TelegramTrends.scss';

const TelegramTrends: React.FC = () => {
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrendingChannels();
  }, []);

  const fetchTrendingChannels = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const response = await telegramAPI.getTrending();
      if (response.success) {
        setChannels(response.data);
        // İlk kanalı otomatik seç
        if (response.data.length > 0) {
          setSelectedChannel(response.data[0]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching channels:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch Telegram data';
      setError(errorMessage);
      
      // Log detailed error for debugging
      console.error('Full error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="telegram-trends-page">
      <Container fluid>

        {/* Trending Section - Coins & Topics Side by Side */}
        <div className="row trending-row">
          <div className="col-12 trending-col">
            <TrendingCoins />
          </div>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Telegram data...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchTrendingChannels}>Retry</button>
          </div>
        )}

        {!loading && !error && channels.length > 0 && (
          <div className="telegram-layout">
            {/* Sol taraf - Kanallar Listesi */}
            <div className="channels-sidebar">
              <h2>📱 Monitored Channels</h2>
              <div className="channels-list">
                {channels.map((channel, index) => (
                  <div 
                    key={index} 
                    className={`channel-item ${selectedChannel?.username === channel.username ? 'active' : ''}`}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <div className="channel-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div className="channel-info">
                      <h3>{channel.title}</h3>
                      <span className="channel-username">{channel.username}</span>
                      <div className="channel-meta">
                        <span>💬Last {channel.recentMessages?.length || 0} messages</span>
                      </div>
                    </div>
                    {selectedChannel?.username === channel.username && (
                      <div className="active-indicator"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ taraf - Mesajlar */}
            <div className="messages-content">
              {selectedChannel ? (
                <>
                  <div className="content-header">
                    <div className="channel-details">
                      <h2>{selectedChannel.title}</h2>
                      <span className="channel-username">{selectedChannel.username}</span>
                    </div>
                    <div className="channel-stats-header">
                      <div className="stat-badge">
                        <span className="stat-icon">💬</span>
                        <span className="stat-label text-capitalize">Last</span>
                        <span className="stat-value">{selectedChannel.recentMessages?.length || 0}</span>
                        <span className="stat-label">messages</span>
                      </div>
                    </div>
                  </div>

                  <div className="messages-list">
                    {selectedChannel.recentMessages && selectedChannel.recentMessages.length > 0 ? (
                      selectedChannel.recentMessages.map((message: any, idx: number) => (
                        <div key={idx} className="message-card">
                          <div className="message-header">
                            <span className="message-number">#{idx + 1}</span>
                            <span className="message-time">{formatDate(message.date)}</span>
                          </div>
                          <div className="message-body">
                            <p>{message.text || 'No content'}</p>
                          </div>
                          <div className="message-footer">
                            <span className="message-views">
                              👁️ {message.views?.toLocaleString() || 0} views
                            </span>
                            <a 
                              href={`https://t.me/${selectedChannel.username.replace('@', '')}/${message.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-telegram-btn"
                            >
                              View in Telegram →
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-messages">
                        <p>No messages available for this channel</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="no-channel-selected">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3>Select a channel to view messages</h3>
                  <p>Choose a channel from the left sidebar to see recent messages</p>
                </div>
              )}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};

export default TelegramTrends;
