# 🏗️ Complete Hostinger Installation & Configuration Guide

## 🎯 Your Setup
- **VPS**: srv1024097.hstgr.cloud
- **IP**: 72.60.101.107
- **Domain**: taleskillz.com
- **Status**: Running ✅

This guide will walk you through EVERYTHING using Hostinger's interface.

---

## 📋 Step 1: Access Your VPS in Hostinger

### 1.1 Login to Hostinger
1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Login with your Hostinger credentials
3. You should see your VPS: **srv1024097.hstgr.cloud**

### 1.2 Access VPS Management
1. Click on **"VPS"** in the left sidebar
2. Click **"Manage"** next to your VPS
3. You'll see the VPS control panel

---

## 🗄️ Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create MongoDB Atlas Account
1. Open a new tab and go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Try Free"**
3. Sign up with your email or Google account
4. Choose **"Build a Database"**

### 2.2 Create Your Database Cluster
1. Select **"M0 Sandbox"** (FREE tier)
2. Choose **"AWS"** as provider
3. Select **"US East (N. Virginia)"** region
4. Cluster name: `WB-SM-Cluster`
5. Click **"Create Cluster"**
6. Wait 2-3 minutes for setup

### 2.3 Set Up Database Access
1. Click **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Username: `wb-admin`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 2.4 Configure Network Access
1. Click **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 2.5 Get Your Connection String
1. Click **"Database"** → **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **"Node.js"**
4. Version: **"4.1 or later"**
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `datacollect`

**Example:**
```
mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
```

---

## 🖥️ Step 3: Configure Your VPS in Hostinger

### 3.1 Access VPS Terminal
1. In Hostinger VPS panel, click **"Terminal"** or **"SSH Access"**
2. Or use Hostinger's **"Browser Terminal"**
3. You should see a command prompt

### 3.2 Install Node.js
Copy and paste these commands one by one:

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3.3 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 3.4 Install Nginx (Web Server)
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

---

## 📁 Step 4: Upload Your Project Files

### 4.1 Prepare Your Project Locally
1. On your local computer, zip your entire project folder
2. Name it: `taleskillz-project.zip`

### 4.2 Upload via Hostinger File Manager
1. In Hostinger panel, go to **"File Manager"**
2. Navigate to **"VPS"** → **"srv1024097.hstgr.cloud"**
3. Go to `/var/www/` directory
4. Create folder: `taleskillz.com`
5. Upload your `taleskillz-project.zip` to `/var/www/taleskillz.com/`
6. Extract the zip file
7. Delete the zip file

### 4.3 Set Proper Permissions
In the terminal:
```bash
cd /var/www/taleskillz.com
chown -R www-data:www-data .
chmod -R 755 .
```

---

## ⚙️ Step 5: Configure Your Application

### 5.1 Install Project Dependencies
```bash
cd /var/www/taleskillz.com
npm install --production
```

### 5.2 Create Environment File
```bash
nano .env.local
```

Add this content (replace with your actual MongoDB connection string):
```env
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
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### 5.3 Build Your Application
```bash
npm run build
```

---

## 🌐 Step 6: Configure Domain and SSL

### 6.1 Set Up Domain in Hostinger
1. In Hostinger panel, go to **"Domains"**
2. Find **"taleskillz.com"**
3. Click **"Manage"**
4. Set DNS A record to point to: `72.60.101.107`

### 6.2 Configure Nginx
```bash
nano /etc/nginx/sites-available/taleskillz.com
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

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### 6.3 Enable the Site
```bash
ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6.4 Install SSL Certificate
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d taleskillz.com -d www.taleskillz.com
```

---

## 🚀 Step 7: Start Your Application

### 7.1 Start with PM2
```bash
cd /var/www/taleskillz.com
pm2 start npm --name "taleskillz" -- start
```

### 7.2 Configure PM2 to Start on Boot
```bash
pm2 startup
pm2 save
```

### 7.3 Check Status
```bash
pm2 status
pm2 logs taleskillz
```

---

## 🧪 Step 8: Test Your Application

### 8.1 Test Domain Access
1. Open browser and go to: `https://taleskillz.com`
2. You should see your application

### 8.2 Test Database Connection
1. Go to: `https://taleskillz.com/register`
2. Try to register a new user
3. Check MongoDB Atlas dashboard for new data

### 8.3 Test Admin Access
1. Go to: `https://taleskillz.com/login`
2. Login with:
   - Email: `admin@datacollect.app`
   - Password: `33333333`

---

## 🔧 Step 9: Initialize Database

### 9.1 Create Admin User
1. Visit: `https://taleskillz.com/register`
2. Register with admin credentials:
   - Email: `admin@datacollect.app`
   - Password: `33333333`
   - Role: `admin`

### 9.2 Test All Features
- User registration and login
- Data entry forms
- Admin panel access
- User management
- Data approval workflow

---

## 📊 Step 10: Monitor Your Application

### 10.1 Check Application Status
```bash
pm2 status
pm2 monit
```

### 10.2 Check System Resources
```bash
htop
df -h
free -h
```

### 10.3 Check Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

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
systemctl status nginx

# Test Nginx configuration
nginx -t

# Check if domain points to your VPS
nslookup taleskillz.com
```

### Database Connection Issues
1. Check MongoDB Atlas connection string
2. Verify network access (0.0.0.0/0)
3. Check environment variables in `.env.local`
4. Test connection: `npm run mongodb:init`

---

## 🎉 Success!

Your application is now live at: **https://taleskillz.com**

### What You Have:
✅ **Full Next.js Application** running on your VPS  
✅ **MongoDB Atlas** cloud database  
✅ **SSL Certificate** for security  
✅ **Domain** properly configured  
✅ **PM2** process management  
✅ **Nginx** reverse proxy  
✅ **Auto-start** on server reboot  

### Admin Access:
- **URL**: https://taleskillz.com
- **Email**: admin@datacollect.app
- **Password**: 33333333

### Management Commands:
```bash
pm2 status          # Check app status
pm2 restart taleskillz  # Restart app
pm2 logs taleskillz     # View logs
pm2 monit           # Monitor dashboard
```

Your WB-SM application is now fully deployed and ready for production use! 🚀
