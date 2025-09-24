import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPendingUsers } from "@/lib/users";

export async function GET() {
  try {
    console.log('🔍 Pending users API called');
    
    // Check if user is admin
    const session = await getSession();
    console.log('🔍 Session check:', { 
      user: session.user?.email, 
      role: session.user?.role,
      hasUser: !!session.user,
      sessionKeys: Object.keys(session)
    });
    
    if (!session.user || session.user.role !== 'admin') {
      console.log('❌ Unauthorized access - session details:', {
        hasUser: !!session.user,
        userRole: session.user?.role,
        expectedRole: 'admin'
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Admin access confirmed, fetching pending users from MySQL...');

    // Get pending users from MySQL
    const pendingUsers = await getPendingUsers();
    console.log('⏳ Pending users found:', pendingUsers.length);
    
    console.log('🔍 Pending users API returning:', pendingUsers.length, 'users');
    console.log('📋 All pending users with details:', pendingUsers.map(u => ({ 
      id: u.id, 
      email: u.email, 
      name: u.name, 
      isActive: u.isActive,
      role: u.role 
    })));
    
    return NextResponse.json({
      success: true,
      users: pendingUsers
    });

  } catch (error) {
    console.error('❌ Error fetching pending users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}