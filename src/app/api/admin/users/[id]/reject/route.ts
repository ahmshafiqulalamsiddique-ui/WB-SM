import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rejectUser } from '@/lib/users';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('❌ Reject user API called for ID:', params.id);
    
    // Check if user is admin
    const session = await getSession();
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { id } = params;

    console.log('🔄 Rejecting user in MySQL...');
    // Reject user using MySQL
    const result = await rejectUser(id);

    if (!result.success) {
      console.log('❌ User rejection failed:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    console.log('✅ User rejected successfully:', result.message);

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('❌ Error rejecting user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}