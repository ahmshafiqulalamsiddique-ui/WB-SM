# 🚀 Complete Setup Guide: MongoDB Atlas + Vercel + GitHub

## Step-by-Step Instructions to Deploy Your WB-SM Application

### **Phase 1: Set Up MongoDB Atlas (Cloud Database)**

#### **Step 1.1: Create MongoDB Atlas Account**
1. **Go to**: https://cloud.mongodb.com
2. **Click "Try Free"** or "Sign Up"
3. **Fill in details**:
   - Email: `ahmshafiqulalamsiddique@gmail.com`
   - Password: `YourSecurePassword123!`
   - First Name: `Ahmshafiqul`
   - Last Name: `Alamsiddique`
4. **Click "Create Account"**

#### **Step 1.2: Create Your First Cluster**
1. **Choose "Build a Database"**
2. **Select "M0 Sandbox"** (FREE tier)
3. **Choose Provider**: `AWS`
4. **Choose Region**: `US East (N. Virginia)`
5. **Cluster Name**: `WB-SM-Cluster`
6. **Click "Create Cluster"** (takes 3-5 minutes)

#### **Step 1.3: Create Database User**
1. **Click "Database Access"** in left menu
2. **Click "Add New Database User"**
3. **Authentication Method**: `Password`
4. **Username**: `wb-admin`
5. **Password**: `WB-SM-Password123!` (remember this!)
6. **Database User Privileges**: `Read and write to any database`
7. **Click "Add User"**

#### **Step 1.4: Whitelist IP Addresses**
1. **Click "Network Access"** in left menu
2. **Click "Add IP Address"**
3. **Select "Allow Access from Anywhere"** (0.0.0.0/0)
4. **Click "Confirm"**

#### **Step 1.5: Get Connection String**
1. **Go back to "Database"** in left menu
2. **Click "Connect"** on your cluster
3. **Select "Connect your application"**
4. **Driver**: `Node.js`
5. **Version**: `4.1 or later`
6. **Copy the connection string** (looks like this):
   ```
   mongodb+srv://wb-admin:<password>@wb-sm-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace `<password>`** with `WB-SM-Password123!`
8. **Add database name** at the end: `/datacollect`
9. **Final connection string**:
   ```
   mongodb+srv://wb-admin:WB-SM-Password123!@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
   ```

### **Phase 2: Deploy to Vercel**

#### **Step 2.1: Go to Vercel**
1. **Open**: https://vercel.com
2. **Click "Sign Up"** or "Log In"
3. **Choose "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub account

#### **Step 2.2: Import Your Project**
1. **Click "New Project"**
2. **Find "ahmshafiqulalamsiddique-ui/WB-SM"** in the list
3. **Click "Import"** next to it
4. **Project Name**: `WB-SM` (or keep default)
5. **Framework**: `Next.js` (auto-detected)
6. **Root Directory**: `./` (keep default)

#### **Step 2.3: Add Environment Variables**
1. **Click "Environment Variables"** section
2. **Add these 3 variables**:

   **Variable 1:**
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://wb-admin:WB-SM-Password123!@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority`
   - (Use your actual connection string from Step 1.5)

   **Variable 2:**
   - Name: `NEXTAUTH_SECRET`
   - Value: `7c17afea45ec8238befd5e8b1b3b4e1e77323d535c3e49ae1211ca5e84083241`

   **Variable 3:**
   - Name: `NEXTAUTH_URL`
   - Value: `https://wb-sm-ahmshafiqulalamsiddique-ui.vercel.app`
   - (This will be updated after deployment)

#### **Step 2.4: Deploy**
1. **Click "Deploy"** button
2. **Wait 2-3 minutes** for deployment
3. **Copy your live URL** (something like `https://wb-sm-ahmshafiqulalamsiddique-ui.vercel.app`)

#### **Step 2.5: Update NEXTAUTH_URL**
1. **Go to "Settings"** → "Environment Variables"
2. **Edit NEXTAUTH_URL** with your actual Vercel URL
3. **Redeploy** the project

### **Phase 3: Test Your Live Application**

#### **Step 3.1: Access Your Live Site**
1. **Open your Vercel URL** in browser
2. **You should see** the login page

#### **Step 3.2: Login as Admin**
1. **Email**: `admin@datacollect.app`
2. **Password**: `33333333`
3. **Click "Sign in"**

#### **Step 3.3: Verify Everything Works**
1. **Check admin panel** loads
2. **Check user management** works
3. **Check data entry** works
4. **Check all features** are functional

### **Phase 4: Set Up Auto-Deployments**

#### **Step 4.1: Enable Auto-Deploy**
1. **In Vercel dashboard**
2. **Go to "Settings"** → "Git"
3. **Ensure "Automatic deployments"** is enabled
4. **Every push to GitHub** will auto-deploy

#### **Step 4.2: Test Auto-Deploy**
1. **Make a small change** to your local code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. **Check Vercel** - new deployment should start automatically

## 🎉 **Success! Your Application is Live**

### **What You Now Have:**
- ✅ **Live Website**: Accessible worldwide
- ✅ **Cloud Database**: MongoDB Atlas
- ✅ **Auto-Deployments**: From GitHub to Vercel
- ✅ **Professional Hosting**: Vercel platform
- ✅ **Full Functionality**: All features working

### **Your Live URLs:**
- **Main App**: `https://wb-sm-ahmshafiqulalamsiddique-ui.vercel.app`
- **GitHub Repo**: `https://github.com/ahmshafiqulalamsiddique-ui/WB-SM`
- **MongoDB Atlas**: `https://cloud.mongodb.com`

### **Admin Access:**
- **Email**: `admin@datacollect.app`
- **Password**: `33333333`

## 🆘 **Troubleshooting**

### **If MongoDB connection fails:**
- Check connection string is correct
- Verify database user credentials
- Ensure IP is whitelisted (0.0.0.0/0)

### **If Vercel deployment fails:**
- Check environment variables are set
- Verify build logs in Vercel dashboard
- Ensure all dependencies are in package.json

### **If login doesn't work:**
- Database might not be initialized
- Check MongoDB Atlas for data
- Verify password hashes

## 📞 **Need Help?**

If you get stuck at any step:
1. **Check the error messages** carefully
2. **Verify each step** was completed correctly
3. **Check the logs** in Vercel dashboard
4. **Ask for help** with specific error messages

Your WB-SM application will be live and professional! 🚀
