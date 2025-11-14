import express from 'express';
import {
  getTrendingChannels,
  getTrendingCoins,
  getTrendingTopics,
  searchMessages,
  getChannelStats,
  connectTelegram,
  clearCache
} from '../controllers/telegramController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/trending', getTrendingChannels);
router.get('/trending-coins', getTrendingCoins);
router.get('/trending-topics', getTrendingTopics);
router.get('/search', searchMessages);
router.get('/channel/:username', getChannelStats);
router.post('/connect', connectTelegram);
router.post('/clear-cache', clearCache);

export default router;

