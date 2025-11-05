# ThatsAllToday

Crypto analytics platform with wallet integration and authentication system.

## 🚀 Features

- **User Authentication**: Login/Register with JWT
- **MetaMask Integration**: Connect crypto wallets
- **MongoDB Database**: User and wallet data storage
- **Real-time Updates**: Wallet address sync with backend
- **Protected Routes**: Secure application pages
- **Modern UI**: Responsive design with React & SCSS

## 📁 Project Structure

```
thasalltoday/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
│
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (v5+)
- MetaMask browser extension
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd thasalltoday
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# Note: Backend runs on PORT 5001 (5000 is used by macOS AirPlay)

# Start MongoDB (if using local)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# Start backend server
npm run dev
```

Backend will run on http://localhost:5001

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on http://localhost:5173

## 🔧 Configuration

### Backend Environment Variables

Create `/backend/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/thasalltoday
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Note:** Port 5001 is used because macOS uses port 5000 for AirPlay Receiver.

### Frontend API URL

Update `/frontend/src/services/api.ts` if needed:

```typescript
const API_URL = 'http://localhost:5001/api';
```

## 📖 Usage

### 1. Register

- Go to http://localhost:5173/register
- Fill in name, email, and password
- Click "Kayıt Ol"
- MetaMask will automatically prompt to connect

### 2. Login

- Go to http://localhost:5173/login
- Enter email and password
- Click "Giriş Yap"
- MetaMask will automatically prompt to connect

### 3. Application

- After successful login and wallet connection
- Access protected routes: Application, Profile, Wallet Details

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend creates JWT token
3. Token stored in localStorage
4. MetaMask connection prompt appears
5. Wallet address saved to MongoDB
6. User can access protected routes

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Environment variables for secrets
- CORS configuration
- Input validation

## 📡 API Endpoints

### Public Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Routes

- `GET /api/auth/me` - Get current user
- `PUT /api/auth/wallet` - Update wallet address

## 🧪 Testing

### Test Registration

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🎨 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Ethers.js
- SCSS
- Bootstrap

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

## 📝 Development Scripts

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Backend

```bash
npm run dev      # Start with nodemon
npm start        # Start production server
```

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check MongoDB logs

### MetaMask Not Working

- Install MetaMask extension
- Check browser console for errors
- Ensure you're on localhost

### Port Already in Use

**Note:** macOS uses port 5000 for AirPlay Receiver by default. This project uses port 5001 for backend.

If port 5001 is also in use:
```bash
# Find process using port 5001
lsof -i :5001

# Kill process
kill -9 <PID>
```

### CORS Issues

- Check backend CORS configuration
- Ensure frontend URL matches in `server.js`

## 📦 Deployment

### 🚀 Quick Deploy with Render (Recommended)

**Otomatik build ve deploy için `render.yaml` kullanın!**

```bash
git push origin main
# Render otomatik olarak her push'ta build edip deploy eder!
```

👉 **Detaylı deployment rehberi**: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Özellikler:**
- ✅ **Otomatik Build**: Her git push'ta otomatik build
- ✅ **Otomatik Deploy**: Build başarılı olursa deploy
- ✅ **Free Plan**: 750 saat/ay ücretsiz
- ✅ **HTTPS**: Otomatik SSL sertifikası
- ✅ **Monitoring**: Logs, metrics, health checks

### Backend + Frontend (Render)

1. GitHub repo'nuzu [Render.com](https://render.com)'a bağlayın
2. **New Blueprint** → Repository seçin
3. `render.yaml` otomatik algılanacak
4. Environment variables ekleyin (MongoDB, JWT, Telegram)
5. **Apply** → Otomatik deploy başlar!

### Alternative: Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👥 Authors

Your Team

## 🙏 Acknowledgments

- MetaMask for wallet integration
- MongoDB for database
- React team for amazing framework
