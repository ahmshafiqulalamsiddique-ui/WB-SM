import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { recoverUser } from "@/lib/users";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 Recover user API called for ID:', params.id);
    
    // Check if user is admin
    const session = await getSession();
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    console.log('📝 Recover request for user ID:', id);

    // Recover user using MySQL
    console.log('🔄 Recovering user in MySQL...');
    const result = await recoverUser(id);

    if (!result.success) {
      console.log('❌ User recovery failed:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    console.log('✅ User recovered successfully:', result.message);

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('❌ Error recovering user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
