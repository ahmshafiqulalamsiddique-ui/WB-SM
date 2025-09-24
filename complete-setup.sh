#!/bin/bash

# 🚀 Complete Hostinger VPS Setup Script for taleskillz.com
# This script will install and configure everything automatically

set -e  # Exit on any error

echo "🚀 Starting complete setup for taleskillz.com"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_status "System updated successfully"

# Step 2: Install Node.js 18.x
print_info "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
print_status "Node.js installed: $(node --version)"
print_status "NPM installed: $(npm --version)"

# Step 3: Install PM2
print_info "Installing PM2 process manager..."
npm install -g pm2
print_status "PM2 installed: $(pm2 --version)"

# Step 4: Install Nginx
print_info "Installing Nginx web server..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx
print_status "Nginx installed and started"

# Step 5: Install Certbot for SSL
print_info "Installing Certbot for SSL certificates..."
apt install certbot python3-certbot-nginx -y
print_status "Certbot installed"

# Step 6: Create project directory
print_info "Creating project directory..."
mkdir -p /var/www/taleskillz.com
cd /var/www/taleskillz.com
chown -R www-data:www-data .
chmod -R 755 .
print_status "Project directory created: /var/www/taleskillz.com"

# Step 7: Create Nginx configuration
print_info "Creating Nginx configuration..."
cat > /etc/nginx/sites-available/taleskillz.com << 'EOF'
server {
    listen 80;
    server_name taleskillz.com www.taleskillz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
systemctl restart nginx
print_status "Nginx configured for taleskillz.com"

# Step 8: Create environment file template
print_info "Creating environment file template..."
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
print_status "Environment file template created"

# Step 9: Create PM2 ecosystem file
print_info "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'taleskillz',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/taleskillz.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF
print_status "PM2 ecosystem file created"

# Step 10: Create startup script
print_info "Creating startup script..."
cat > start-app.sh << 'EOF'
#!/bin/bash
cd /var/www/taleskillz.com

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Build the application if .next doesn't exist
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm run build
fi

# Start with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js

# Configure PM2 to start on boot
pm2 startup
pm2 save

echo "Application started successfully!"
pm2 status
EOF

chmod +x start-app.sh
print_status "Startup script created"

# Step 11: Create SSL setup script
print_info "Creating SSL setup script..."
cat > setup-ssl.sh << 'EOF'
#!/bin/bash
echo "Setting up SSL certificate for taleskillz.com..."
certbot --nginx -d taleskillz.com -d www.taleskillz.com --non-interactive --agree-tos --email admin@taleskillz.com
echo "SSL certificate setup completed!"
EOF

chmod +x setup-ssl.sh
print_status "SSL setup script created"

# Step 12: Create project upload script
print_info "Creating project upload script..."
cat > upload-project.sh << 'EOF'
#!/bin/bash
echo "Project upload instructions:"
echo "============================="
echo ""
echo "From your PC terminal, run:"
echo "scp -r . root@72.60.101.107:/var/www/taleskillz.com/"
echo ""
echo "Or use Hostinger File Manager to upload to /var/www/taleskillz.com"
echo ""
echo "After uploading, run:"
echo "cd /var/www/taleskillz.com"
echo "./start-app.sh"
EOF

chmod +x upload-project.sh
print_status "Project upload script created"

# Step 13: Create management script
print_info "Creating management script..."
cat > manage-app.sh << 'EOF'
#!/bin/bash
cd /var/www/taleskillz.com

case "$1" in
    start)
        pm2 start ecosystem.config.js
        echo "Application started"
        ;;
    stop)
        pm2 stop taleskillz
        echo "Application stopped"
        ;;
    restart)
        pm2 restart taleskillz
        echo "Application restarted"
        ;;
    status)
        pm2 status
        ;;
    logs)
        pm2 logs taleskillz
        ;;
    update)
        git pull origin main
        npm install --production
        npm run build
        pm2 restart taleskillz
        echo "Application updated"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show application status"
        echo "  logs    - Show application logs"
        echo "  update  - Update and restart application"
        ;;
esac
EOF

chmod +x manage-app.sh
print_status "Management script created"

# Step 14: Create monitoring script
print_info "Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "System Monitoring for taleskillz.com"
echo "===================================="
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "System Resources:"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Disk Usage:"
df -h
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager
echo ""
echo "Network Connections:"
netstat -tlnp | grep :3000
EOF

chmod +x monitor.sh
print_status "Monitoring script created"

# Final status check
print_info "Running final status check..."
echo ""
echo "System Status:"
echo "=============="
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Certbot: $(certbot --version)"
echo ""

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check if project directory exists
if [ -d "/var/www/taleskillz.com" ]; then
    print_status "Project directory exists"
else
    print_error "Project directory not found"
fi

echo ""
print_status "Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Upload your project files to /var/www/taleskillz.com"
echo "2. Edit .env.local with your MongoDB connection string"
echo "3. Run: ./start-app.sh"
echo "4. Run: ./setup-ssl.sh"
echo "5. Your app will be live at: https://taleskillz.com"
echo ""
echo "📁 Available Scripts:"
echo "===================="
echo "  ./start-app.sh     - Start the application"
echo "  ./setup-ssl.sh     - Setup SSL certificate"
echo "  ./manage-app.sh    - Manage application (start/stop/restart)"
echo "  ./monitor.sh       - Monitor system status"
echo "  ./upload-project.sh - Instructions for uploading project"
echo ""
echo "🎉 Your VPS is ready for deployment!"
