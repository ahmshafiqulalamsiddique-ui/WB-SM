import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    console.log('👤 User API called');
    
    const session = await getSession();
    console.log('👤 Session data:', session);
    
    if (!session.user) {
      console.log('❌ No user in session');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    console.log('👤 Current user:', session.user.email, session.user.role);

    const userData = {
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      id: session.user.id
    };
    
    console.log('👤 Returning user data:', userData);

    return NextResponse.json({ 
      user: userData
    });

  } catch (error) {
    console.error('❌ User API error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}