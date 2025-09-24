// Vercel Environment Variables Setup Helper
console.log('🚀 Vercel Environment Variables Setup');
console.log('=====================================');
console.log('');

console.log('📋 Required Environment Variables for Vercel:');
console.log('');

console.log('1. MONGODB_URI');
console.log('   Value: mongodb+srv://username:password@cluster.mongodb.net/datacollect');
console.log('   Description: MongoDB Atlas connection string');
console.log('');

console.log('2. NEXTAUTH_SECRET');
console.log('   Value: your-super-secret-key-32-chars-long');
console.log('   Description: Session encryption key');
console.log('');

console.log('3. NEXTAUTH_URL');
console.log('   Value: https://your-project-name.vercel.app');
console.log('   Description: Your Vercel app URL');
console.log('');

console.log('🔧 How to add these in Vercel:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Click "Settings" tab');
console.log('3. Click "Environment Variables"');
console.log('4. Add each variable with its value');
console.log('5. Click "Save"');
console.log('');

console.log('📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md');
console.log('');

// Generate a random secret key
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('🔑 Generated NEXTAUTH_SECRET for you:');
console.log(secretKey);
console.log('');
console.log('💡 Copy this secret key and use it as your NEXTAUTH_SECRET value in Vercel!');
