import React, { useState, useEffect } from 'react';
import './style.scss';
import { telegramAPI } from '../../services/api';

interface TrendingTopic {
  topic: string;
  type: 'keyword' | 'phrase';
  mentions: number;
}

const TrendingTopics: React.FC = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTrendingTopics();
    // Her 15 dakikada bir güncelle (cache TTL ile senkron)
    const interval = setInterval(fetchTrendingTopics, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      const response = await telegramAPI.getTrendingTopics();
      if (response.success) {
        setTrendingTopics(response.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicIcon = (type: string, index: number) => {
    if (type === 'phrase') return '💬';
    
    // Different icons for top keywords
    const icons = ['🔥', '⚡', '💡', '🎯', '⭐', '🚀', '💎', '📌', '🌟', '✨'];
    return icons[index] || '📊';
  };

  const getTopicColor = (index: number) => {
    // Gradient colors for top topics
    if (index === 0) return 'var(--gradient-primary)';
    if (index === 1) return 'var(--gradient-secondary)';
    if (index === 2) return 'var(--gradient-tertiary)';
    return 'rgba(1, 148, 254, 0.8)';
  };

  return (
    <div className="trending-topics-container">
      <div className="section-header">
        <h2 className="section-title">
          <span className="gradient-text">📌 Trending Topics</span>
        </h2>
        <p className="section-subtitle">
          Most discussed topics in crypto channels (last 48 hours)
          {lastUpdate && (
            <span className="last-update"> • Last updated: {lastUpdate.toLocaleTimeString()}</span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="topics-loading">
          <div className="spinner-small"></div>
          <span>Loading trending topics...</span>
        </div>
      ) : trendingTopics.length === 0 ? (
        <div className="no-topics">
          <p>No trending topics found. Check back later!</p>
        </div>
      ) : (
        <div className="topics-grid">
          {trendingTopics.map((topic, index) => (
            <div 
              key={`${topic.topic}-${index}`} 
              className={`topic-card ${index < 3 ? 'top-topic' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="topic-rank" style={{ background: getTopicColor(index) }}>
                #{index + 1}
              </div>
              <div className="topic-icon">
                {getTopicIcon(topic.type, index)}
              </div>
              <div className="topic-info">
                <h3 className="topic-name" title={topic.topic}>
                  {topic.topic}
                </h3>
                <div className="topic-meta">
                  <span className="topic-mentions">
                    {topic.mentions} mentions
                  </span>
                  <span className="topic-type">
                    {topic.type === 'phrase' ? '2-word phrase' : 'keyword'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingTopics;

