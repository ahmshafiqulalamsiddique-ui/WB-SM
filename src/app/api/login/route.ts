import { NextResponse } from "next/server";
import { getSession, login } from '@/lib/auth'
import { getUserByEmail } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Login attempt for:', email);

    // Get user from MySQL database
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('❌ User not found in database:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account not active:', email);
      return NextResponse.json(
        { success: false, error: 'Your account is pending admin approval. Please wait for approval before logging in.' },
        { status: 403 }
      );
    }

    console.log('✅ User found in database:', user.email, user.role);

    // Verify password using bcrypt
    const bcrypt = require('bcryptjs');
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordValid) {
      console.log('❌ Password verification failed for:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified for:', email);

    // Use existing login function for session management
    const result = await login(email, password);
    
    if (result.ok) {
      console.log('✅ Login successful for:', email);
      return NextResponse.json({ ok: true });
    } else {
      console.log('❌ Login failed:', result.message);
      return NextResponse.json(
        { success: false, error: result.message || 'Login failed' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


