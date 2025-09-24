import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getRows } from "@/lib/database";

export async function GET() {
  try {
    console.log('📋 List API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json([], { status: 401 });
    }

    console.log('📋 Fetching all submissions for user:', session.user.email);

    // Get all submissions from database
    const submissions = await getRows();
    
    console.log('📋 Retrieved submissions:', submissions.length);

    return NextResponse.json(submissions);

  } catch (error) {
    console.error('❌ List API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}