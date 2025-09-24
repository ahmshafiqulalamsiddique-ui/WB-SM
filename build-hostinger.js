const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Hostinger deployment...');

// Create production build
const { execSync } = require('child_process');

try {
  console.log('📦 Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

  // Create deployment package
  console.log('📁 Creating deployment package...');
  
  // Create deployment directory
  const deployDir = 'hostinger-deploy';
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true });
  }
  fs.mkdirSync(deployDir);

  // Copy necessary files
  const filesToCopy = [
    '.next',
    'public',
    'package.json',
    'package-lock.json',
    'next.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'tsconfig.json',
    'src',
    'node_modules'
  ];

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      const dest = path.join(deployDir, file);
      if (fs.statSync(file).isDirectory()) {
        fs.cpSync(file, dest, { recursive: true });
      } else {
        fs.copyFileSync(file, dest);
      }
      console.log(`✅ Copied ${file}`);
    }
  });

  // Create .htaccess for Hostinger
  const htaccessContent = `# Hostinger Next.js Configuration
RewriteEngine On

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.php [QSA,L]

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

# Cache static assets
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

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
`;

  fs.writeFileSync(path.join(deployDir, '.htaccess'), htaccessContent);
  console.log('✅ Created .htaccess file');

  // Create environment template
  const envTemplate = `# Hostinger Environment Configuration
# Replace these values with your actual Hostinger MySQL credentials

MYSQL_HOST=localhost
MYSQL_USER=your_hostinger_mysql_user
MYSQL_PASSWORD=your_hostinger_mysql_password
MYSQL_DATABASE=your_hostinger_mysql_database
MYSQL_PORT=3306

NEXTAUTH_SECRET=taleskillz-super-secret-key-32-chars-long-change-this
NEXTAUTH_URL=https://taleskillz.com
NEXT_PUBLIC_APP_URL=https://taleskillz.com

NODE_ENV=production
`;

  fs.writeFileSync(path.join(deployDir, '.env.production'), envTemplate);
  console.log('✅ Created .env.production template');

  // Create deployment instructions
  const instructions = `# 🚀 Hostinger Deployment Instructions

## 1️⃣ **Upload Files**
1. Zip the entire 'hostinger-deploy' folder
2. Upload to Hostinger File Manager
3. Extract in public_html directory

## 2️⃣ **Set Up MySQL Database**
1. Go to Hostinger panel → Databases → MySQL Databases
2. Create database: taleskillz_db
3. Create user: taleskillz_user
4. Set strong password
5. Note down credentials

## 3️⃣ **Configure Environment**
1. Edit .env.production file
2. Replace MySQL credentials with your Hostinger values:
   - MYSQL_USER=your_hostinger_mysql_user
   - MYSQL_PASSWORD=your_hostinger_mysql_password
   - MYSQL_DATABASE=your_hostinger_mysql_database

## 4️⃣ **Initialize Database**
1. Run: node init-mysql-database.js
2. This creates all tables and admin user

## 5️⃣ **Start Application**
1. Your site will be live at: https://taleskillz.com
2. Login with: admin@datacollect.app / admin123

## 📞 **Support**
If you need help, check the deployment logs in Hostinger panel.
`;

  fs.writeFileSync(path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions);
  console.log('✅ Created deployment instructions');

  console.log('');
  console.log('🎉 Hostinger deployment package created successfully!');
  console.log('');
  console.log('📁 Package location: ./hostinger-deploy/');
  console.log('📋 Next steps:');
  console.log('   1. Zip the hostinger-deploy folder');
  console.log('   2. Upload to Hostinger File Manager');
  console.log('   3. Extract in public_html');
  console.log('   4. Set up MySQL database');
  console.log('   5. Configure .env.production');
  console.log('   6. Run database initialization');
  console.log('   7. Your site will be live at taleskillz.com!');

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
