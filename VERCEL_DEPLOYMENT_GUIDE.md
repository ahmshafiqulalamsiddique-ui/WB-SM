# 🚀 Vercel Deployment Guide

## Complete Setup: Vercel + GitHub + MongoDB

### **Step 1: Set Up MongoDB Atlas (Cloud Database)**

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Sign up/Login** with your account
3. **Create a new cluster**:
   - Choose **FREE** tier (M0)
   - Select **AWS** and **US East (N. Virginia)**
   - Name: `WB-SM-Cluster`
4. **Create database user**:
   - Username: `wb-admin`
   - Password: `YourSecurePassword123!`
   - Database User Privileges: `Read and write to any database`
5. **Whitelist IP addresses**:
   - Add `0.0.0.0/0` (allow from anywhere) for Vercel
6. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `datacollect`

**Example connection string:**
```
mongodb+srv://wb-admin:YourSecurePassword123!@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
```

### **Step 2: Deploy to Vercel**

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "New Project"**
4. **Import** your `WB-SM` repository
5. **Configure project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### **Step 3: Add Environment Variables**

In Vercel dashboard, go to **Settings** → **Environment Variables**:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://wb-admin:YourPassword@cluster.mongodb.net/datacollect` | MongoDB connection string |
| `NEXTAUTH_SECRET` | `your-super-secret-key-32-chars-long` | Session encryption key |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Your Vercel app URL |

### **Step 4: Deploy**

1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Get your live URL**: `https://wb-sm-ahmshafiqulalamsiddique-ui.vercel.app`

### **Step 5: Initialize Database**

After deployment, you need to populate the database:

1. **Go to your live site**
2. **Login as admin**: `admin@datacollect.app` / `33333333`
3. **Go to Admin panel**
4. **The system will auto-initialize** the database

### **Step 6: Set Up Auto-Deployments**

1. **In Vercel dashboard**
2. **Go to "Settings" → "Git"**
3. **Enable "Automatic deployments"**
4. **Every push to GitHub** will auto-deploy to Vercel

## 🔧 **Troubleshooting**

### **If deployment fails:**
- Check environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check build logs in Vercel dashboard

### **If database connection fails:**
- Verify MongoDB Atlas cluster is running
- Check IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### **If login doesn't work:**
- Database might not be initialized
- Check MongoDB Atlas for data
- Verify password hashes are correct

## 📱 **Access Your Live Site**

**URL**: `https://your-project-name.vercel.app`

**Admin Login**:
- Email: `admin@datacollect.app`
- Password: `33333333`

## 🔄 **Auto-Sync Workflow**

1. **Make changes locally**
2. **Test with**: `npm run dev`
3. **Commit changes**: `git add . && git commit -m "Your changes"`
4. **Push to GitHub**: `git push origin main`
5. **Vercel auto-deploys** in 2-3 minutes
6. **Your live site updates** automatically!

## 🎉 **Success!**

Your WB-SM application is now live on the internet with:
- ✅ **Live URL** accessible worldwide
- ✅ **MongoDB Atlas** cloud database
- ✅ **Auto-deployments** from GitHub
- ✅ **Full functionality** preserved
- ✅ **Professional hosting** on Vercel

## 📞 **Support**

If you need help:
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Integration**: https://docs.github.com/en/pages
