#!/bin/bash

# Setup Script cho Backend
# Chạy: bash scripts/setup.sh

echo "🚀 Starting Backend Setup..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài. Vui lòng cài Node.js >= 18.x"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install multer if not exists
if ! npm list multer &> /dev/null; then
    echo "📦 Installing multer..."
    npm install multer
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Vui lòng edit file .env và điền MONGODB_URI và JWT_SECRET"
else
    echo "✅ .env file đã tồn tại"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads/avatars

echo ""
echo "✅ Setup hoàn tất!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit file .env với MONGODB_URI và JWT_SECRET"
echo "   2. Chạy: npm run seed (để seed data)"
echo "   3. Chạy: npm run dev (để start server)"
echo ""

