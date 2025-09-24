import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllUsers, createUser } from "@/lib/users";

// GET /api/admin/users - Get all users and stats
export async function GET() {
  const { user } = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Access denied" }, { status: 403 });
  }

  try {
    console.log('🔍 Admin fetching all users...');
    
    // Get all users from MySQL
    const users = await getAllUsers();
    
    console.log(`✅ Found ${users.length} users in database`);
    
    // Calculate stats
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      submitters: users.filter(u => u.role === 'submitter').length,
      reviewers: users.filter(u => u.role === 'reviewer').length,
      approvers: users.filter(u => u.role === 'approver').length,
      admins: users.filter(u => u.role === 'admin').length,
    };

    const availableRoles = ['submitter', 'reviewer', 'approver', 'admin'];

    return NextResponse.json({
      ok: true,
      users: users || [],
      stats,
      availableRoles
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(req: Request) {
  const { user } = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Access denied" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, role, fullName, password } = body;

    if (!email || !role || !fullName || !password) {
      return NextResponse.json(
        { ok: false, message: 'Email, role, full name, and password are required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Admin creating new user: ${email} with role: ${role}`);

    // Create user using MySQL
    const newUser = await createUser({
      email,
      role: role as any,
      name: fullName,
      password,
      isActive: true
    });

    console.log(`✅ User created successfully: ${newUser.email}`);

    return NextResponse.json({
      ok: true,
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}