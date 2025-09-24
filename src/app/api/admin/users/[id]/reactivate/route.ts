import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { reactivateUser } from "@/lib/users";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await getSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    console.log('🔄 Reactivating user in MySQL...');
    // Reactivate user using MySQL
    const result = await reactivateUser(params.id);

    if (!result.success) {
      console.log('❌ User reactivation failed:', result.message);
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    console.log('✅ User reactivated successfully:', result.message);

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('❌ Error reactivating user:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}