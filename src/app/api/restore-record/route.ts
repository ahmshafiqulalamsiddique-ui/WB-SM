import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateSpecificRow } from "@/lib/database";

export async function POST(req: Request) {
  try {
    console.log('🔄 Restore record API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { id, savedAt } = body;

    console.log('🔄 Restore request:', { id, savedAt });

    // Get the current record to verify it exists
    const { getRowById, updateRow } = await import('@/lib/database');
    const currentRecord = await getRowById(id);

    if (!currentRecord) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    // Restore record status to 'draft'
    const updates = {
      status: 'draft',
      restoredBy: session.user.email,
      restoredAt: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };

    console.log('🔄 Restoring record:', id, 'with updates:', updates);

    // Use updateRow instead of updateSpecificRow to avoid timestamp issues
    const result = await updateRow(id, updates);

    if (result) {
      console.log('✅ Record restored successfully');
      return NextResponse.json({ success: true, message: 'Record restored to draft successfully' });
    } else {
      console.log('❌ Failed to restore record');
      return NextResponse.json({ success: false, error: 'Failed to restore record' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Restore record error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}