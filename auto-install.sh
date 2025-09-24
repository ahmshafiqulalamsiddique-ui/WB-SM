#!/bin/bash

# 🚀 Automatic Hostinger VPS Installation Script
# This script will install everything needed for your WB-SM application

echo "🚀 Starting automatic installation for taleskillz.com"
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PM2 globally
echo "📦 Installing PM2 process manager..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx web server..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# Install Certbot for SSL
echo "📦 Installing Certbot for SSL certificates..."
apt install certbot python3-certbot-nginx -y

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /var/www/taleskillz.com
cd /var/www/taleskillz.com

# Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R www-data:www-data /var/www/taleskillz.com
chmod -R 755 /var/www/taleskillz.com

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your project files to /var/www/taleskillz.com"
echo "2. Run: cd /var/www/taleskillz.com && npm install"
echo "3. Create .env.local file with your MongoDB connection string"
echo "4. Run: npm run build"
echo "5. Run: pm2 start npm --name 'taleskillz' -- start"
echo "6. Configure Nginx and SSL certificate"
echo ""
echo "📖 See HOSTINGER_COMPLETE_SETUP.md for detailed instructions"
