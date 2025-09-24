# 🚀 Quick MongoDB Atlas Setup (Cloud Database)

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" 
3. Sign up with your email
4. Choose "Free Shared" cluster

## Step 2: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `datacollect-user`
5. Create password: `datacollect123` (or your choice)
6. Click "Add User"

## Step 3: Get Connection String
1. Go to "Clusters" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `datacollect`

## Step 4: Set Environment Variable
Create a `.env.local` file in your project root:

```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://datacollect-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/datacollect?retryWrites=true&w=majority
MONGODB_DB=datacollect

# Disable Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Step 5: Initialize Database
```bash
npm run mongodb:init
```

## Step 6: Start Application
```bash
npm run dev
```

That's it! Your app will now use MongoDB Atlas as the primary database.
