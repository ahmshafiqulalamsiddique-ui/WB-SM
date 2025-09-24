# 🖥️ VPS Setup Guide for taleskillz.com

## Your VPS Configuration
- **VPS**: srv1024097.hstgr.cloud
- **IP**: 72.60.101.107
- **Domain**: taleskillz.com
- **Status**: Running ✅

## 🚀 Quick VPS Deployment (Recommended)

Since you have a VPS, you can run the full Next.js application with all features!

### Step 1: Connect to Your VPS

```bash
ssh root@72.60.101.107
```

### Step 2: Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### Step 4: Create Project Directory

```bash
mkdir -p /var/www/taleskillz.com
cd /var/www/taleskillz.com
```

### Step 5: Upload Your Project

**Option A: Using SCP (from your local machine)**
```bash
# From your local project directory
scp -r . root@72.60.101.107:/var/www/taleskillz.com/
```

**Option B: Using Git (if your project is on GitHub)**
```bash
# On the VPS
git clone https://github.com/yourusername/WB-SM.git .
```

**Option C: Using File Manager**
1. Zip your project files
2. Upload via Hostinger File Manager
3. Extract in `/var/www/taleskillz.com`

### Step 6: Install Dependencies

```bash
cd /var/www/taleskillz.com
npm install --production
```

### Step 7: Set Up Environment Variables

```bash
nano .env.local
```

Add your environment variables:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority

# Session Configuration
NEXTAUTH_SECRET=your-super-secret-key-32-chars-long-change-this
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
```

### Step 8: Build and Start Application

```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name "taleskillz" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Check status
pm2 status
```

### Step 9: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/taleskillz.com
```

Add this configuration:
```nginx
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
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 10: Set Up SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d taleskillz.com -d www.taleskillz.com
```

## 🔧 VPS Management Commands

### PM2 Commands
```bash
pm2 status          # Check app status
pm2 restart taleskillz  # Restart app
pm2 stop taleskillz     # Stop app
pm2 logs taleskillz     # View logs
pm2 monit           # Monitor dashboard
```

### Nginx Commands
```bash
sudo systemctl status nginx    # Check Nginx status
sudo systemctl restart nginx   # Restart Nginx
sudo nginx -t                  # Test configuration
```

### System Commands
```bash
htop               # Monitor system resources
df -h              # Check disk space
free -h            # Check memory usage
```

## 🚨 Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs taleskillz

# Check if port 3000 is in use
netstat -tlnp | grep :3000

# Restart application
pm2 restart taleskillz
```

### Domain Not Working
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration
sudo nginx -t

# Check if domain points to your VPS
nslookup taleskillz.com
```

### Database Connection Issues
1. Check MongoDB Atlas connection string
2. Verify network access (0.0.0.0/0)
3. Check environment variables
4. Test connection: `npm run mongodb:init`

## 📊 Monitoring Your VPS

### Set Up Monitoring
```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor PM2 processes
pm2 monit

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Backup Strategy
```bash
# Backup your application
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/taleskillz.com

# Backup PM2 configuration
pm2 save
```

## 🎯 Your Live Application

Once everything is set up:
- **URL**: https://taleskillz.com
- **Admin Login**: admin@datacollect.app / 33333333
- **Features**: Full Next.js app with server-side rendering
- **Database**: MongoDB Atlas (cloud)
- **SSL**: Automatic HTTPS
- **Performance**: Optimized for your VPS

## 🔄 Updates and Maintenance

### Updating Your Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart with PM2
pm2 restart taleskillz
```

### Regular Maintenance
- Monitor disk space: `df -h`
- Check memory usage: `free -h`
- Update system packages: `sudo apt update && sudo apt upgrade`
- Monitor application logs: `pm2 logs taleskillz`

Your VPS setup is now complete and ready for production! 🚀
