#!/bin/bash

# WB-SM VPS Setup Script for Hostinger
# Run this script on your Ubuntu VPS

echo "🚀 Starting WB-SM VPS Setup..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install MongoDB
echo "📦 Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
echo "📦 Starting MongoDB..."
systemctl start mongod
systemctl enable mongod

# Install Nginx
echo "📦 Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# Install Git
echo "📦 Installing Git..."
apt install git -y

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Clone repository
echo "📦 Cloning WB-SM repository..."
git clone https://github.com/ahmshafiqulalamsiddique-ui/WB-SM.git
cd WB-SM

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Create environment file
echo "📦 Creating environment file..."
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/datacollect
NEXTAUTH_SECRET=7c17afea45ec8238befd5e8b1b3b4e1e77323d535c3e49ae1211ca5e84083241
NEXTAUTH_URL=https://www.taleskillz.com
EOF

# Build application
echo "📦 Building application..."
npm run build

# Start with PM2
echo "📦 Starting application with PM2..."
pm2 start npm --name "wb-sm" -- start
pm2 startup
pm2 save

# Configure Nginx
echo "📦 Configuring Nginx..."
cat > /etc/nginx/sites-available/taleskillz.com << EOF
server {
    listen 80;
    server_name www.taleskillz.com taleskillz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL certificate
echo "📦 Installing SSL certificate..."
apt install certbot python3-certbot-nginx -y
certbot --nginx -d www.taleskillz.com -d taleskillz.com

echo "✅ Setup complete!"
echo "🎉 Your WB-SM application should now be running!"
echo "🌐 Visit: https://www.taleskillz.com"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain DNS to point to: 72.60.101.107"
echo "2. Test your application"
echo "3. Login with admin credentials"

