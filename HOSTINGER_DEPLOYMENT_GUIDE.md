# 🌐 Hostinger VPS Deployment Guide

## Complete Setup: Hostinger VPS + MongoDB Atlas + Next.js + taleskillz.com

This guide will help you deploy your WB-SM application to your Hostinger VPS (srv1024097.hstgr.cloud) with your domain taleskillz.com and MongoDB Atlas as your database.

## 📋 Prerequisites

- ✅ Hostinger VPS: srv1024097.hstgr.cloud (Running)
- ✅ Domain: taleskillz.com
- ✅ IP Address: 72.60.101.107
- MongoDB Atlas account (free tier available)
- Your project files ready

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up/Login with your account
3. Click "Build a Database"

### 1.2 Create a New Cluster
1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** provider
3. Choose region closest to your users (e.g., **US East (N. Virginia)**)
4. Cluster name: `WB-SM-Cluster`
5. Click "Create Cluster"

### 1.3 Set Up Database Access
1. Go to **Database Access** in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `wb-admin`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: `Read and write to any database`
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to **Network Access** in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to **Database** → **Connect**
2. Choose "Connect your application"
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `datacollect`

**Example connection string:**
```
mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
```

## 🏗️ Step 2: Prepare Your Project for Hostinger

### 2.1 Configure Next.js for Static Export

Your project needs to be configured for static export since Hostinger shared hosting doesn't support Node.js server-side rendering.

Update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features for static export
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
```

### 2.2 Create Environment Configuration

Create a `.env.production` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://wb-admin:YourPassword123@wb-sm-cluster.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority

# Session Configuration
NEXTAUTH_SECRET=your-super-secret-key-32-chars-long
NEXTAUTH_URL=https://yourdomain.com

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
```

### 2.3 Update Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:static": "next build",
    "export": "next build && next export",
    "deploy:hostinger": "npm run build:static && npm run export"
  }
}
```

## 🚀 Step 3: Build Your Project

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Build for Production
```bash
npm run build:static
```

### 3.3 Export Static Files
```bash
npm run export
```

This creates an `out` folder with all your static files ready for upload.

## 📤 Step 4: Deploy to Your VPS

### 4.1 Access Your VPS

Since you have a VPS, you have two deployment options:

**Option A: Node.js Application (Recommended for VPS)**
Since you have a VPS, you can run the full Next.js application with server-side rendering:

1. SSH into your VPS: `ssh root@72.60.101.107`
2. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
3. Install PM2: `npm install -g pm2`
4. Upload your project files to `/var/www/taleskillz.com`
5. Install dependencies: `npm install`
6. Set up environment variables
7. Start with PM2: `pm2 start npm --name "taleskillz" -- start`

**Option B: Static Files (Simpler)**
1. Build static files: `npm run build:static`
2. Upload `out` folder contents to `/var/www/html` or `/var/www/taleskillz.com`
3. Configure Nginx to serve static files

### 4.3 Set Up .htaccess File

Create a `.htaccess` file in `public_html` to handle routing:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🔧 Step 5: Configure Database Connection

Since you're using static export, you'll need to handle database operations through API routes. Your existing API routes should work, but you need to ensure they're properly configured.

### 5.1 Update API Routes for Static Hosting

Your API routes in `src/app/api/` should already be configured for MongoDB. Make sure they handle CORS properly:

```typescript
// Example API route configuration
export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers })
  }

  // Your existing API logic here
  // ...
}
```

## 🌐 Step 6: Set Up Domain (Optional)

### 6.1 Using Custom Domain
1. In Hostinger control panel, go to **Domains**
2. Add your domain
3. Point DNS to Hostinger nameservers
4. Wait for DNS propagation (24-48 hours)

### 6.2 Using Subdomain
1. Create subdomain in Hostinger control panel
2. Point it to `public_html` folder
3. Access via `https://yoursubdomain.hostinger.com`

## 🧪 Step 7: Test Your Deployment

### 7.1 Basic Functionality Test
1. Visit your website URL
2. Test user registration
3. Test login functionality
4. Test data entry forms
5. Test admin panel access

### 7.2 Database Connection Test
1. Try creating a new user
2. Check MongoDB Atlas dashboard for new data
3. Verify data persistence across page refreshes

## 🔒 Step 8: Security Configuration

### 8.1 SSL Certificate
Hostinger provides free SSL certificates:
1. Go to **SSL** in control panel
2. Enable "Let's Encrypt" SSL
3. Wait for activation (5-10 minutes)

### 8.2 Environment Variables
Since static hosting doesn't support server-side environment variables, you'll need to:
1. Use client-side configuration for public variables
2. Keep sensitive data in MongoDB Atlas
3. Use API routes for secure operations

## 📊 Step 9: Initialize Database

### 9.1 Create Admin User
1. Visit your live site
2. Go to `/register` page
3. Register with admin credentials:
   - Email: `admin@datacollect.app`
   - Password: `33333333`
   - Role: `admin`

### 9.2 Test All Features
- User registration and login
- Data entry forms
- Admin panel access
- User management
- Data approval workflow

## 🚨 Troubleshooting

### Common Issues:

**1. Database Connection Failed**
- Check MongoDB Atlas connection string
- Verify network access is set to 0.0.0.0/0
- Ensure database user has correct permissions

**2. Pages Not Loading**
- Check .htaccess file is uploaded correctly
- Verify all files are in public_html folder
- Check file permissions (should be 644 for files, 755 for folders)

**3. API Routes Not Working**
- Ensure API routes are in the correct folder structure
- Check CORS configuration
- Verify MongoDB connection in API routes

**4. Images Not Loading**
- Check image paths are correct
- Ensure images are uploaded to public folder
- Verify file permissions

## 📈 Performance Optimization

### 1. Enable Compression
The .htaccess file already includes compression settings.

### 2. Set Cache Headers
Cache headers are configured in .htaccess for static assets.

### 3. Optimize Images
- Use WebP format where possible
- Compress images before upload
- Use appropriate image sizes

## 🔄 Update Process

To update your website:

1. Make changes locally
2. Test with `npm run dev`
3. Build with `npm run build:static`
4. Export with `npm run export`
5. Upload new files to Hostinger
6. Test live site

## 💰 Cost Breakdown

- **Hostinger Shared Hosting**: $1.99-3.99/month
- **MongoDB Atlas**: Free tier (500MB storage)
- **Domain**: $10-15/year (optional)
- **Total**: ~$2-5/month

## 🎉 Success!

Your WB-SM application is now live on Hostinger with:
- ✅ **Live URL** accessible worldwide
- ✅ **MongoDB Atlas** cloud database
- ✅ **SSL Certificate** for security
- ✅ **Static hosting** optimized for performance
- ✅ **Full functionality** preserved

## 📞 Support

If you need help:
- **Hostinger Support**: Available 24/7
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Static Export**: https://nextjs.org/docs/advanced-features/static-html-export

Your application is now ready for production use! 🚀
