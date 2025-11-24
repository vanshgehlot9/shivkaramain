#!/bin/bash

# Shivkara - Start Development Server
# This script starts the Next.js development server with proper environment configuration

echo "🚀 Starting Shivkara Development Server..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please ensure .env.local is configured with Firebase credentials."
    exit 1
fi

# Check if Firebase Admin credentials are set
if ! grep -q "FIREBASE_ADMIN_CREDENTIALS" .env.local; then
    echo "⚠️  Warning: FIREBASE_ADMIN_CREDENTIALS not found in .env.local"
    echo "Data storage may not work properly."
fi

echo "✅ Environment configuration found"
echo "✅ Starting Next.js development server..."
echo ""
echo "📝 Server will be available at: http://localhost:3000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
