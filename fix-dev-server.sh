#!/bin/bash

# Script to fix Next.js dev server hanging issues
echo "🔧 Fixing Next.js Dev Server Issues..."

# Clean build cache
echo "1. Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache

# Increase file watcher limits (Linux)
echo "2. Increasing file watcher limits..."
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Set Node.js memory options
echo "3. Setting Node.js memory options..."
export NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"

# Kill any hanging Node processes
echo "4. Killing any hanging Node processes..."
pkill -f "next" || true
pkill -f "node.*dev" || true

echo "✅ Ready! Now try running: npm run dev"
echo "💡 Alternative commands:"
echo "   npm run dev:safe   (without optimizations)"
echo "   npm run dev:clean  (clean build first)"
