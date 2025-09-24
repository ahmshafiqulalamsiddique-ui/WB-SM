import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔧 Testing Environment Variables...');
    
    const envVars = {
      MYSQL_HOST: process.env.MYSQL_HOST,
      MYSQL_USER: process.env.MYSQL_USER,
      MYSQL_DATABASE: process.env.MYSQL_DATABASE,
      MYSQL_PORT: process.env.MYSQL_PORT,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    };
    
    console.log('🔧 Environment Variables:', envVars);
    
    return NextResponse.json({
      success: true,
      environment: envVars,
      message: 'Environment variables logged to console'
    });
  } catch (error) {
    console.error('❌ Error testing environment variables:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
