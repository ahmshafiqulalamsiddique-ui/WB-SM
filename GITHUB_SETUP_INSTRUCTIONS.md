# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in with your account: `ahmshafiqulalamsiddique@gmail.com`
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `WB-SM`
   - **Description**: `Data Collection Management System with MongoDB integration`
   - **Visibility**: Public (or Private if you prefer)
   - **Initialize**: Leave unchecked (we already have files)
5. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you the commands. Run these in your terminal:

```bash
# Add the remote origin
git remote add origin https://github.com/ahmshafiqulalamsiddique-ui/WB-SM.git

# Push the main branch
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Go to your repository: https://github.com/ahmshafiqulalamsiddique-ui/WB-SM
2. Verify all files are uploaded correctly
3. Check that the README.md displays properly

## Step 4: Set Up Auto-Sync (Optional)

To automatically sync changes between local and GitHub:

```bash
# Create a simple sync script
echo 'git add . && git commit -m "Auto-sync: $(date)" && git push origin main' > sync.bat

# Make it executable (Windows)
# You can now run: sync.bat
```

## Step 5: Daily Workflow

### Making Changes Locally
1. Make your changes to the code
2. Test locally with `npm run dev`
3. When ready, commit and push:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

### Getting Updates from GitHub
```bash
git pull origin main
```

## Repository Features

Your repository now includes:
- ✅ Complete Next.js application
- ✅ MongoDB integration
- ✅ User authentication system
- ✅ Admin panel with full functionality
- ✅ Data collection and review system
- ✅ Comprehensive documentation
- ✅ Proper .gitignore file
- ✅ Setup scripts and instructions

## Next Steps

1. Follow the README.md instructions to set up the application
2. Configure your MongoDB connection
3. Run `npm run mongodb:setup` to initialize the database
4. Start developing with `npm run dev`

## Support

If you need help with any step, refer to:
- README.md for application setup
- GitHub documentation for repository management
- Contact: ahmshafiqulalamsiddique@gmail.com
