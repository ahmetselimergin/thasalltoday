import express from 'express';
import {
  getTrendingChannels,
  getTrendingCoins,
  searchMessages,
  getChannelStats,
  connectTelegram
} from '../controllers/telegramController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/trending', getTrendingChannels);
router.get('/trending-coins', getTrendingCoins);
router.get('/search', searchMessages);
router.get('/channel/:username', getChannelStats);
router.post('/connect', connectTelegram);

export default router;

