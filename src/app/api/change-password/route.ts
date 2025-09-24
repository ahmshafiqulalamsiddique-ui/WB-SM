import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { executeQuery } from "@/lib/mysql-database";

export async function POST(req: Request) {
  try {
    console.log('🔑 Change password API called');
    const session = await getSession();
    console.log('🔑 Session:', session);
    if (!session.user) {
      console.log('❌ No user in session');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ User in session:', session.user.email);

    const body = await req.json();
    const { oldPassword, newPassword, confirmPassword } = body;
    
    console.log('🔑 Received data:', {
      oldPassword: oldPassword ? '[HIDDEN]' : '[EMPTY]',
      newPassword: newPassword ? '[HIDDEN]' : '[EMPTY]',
      confirmPassword: confirmPassword ? '[HIDDEN]' : '[EMPTY]'
    });

    if (!oldPassword || !newPassword || !confirmPassword) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        error: 'All password fields are required' 
      }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match');
      return NextResponse.json({ 
        success: false, 
        error: 'New passwords do not match' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json({ 
        success: false, 
        error: 'New password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Verify old password first
    console.log('🔑 Verifying old password for:', session.user.email);
    const bcrypt = require('bcryptjs');
    
    // Get user's current password hash
    const query = "SELECT password FROM users WHERE email = ?";
    const rows = await executeQuery(query, [session.user.email]) as any[];
    
    if (rows.length === 0) {
      console.log('❌ User not found in database');
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    const currentPasswordHash = rows[0].password;
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, currentPasswordHash);
    
    if (!isOldPasswordCorrect) {
      console.log('❌ Old password is incorrect');
      return NextResponse.json({ 
        success: false, 
        error: 'Current password is incorrect' 
      }, { status: 400 });
    }

    // Update password using MySQL
    console.log('🔑 Updating password for:', session.user.email);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updateQuery = "UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?";
    await executeQuery(updateQuery, [newPasswordHash, session.user.email]);
    
    console.log('✅ Password updated successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error("Change password API error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to change password" 
    }, { status: 500 });
  }
}
