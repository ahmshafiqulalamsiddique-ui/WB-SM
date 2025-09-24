import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/mysql-database";

export async function GET() {
  try {
    console.log('🔑 Fetching admin credentials from database...');
    
    // Get admin user from database with plain text password
    const query = "SELECT email, plain_text_password FROM users WHERE role = 'admin' AND status = 'active' LIMIT 1";
    const rows = await executeQuery(query, []) as any[];
    
    if (rows.length === 0) {
      console.log('❌ No admin user found in database');
      return NextResponse.json({ 
        success: false, 
        error: 'No admin user found' 
      }, { status: 404 });
    }
    
    const adminUser = rows[0];
    console.log('✅ Admin user found:', adminUser.email);
    
    if (!adminUser.plain_text_password) {
      console.log('❌ No plain text password found for admin user');
      return NextResponse.json({ 
        success: false, 
        error: 'No plain text password found' 
      }, { status: 404 });
    }
    
    const credentials = {
      email: adminUser.email,
      password: adminUser.plain_text_password
    };
    
    console.log('🔑 Returning admin credentials from database');
    
    return NextResponse.json({ 
      success: true,
      credentials: credentials
    });

  } catch (error) {
    console.error("❌ Error fetching admin credentials:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch admin credentials" 
    }, { status: 500 });
  }
}
