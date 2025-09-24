# 🚀 Coolify Deployment Guide for WB-SM Project

## Overview
This guide will help you deploy your WB-SM Next.js application to Hostinger VPS using Coolify, a self-hosted deployment platform.

## 📋 Prerequisites

- ✅ Hostinger VPS: srv1024097.hstgr.cloud (Running)
- ✅ Domain: taleskillz.com
- ✅ IP Address: 72.60.101.107
- ✅ Coolify installed on your VPS
- ✅ MongoDB Atlas account (free tier available)

## 🐳 Step 1: Prepare Your Project for Coolify

### 1.1 Project Structure
Your project now includes:
- `Dockerfile` - Multi-stage build for Next.js
- `docker-compose.yml` - Service configuration
- `src/app/api/health/route.ts` - Health check endpoint
- Updated `next.config.js` - Optimized for Docker

### 1.2 Environment Variables Template
Create a `.env.production` file with these variables:

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

## 🏗️ Step 2: Set Up Coolify on Your VPS

### 2.1 Install Coolify
SSH into your VPS and run:

```bash
# Install Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Start Coolify
sudo systemctl start coolify
sudo systemctl enable coolify
```

### 2.2 Access Coolify Dashboard
1. Open browser and go to: `http://72.60.101.107:8000`
2. Create your admin account
3. Complete the initial setup

## 📦 Step 3: Deploy Your Application

### 3.1 Create New Application
1. In Coolify dashboard, click **"New Application"**
2. Choose **"Docker Compose"** as deployment method
3. Name your application: `wb-sm-app`

### 3.2 Configure Repository
1. **Repository URL**: Your GitHub repository URL
2. **Branch**: `main` or `master`
3. **Build Pack**: `Dockerfile`

### 3.3 Set Environment Variables
In Coolify dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long
NEXTAUTH_URL=https://taleskillz.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@taleskillz.com
NEXT_PUBLIC_APP_URL=https://taleskillz.com
```

### 3.4 Configure Domain
1. In Coolify, go to **"Domains"**
2. Add domain: `taleskillz.com`
3. Enable **"Generate SSL Certificate"**
4. Set **"Redirect HTTP to HTTPS"**

### 3.5 Deploy Application
1. Click **"Deploy"** in Coolify dashboard
2. Monitor the build process
3. Wait for deployment to complete (5-10 minutes)

## 🔧 Step 4: Configure MongoDB Atlas

### 4.1 Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster: `WB-SM-Cluster`
3. Set up database user: `wb-admin`
4. Configure network access: `0.0.0.0/0`
5. Get connection string

### 4.2 Update Environment Variables
1. Copy your MongoDB connection string
2. Update `MONGODB_URI` in Coolify dashboard
3. Redeploy application

## 🌐 Step 5: Configure Domain and SSL

### 5.1 DNS Configuration
In your domain registrar (where you bought taleskillz.com):
1. Set A record: `taleskillz.com` → `72.60.101.107`
2. Set A record: `www.taleskillz.com` → `72.60.101.107`

### 5.2 SSL Certificate
Coolify will automatically:
1. Request SSL certificate from Let's Encrypt
2. Configure HTTPS redirect
3. Enable HSTS headers

## 🧪 Step 6: Test Your Deployment

### 6.1 Health Check
Visit: `https://taleskillz.com/api/health`
Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

### 6.2 Application Test
1. Visit: `https://taleskillz.com`
2. Test user registration
3. Test login functionality
4. Test admin panel access

### 6.3 Database Test
1. Register a new user
2. Check MongoDB Atlas dashboard for new data
3. Verify data persistence

## 🔄 Step 7: Initialize Database

### 7.1 Create Admin User
1. Go to: `https://taleskillz.com/register`
2. Register with admin credentials:
   - Email: `admin@datacollect.app`
   - Password: `33333333`
   - Role: `admin`

### 7.2 Test All Features
- User registration and login
- Data entry forms
- Admin panel access
- User management
- Data approval workflow

## 📊 Step 8: Monitor Your Application

### 8.1 Coolify Dashboard
- Monitor application status
- View logs and metrics
- Check resource usage
- Manage deployments

### 8.2 Application Monitoring
- Health check endpoint: `/api/health`
- Application logs in Coolify
- MongoDB Atlas monitoring

## 🚨 Troubleshooting

### Common Issues:

**1. Build Failed**
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Check build logs in Coolify

**2. Application Won't Start**
- Verify environment variables
- Check MongoDB connection string
- Review application logs

**3. Domain Not Working**
- Check DNS propagation
- Verify SSL certificate status
- Check domain configuration in Coolify

**4. Database Connection Issues**
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user permissions

## 🔄 Update Process

To update your application:

1. **Push changes to GitHub**
2. **Coolify will automatically detect changes**
3. **Click "Deploy" in Coolify dashboard**
4. **Monitor deployment progress**
5. **Test updated application**

## 📈 Performance Optimization

### 1. Docker Optimization
- Multi-stage build reduces image size
- Standalone output for better performance
- Health checks for container monitoring

### 2. Next.js Optimization
- Static generation where possible
- Image optimization disabled for Docker
- Compression enabled

### 3. Database Optimization
- MongoDB Atlas free tier (500MB)
- Connection pooling
- Index optimization

## 💰 Cost Breakdown

- **Hostinger VPS**: $3.99-7.99/month
- **MongoDB Atlas**: Free tier (500MB storage)
- **Domain**: $10-15/year
- **Coolify**: Free (self-hosted)
- **Total**: ~$4-8/month

## 🎉 Success!

Your WB-SM application is now live with:

✅ **Coolify** automated deployment  
✅ **Docker** containerization  
✅ **MongoDB Atlas** cloud database  
✅ **SSL Certificate** automatic renewal  
✅ **Domain** properly configured  
✅ **Health monitoring** built-in  
✅ **Auto-deployment** from GitHub  

## 📞 Support

- **Coolify Documentation**: https://coolify.io/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Docker**: https://nextjs.org/docs/deployment#docker-image

Your application is now ready for production use! 🚀

## 🔗 Quick Links

- **Live Application**: https://taleskillz.com
- **Coolify Dashboard**: http://72.60.101.107:8000
- **Health Check**: https://taleskillz.com/api/health
- **Admin Login**: admin@datacollect.app / 33333333
