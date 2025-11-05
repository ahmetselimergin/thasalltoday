import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import telegramRoutes from './routes/telegramRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://thasalltoday-2y3l7mgog-asease42s-projects.vercel.app', // Vercel preview
  'https://thasalltoday.vercel.app', // Vercel production (if you have custom domain)
];

// Allow any vercel.app domain
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ThatsAllToday API is running...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/telegram', telegramRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

