# ThatsAllToday Backend API

Backend API for ThatsAllToday application built with Node.js, Express, and MongoDB.

## Features

- User authentication (Register & Login)
- JWT token-based authentication
- Password hashing with bcrypt
- MongoDB database
- Wallet address integration
- Protected routes
- Error handling middleware
- CORS enabled

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thasalltoday
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/docs/manual/installation/
2. Start MongoDB service:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

#### Update Wallet Address (Protected)
```http
PUT /api/auth/wallet
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "walletAddress": "0x1234567890abcdef..."
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "token": "jwt_token_here"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── authController.js  # Auth logic
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   └── errorMiddleware.js # Error handling
├── models/
│   └── User.js            # User model
├── routes/
│   └── authRoutes.js      # Auth routes
├── .env                   # Environment variables
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected routes
- Input validation
- CORS configuration
- Environment variables for sensitive data

## Testing with Postman/Thunder Client

1. Register a new user
2. Copy the JWT token from response
3. Use token in Authorization header for protected routes:
   - Format: `Bearer <your_token>`

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check MongoDB logs

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## License

ISC

