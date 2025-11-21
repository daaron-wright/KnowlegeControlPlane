#!/bin/bash

# Frontend-only startup script for Omnis Demo
# This script starts only the frontend without any backend dependencies

echo "🚀 Starting Omnis Demo Frontend (No Agent Required)"
echo "=================================================="

# Check if we're in the correct directory
if [ ! -d "omnis-ui" ]; then
    echo "❌ Error: omnis-ui directory not found. Please run this script from the project root."
    exit 1
fi

# Navigate to the frontend directory
cd omnis-ui

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if command -v yarn &> /dev/null; then
        yarn install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo "❌ Error: Neither yarn nor npm found. Please install Node.js and npm/yarn."
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Starting development server..."
echo "📝 Demo credentials:"
echo "   Email: pedro.clem@kyndryl.com"
echo "   Password: pedro.clem"
echo ""
echo "🌐 The application will be available at: http://localhost:3000"
echo "💡 Try asking about 'autonomous truck performance' to see the dashboard!"
echo ""

# Start the development server
if command -v yarn &> /dev/null; then
    yarn dev
else
    npm run dev
fi
