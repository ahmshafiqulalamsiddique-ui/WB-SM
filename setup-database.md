# 🗄️ Database Setup Instructions

## 🎯 Quick Setup for Database Storage

Your application is running but needs a database connection. Here's how to set it up:

## 📋 **Step 1: Create MongoDB Atlas Account**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Try Free" and sign up
3. Create a new cluster:
   - Choose **FREE** tier (M0 Sandbox)
   - Select **AWS** provider
   - Choose **US East (N. Virginia)** region
   - Name: `WB-SM-Cluster`

## 🔐 **Step 2: Set Up Database Access**

1. Go to **Database Access** → **Add New Database User**
2. Username: `wb-admin`
3. Password: Generate a strong password (SAVE THIS!)
4. Database User Privileges: `Read and write to any database`

## 🌐 **Step 3: Configure Network Access**

1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **Confirm**

## 🔗 **Step 4: Get Connection String**

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `datacollect`

**Example:**
```
mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
```

## ⚙️ **Step 5: Configure Environment Variables**

Create a `.env.local` file in your project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
MONGODB_DB=datacollect

# Session Configuration
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long-change-this
NEXTAUTH_URL=http://localhost:3000

# Public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 **Step 6: Initialize Database**

Run this command to create the admin user and demo data:

```bash
node init-database.js
```

## 🎉 **Step 7: Test Login**

After initialization, you can login with:

- **Admin**: admin@datacollect.app / admin123
- **Submitter**: submitter@datacollect.app / submitter123
- **Reviewer**: reviewer@datacollect.app / reviewer123
- **Approver**: approver@datacollect.app / approver123

## 🔄 **Step 8: Restart Server**

Restart your development server:

```bash
npm run dev
```

## ✅ **Success!**

Your application will now:
- ✅ Store all data in MongoDB Atlas
- ✅ Have persistent user accounts
- ✅ Save all submissions to database
- ✅ Work with proper authentication

## 📞 **Need Help?**

If you run into issues:
1. Check your MongoDB Atlas connection string
2. Verify network access is set to 0.0.0.0/0
3. Make sure the database user has correct permissions
4. Check the `.env.local` file exists and has correct values

Your data will now be stored in the cloud database! 🚀
