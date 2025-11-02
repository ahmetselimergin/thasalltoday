#!/bin/bash

echo "🚀 ThatsAllToday Setup Script"
echo "================================"

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi
echo "✓ Node.js version: $(node --version)"

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm version: $(npm --version)"

# Check MongoDB
echo "✓ Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB: https://www.mongodb.com/docs/manual/installation/"
    echo "   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
else
    echo "✓ MongoDB is installed"
fi

echo ""
echo "================================"
echo "📦 Installing Dependencies..."
echo "================================"

# Backend setup
echo ""
echo "🔧 Setting up Backend..."
cd backend
npm install
echo "✓ Backend dependencies installed"

# Frontend setup
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install
echo "✓ Frontend dependencies installed"

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start MongoDB (if using local):"
echo "   macOS:   brew services start mongodb-community"
echo "   Linux:   sudo systemctl start mongod"
echo "   Windows: net start MongoDB"
echo ""
echo "2. Start Backend (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "🎉 Happy Coding!"

