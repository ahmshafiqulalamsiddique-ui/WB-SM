#!/bin/bash

# 🚀 Start Application Script for taleskillz.com
cd /var/www/taleskillz.com

echo "🚀 Starting taleskillz.com application..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Build the application if .next doesn't exist
if [ ! -d ".next" ]; then
    echo "🔨 Building application..."
    npm run build
fi

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js

# Configure PM2 to start on boot
pm2 startup
pm2 save

echo "✅ Application started successfully!"
echo "📊 Application status:"
pm2 status

echo ""
echo "🌐 Your application should now be running at: http://taleskillz.com"
echo "📝 View logs with: pm2 logs taleskillz"
echo "🔄 Restart with: pm2 restart taleskillz"
