# 🚀 One-Click Hostinger Setup

## 🎯 Super Simple Setup - Just Run These Commands!

I've created automated scripts that will do everything for you. Just copy and paste these commands in your Hostinger VPS terminal.

---

## 📋 Step 1: Access Your VPS

1. Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Click **"VPS"** → **"Manage"** → **"Terminal"**
3. You'll see a command prompt

---

## 🚀 Step 2: Run the Installation Script

Copy and paste this **ONE COMMAND** to install everything:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/WB-SM/main/auto-install.sh | bash
```

**OR** if you prefer to download and run locally:

```bash
# Download the script
wget https://raw.githubusercontent.com/yourusername/WB-SM/main/auto-install.sh

# Make it executable
chmod +x auto-install.sh

# Run it
./auto-install.sh
```

This will install:
- ✅ Node.js 18.x
- ✅ PM2 process manager
- ✅ Nginx web server
- ✅ Certbot for SSL
- ✅ Create project directory

---

## 📁 Step 3: Upload Your Project Files

### Option A: Using Hostinger File Manager
1. In Hostinger panel, go to **"File Manager"**
2. Navigate to `/var/www/taleskillz.com`
3. Upload your entire project folder
4. Extract if it's a zip file

### Option B: Using Git (if your project is on GitHub)
```bash
cd /var/www/taleskillz.com
git clone https://github.com/yourusername/WB-SM.git .
```

---

## ⚙️ Step 4: Configure Your Application

Run this **ONE COMMAND** to set up your app:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/WB-SM/main/setup-app.sh | bash
```

This will:
- ✅ Install project dependencies
- ✅ Create environment file
- ✅ Build the application
- ✅ Start with PM2
- ✅ Configure auto-start

---

## 🌐 Step 5: Set Up Nginx and SSL

Run this **ONE COMMAND** to configure Nginx:

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/WB-SM/main/setup-nginx.sh | bash
```

Then get SSL certificate:

```bash
certbot --nginx -d taleskillz.com -d www.taleskillz.com
```

---

## 🗄️ Step 6: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create cluster (M0 Sandbox)
4. Set up database user: `wb-admin`
5. Allow access from anywhere (0.0.0.0/0)
6. Get connection string
7. Edit environment file:

```bash
nano /var/www/taleskillz.com/.env.local
```

Replace the MongoDB URI with your actual connection string.

---

## 🧪 Step 7: Test Your Application

1. Go to: https://taleskillz.com
2. Register a new user
3. Test admin login:
   - Email: `admin@datacollect.app`
   - Password: `33333333`

---

## 🎉 That's It!

Your application is now live at: **https://taleskillz.com**

### Quick Commands for Management:

```bash
pm2 status          # Check app status
pm2 restart taleskillz  # Restart app
pm2 logs taleskillz     # View logs
pm2 monit           # Monitor dashboard
```

---

## 🚨 If Something Goes Wrong

### Check Application Status:
```bash
pm2 status
pm2 logs taleskillz
```

### Check Nginx Status:
```bash
systemctl status nginx
nginx -t
```

### Restart Everything:
```bash
pm2 restart taleskillz
systemctl restart nginx
```

### Check System Resources:
```bash
htop
df -h
free -h
```

---

## 📞 Need Help?

- **Hostinger Support**: Available 24/7 in your panel
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Check logs**: `pm2 logs taleskillz`

---

## ✅ Success Checklist

- [ ] VPS installation completed
- [ ] Project files uploaded
- [ ] Application configured
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] MongoDB Atlas connected
- [ ] Domain working
- [ ] Admin access working

**Your WB-SM application is now live and ready! 🚀**
