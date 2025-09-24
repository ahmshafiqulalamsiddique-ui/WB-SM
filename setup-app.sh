#!/bin/bash

# 🚀 Application Setup Script for taleskillz.com

echo "🚀 Setting up WB-SM application"
echo "==============================="

# Navigate to project directory
cd /var/www/taleskillz.com

# Check if project files exist
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please upload your project files to /var/www/taleskillz.com first"
    exit 1
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install --production

# Create .env.local file
echo "📝 Creating environment file..."
cat > .env.local << 'EOF'
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority

# Session Configuration
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long
NEXTAUTH_URL=https://taleskillz.com

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@taleskillz.com

# Public URL
NEXT_PUBLIC_APP_URL=https://taleskillz.com
EOF

echo "⚠️  IMPORTANT: Edit .env.local and add your actual MongoDB connection string!"
echo "   Run: nano .env.local"

# Build the application
echo "🔨 Building application..."
npm run build

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "taleskillz" -- start

# Configure PM2 to start on boot
echo "⚙️  Configuring PM2 to start on boot..."
pm2 startup
pm2 save

# Check status
echo "📊 Application status:"
pm2 status

echo ""
echo "✅ Application setup completed!"
echo ""
echo "🌐 Your application should now be running at: http://taleskillz.com"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs taleskillz"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Edit .env.local with your MongoDB connection string"
echo "2. Get SSL certificate: certbot --nginx -d taleskillz.com -d www.taleskillz.com"
