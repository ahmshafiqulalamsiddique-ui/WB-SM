import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { approveUser } from '@/lib/users';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('✅ Approve user API called for ID:', params.id);
    
    // Check if user is admin
    const session = await getSession();
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    console.log('📝 Approve request for user ID:', id);

    // Approve user using MySQL
    console.log('🔄 Approving user in MySQL...');
    const result = await approveUser(id);

    if (!result.success) {
      console.log('❌ User approval failed:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    console.log('✅ User approved successfully:', result.message);

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('❌ Error approving user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}