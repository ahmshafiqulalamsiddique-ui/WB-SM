# 🔧 MySQL Database Setup Guide

## 1️⃣ **Create Environment Variables**

Create a `.env.local` file in your project root with these MySQL settings:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=taleskillz_db
MYSQL_PORT=3306

# Session Configuration
NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long-change-this
NEXTAUTH_URL=http://localhost:3000

# Public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Disable MongoDB/Supabase (we're using MySQL only)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MONGODB_URI=
```

## 2️⃣ **Set Up MySQL Database**

### Option A: Local MySQL (for testing)
1. Install MySQL locally
2. Create database: `CREATE DATABASE taleskillz_db;`
3. Use root user or create a new user

### Option B: Hostinger MySQL (for production)
1. Go to Hostinger panel → **Databases** → **MySQL Databases**
2. Create database: `taleskillz_db`
3. Create user: `taleskillz_user`
4. Set strong password
5. Update `.env.local` with Hostinger credentials

## 3️⃣ **Initialize Database**

Run the initialization script:
```bash
npm run mysql:init
```

This will:
- ✅ Create all required tables
- ✅ Insert admin and demo users
- ✅ Set up proper indexes
- ✅ Hash all passwords securely

## 4️⃣ **Start Application**

```bash
npm run dev
```

## 5️⃣ **Login Credentials**

After initialization, you can login with:
- **Admin**: admin@datacollect.app / admin123
- **Submitter**: submitter@datacollect.app / submitter123
- **Reviewer**: reviewer@datacollect.app / reviewer123
- **Approver**: approver@datacollect.app / approver123

## 🚨 **Troubleshooting**

### Login Failed Error
1. Make sure MySQL is running
2. Check `.env.local` has correct credentials
3. Run `npm run mysql:init` to create users
4. Restart the application: `npm run dev`

### Database Connection Error
1. Verify MySQL credentials in `.env.local`
2. Ensure MySQL service is running
3. Check database `taleskillz_db` exists
4. Test connection manually

### Password Issues
- All passwords are hashed with bcryptjs
- Use the exact passwords shown above
- Don't change passwords in database directly

## 🎯 **Next Steps**

Once login works:
1. Test all user roles
2. Create new submissions
3. Test approval workflow
4. Deploy to Hostinger

## 📞 **Support**

If you still have issues:
1. Check console logs for errors
2. Verify MySQL connection
3. Ensure all environment variables are set
4. Run database initialization again