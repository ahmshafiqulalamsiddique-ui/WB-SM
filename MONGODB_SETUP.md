# MongoDB Setup Guide

This application has been migrated to use MongoDB as the primary database. The system will automatically fall back to the local database if MongoDB is not configured.

## Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=datacollect

# Optional: Supabase fallback (if you want to keep Supabase as backup)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## MongoDB Installation

### Option 1: Local MongoDB Installation

1. **Windows:**
   - Download MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Install and start the MongoDB service
   - Default connection: `mongodb://localhost:27017`

2. **macOS:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

3. **Linux:**
   ```bash
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Create a free account and cluster
3. Get your connection string
4. Set `MONGODB_URI` to your Atlas connection string

## Database Collections

The application will automatically create these collections:

- `submissions` - Data submission records
- `users` - User accounts and roles

## Migration from Supabase

The application automatically detects which database to use:

1. **MongoDB** (if `MONGODB_URI` is configured)
2. **Supabase** (if `NEXT_PUBLIC_SUPABASE_URL` is configured)
3. **Local Database** (fallback for development)

## Testing the Setup

1. Start your MongoDB instance
2. Set the environment variables
3. Run the application: `npm run dev`
4. Check the console for: `✅ Connected to MongoDB`

## Data Migration

If you have existing data in Supabase, you can:

1. Export your data from Supabase
2. Use the MongoDB import tools to load the data
3. Or start fresh with the new MongoDB setup

## Troubleshooting

- **Connection Error**: Check if MongoDB is running and the URI is correct
- **Authentication Error**: Verify your MongoDB credentials
- **Database Not Found**: The application will create the database automatically

## Benefits of MongoDB

- **Flexible Schema**: Easy to add new fields without migrations
- **Better Performance**: Optimized for document-based data
- **Scalability**: Easy to scale horizontally
- **JSON Native**: Perfect for JavaScript applications
