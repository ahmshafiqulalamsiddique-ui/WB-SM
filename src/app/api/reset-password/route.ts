import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, newPassword, confirmPassword } = body;

    if (!email || !token || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Passwords do not match' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Check if user exists
    const query = "SELECT id FROM users WHERE email = ?";
    const rows = await executeQuery(query, [email]) as any[];
    
    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid reset request' 
      }, { status: 400 });
    }

    // In production, you would:
    // 1. Validate the token from database
    // 2. Check if token is not expired
    // 3. Check if token is not already used
    // 4. Mark token as used after successful reset

    // For demo purposes, we'll accept any token for valid emails
    console.log(`🔑 Password reset request for: ${email} with token: ${token}`);

    // Reset password using MySQL
    const bcrypt = require('bcryptjs');
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updateQuery = "UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?";
    await executeQuery(updateQuery, [newPasswordHash, email]);

    console.log(`✅ Password reset successfully for: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    });

  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to reset password" 
    }, { status: 500 });
  }
}
