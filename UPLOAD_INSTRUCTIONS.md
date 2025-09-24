# 📤 Upload Instructions for taleskillz.com

## 🎯 Complete Upload Guide

I've created all the necessary files for your Hostinger VPS deployment. Here's how to upload everything:

## 📁 **Files Created for You**

✅ **`ecosystem.config.js`** - PM2 configuration  
✅ **`nginx-taleskillz.conf`** - Nginx configuration  
✅ **`start-taleskillz.sh`** - Application startup script  
✅ **`setup-ssl-taleskillz.sh`** - SSL certificate setup  
✅ **`manage-taleskillz.sh`** - Application management script  
✅ **`.htaccess`** - Apache configuration (if needed)  

## 🚀 **Step-by-Step Upload Process**

### 1️⃣ **Upload Your Project Files**

**Option A: Using SCP (Recommended)**
```bash
# From your PC terminal, navigate to your project folder
cd /path/to/your/WB-SM/project

# Upload everything to your VPS
scp -r . root@72.60.101.107:/var/www/taleskillz.com/
```

**Option B: Using Hostinger File Manager**
1. Go to Hostinger panel → File Manager
2. Navigate to `/var/www/taleskillz.com`
3. Upload your entire project folder
4. Extract if it's a zip file

### 2️⃣ **Set Up Environment Variables**

After uploading, SSH into your VPS and create the environment file:

```bash
# SSH into your VPS
ssh root@72.60.101.107

# Navigate to project directory
cd /var/www/taleskillz.com

# Create environment file
nano .env.local
```

Add this content (replace with your actual MongoDB connection string):
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority

# Session Configuration
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long-change-this
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

### 3️⃣ **Configure Nginx**

```bash
# Copy Nginx configuration
cp nginx-taleskillz.conf /etc/nginx/sites-available/taleskillz.com

# Enable the site
ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 4️⃣ **Make Scripts Executable**

```bash
# Make all scripts executable
chmod +x start-taleskillz.sh
chmod +x setup-ssl-taleskillz.sh
chmod +x manage-taleskillz.sh

# Set proper permissions
chown -R www-data:www-data .
chmod -R 755 .
```

### 5️⃣ **Start Your Application**

```bash
# Start the application
./start-taleskillz.sh
```

### 6️⃣ **Set Up SSL Certificate**

```bash
# Get SSL certificate
./setup-ssl-taleskillz.sh
```

## 🎯 **Quick Commands Summary**

```bash
# Upload project
scp -r . root@72.60.101.107:/var/www/taleskillz.com/

# SSH into VPS
ssh root@72.60.101.107

# Navigate to project
cd /var/www/taleskillz.com

# Create environment file
nano .env.local

# Configure Nginx
cp nginx-taleskillz.conf /etc/nginx/sites-available/taleskillz.com
ln -s /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Make scripts executable
chmod +x *.sh
chown -R www-data:www-data .
chmod -R 755 .

# Start application
./start-taleskillz.sh

# Setup SSL
./setup-ssl-taleskillz.sh
```

## 🧪 **Test Your Application**

1. **Check application status**: `./manage-taleskillz.sh status`
2. **View logs**: `./manage-taleskillz.sh logs`
3. **Visit your site**: https://taleskillz.com
4. **Test admin login**: admin@datacollect.app / 33333333

## 🎛️ **Management Commands**

```bash
./manage-taleskillz.sh start    # Start application
./manage-taleskillz.sh stop     # Stop application
./manage-taleskillz.sh restart   # Restart application
./manage-taleskillz.sh status    # Check status
./manage-taleskillz.sh logs      # View logs
./manage-taleskillz.sh update    # Update application
./manage-taleskillz.sh monitor   # System monitoring
```

## 🚨 **Troubleshooting**

### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs taleskillz

# Restart application
./manage-taleskillz.sh restart
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
1. Check MongoDB Atlas connection string in `.env.local`
2. Verify network access (0.0.0.0/0) in MongoDB Atlas
3. Test connection: `npm run mongodb:init`

## 🎉 **Success!**

After completing all steps, your application will be live at:
- **URL**: https://taleskillz.com
- **Admin Login**: admin@datacollect.app / 33333333
- **Features**: Full Next.js app with MongoDB Atlas database

## 📞 **Need Help?**

If you run into any issues:
- **Copy the error message** and share it with me
- **Check the specific step** that failed
- **Try the troubleshooting commands** above

Your application is now ready for production deployment! 🚀
