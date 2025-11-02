import telegramService from '../services/telegramService.js';

// @desc    Get trending channels
// @route   GET /api/telegram/trending
// @access  Private
export const getTrendingChannels = async (req, res) => {
  try {
    const channels = await telegramService.getTrendingChannels();
    
    res.status(200).json({
      success: true,
      count: channels.length,
      data: channels
    });
  } catch (error) {
    console.error('Get trending channels error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending channels',
      error: error.message
    });
  }
};

// @desc    Get trending coins from messages
// @route   GET /api/telegram/trending-coins
// @access  Private
export const getTrendingCoins = async (req, res) => {
  try {
    const trendingCoins = await telegramService.getTrendingCoins();
    
    res.status(200).json({
      success: true,
      count: trendingCoins.length,
      data: trendingCoins
    });
  } catch (error) {
    console.error('Get trending coins error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending coins',
      error: error.message
    });
  }
};

// @desc    Search messages in channels
// @route   GET /api/telegram/search
// @access  Private
export const searchMessages = async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const results = await telegramService.searchMessages(
      query,
      parseInt(limit) || 50
    );
    
    res.status(200).json({
      success: true,
      count: results.length,
      query: query,
      data: results
    });
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching messages',
      error: error.message
    });
  }
};

// @desc    Get channel statistics
// @route   GET /api/telegram/channel/:username
// @access  Private
export const getChannelStats = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Channel username is required'
      });
    }

    const stats = await telegramService.getChannelStats(username);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get channel stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching channel statistics',
      error: error.message
    });
  }
};

// @desc    Connect to Telegram
// @route   POST /api/telegram/connect
// @access  Private
export const connectTelegram = async (req, res) => {
  try {
    await telegramService.connect();
    
    res.status(200).json({
      success: true,
      message: 'Telegram connected successfully'
    });
  } catch (error) {
    console.error('Connect telegram error:', error);
    res.status(500).json({
      success: false,
      message: 'Error connecting to Telegram',
      error: error.message
    });
  }
};

