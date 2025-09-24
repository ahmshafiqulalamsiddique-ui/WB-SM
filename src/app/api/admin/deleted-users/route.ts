import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDeletedUsers } from "@/lib/users";

export async function GET() {
  try {
    console.log('🔍 Deleted users API called');
    
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

    console.log('✅ Admin access confirmed, fetching deleted users from MySQL...');

    // Get deleted users from MySQL
    const deletedUsers = await getDeletedUsers();
    console.log('🗑️ Deleted users found:', deletedUsers.length);
    
    console.log('🔍 Deleted users API returning:', deletedUsers.length, 'users');
    console.log('📋 All deleted users with details:', deletedUsers.map(u => ({ 
      id: u.id, 
      email: u.email, 
      name: u.name, 
      isActive: u.isActive,
      role: u.role,
      deletedAt: u.deletedAt
    })));
    
    return NextResponse.json({
      success: true,
      users: deletedUsers
    });

  } catch (error) {
    console.error('❌ Error fetching deleted users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
