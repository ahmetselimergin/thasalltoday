import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateWallet: async (walletAddress: string) => {
    const response = await api.put('/auth/wallet', { walletAddress });
    return response.data;
  },
};

// Telegram API calls
export const telegramAPI = {
  getTrending: async () => {
    const response = await api.get('/telegram/trending');
    return response.data;
  },

  getTrendingCoins: async () => {
    const response = await api.get('/telegram/trending-coins');
    return response.data;
  },

  searchMessages: async (query: string, limit?: number) => {
    const response = await api.get('/telegram/search', {
      params: { query, limit }
    });
    return response.data;
  },

  getChannelStats: async (username: string) => {
    const response = await api.get(`/telegram/channel/${username}`);
    return response.data;
  },

  connect: async () => {
    const response = await api.post('/telegram/connect');
    return response.data;
  },
};

export default api;

