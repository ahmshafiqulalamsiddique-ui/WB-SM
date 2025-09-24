import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateUser, deleteUser } from "@/lib/users";

// PUT /api/admin/users/[id] - Update user (status, etc.)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  console.log('🔐 PUT request - checking session...');
  console.log('🔐 Request URL:', req.url);
  console.log('🔐 User ID from params:', params.id, typeof params.id);
  console.log('🔐 Request headers:', Object.fromEntries(req.headers.entries()));
  
  const session = await getSession();
  console.log('🔐 Session data:', { user: session.user?.email, role: session.user?.role, hasUser: !!session.user });
  console.log('🔐 Session keys:', Object.keys(session));
  
  if (!session.user || session.user.role !== "admin") {
    console.log('❌ Access denied - not admin');
    console.log('❌ Session user:', session.user);
    console.log('❌ Session keys:', Object.keys(session));
    return NextResponse.json({ ok: false, message: "Access denied" }, { status: 403 });
  }
  
  console.log('✅ Admin access confirmed');

  try {
    const body = await req.json();
    const { isActive, role, name } = body;

    console.log('🔄 PUT request received:', { userId: params.id, isActive, role, name, adminEmail: session.user.email });

    // Prevent admin from deactivating themselves
    if (isActive === false && session.user.id === params.id) {
      console.log('❌ Admin trying to deactivate themselves');
      return NextResponse.json({ 
        ok: false, 
        message: "Admin cannot deactivate their own account" 
      }, { status: 400 });
    }

    // Build update object
    const updates: any = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role) updates.role = role;
    if (name) updates.name = name;

    console.log('🔄 Updating user in MySQL:', params.id, updates);

    // Update user in MySQL database
    const updatedUser = await updateUser(params.id, updates);

    if (!updatedUser) {
      console.log('❌ User not found after update');
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    console.log('✅ User updated successfully:', updatedUser);

    return NextResponse.json({
      ok: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Failed to update user:", error);
    return NextResponse.json({ ok: false, message: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🗑️ DELETE API endpoint called for user ID:', params.id, typeof params.id);
    console.log('🗑️ Request URL:', req.url);
    
    const session = await getSession();
    console.log('🗑️ Session data:', { user: session.user?.email, role: session.user?.role, hasUser: !!session.user });
    
    if (!session.user || session.user.role !== "admin") {
      console.log('🗑️ Access denied - user not admin');
      return NextResponse.json({ 
        success: false, 
        message: "Access denied" 
      }, { status: 403 });
    }
    
    console.log('✅ Admin access confirmed for DELETE');

    // Prevent admin from deleting themselves
    if (session.user.id === params.id) {
      console.log('🗑️ Admin cannot delete themselves');
      return NextResponse.json({ 
        success: false, 
        message: "Admin cannot delete their own account" 
      }, { status: 400 });
    }

    console.log('🗑️ Admin access confirmed, deleting user from MySQL...');
    
    // Delete user from MySQL
    const result = await deleteUser(params.id);

    if (!result.success) {
      console.log('🗑️ User deletion failed:', result.message);
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 400 });
    }

    console.log('🗑️ User deleted successfully:', result.message);
    
    return NextResponse.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error("🗑️ Failed to delete user:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete user" 
    }, { status: 500 });
  }
}