import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateSpecificRow } from "@/lib/database";

export async function POST(req: Request) {
  try {
    console.log('🗑️ Delete record API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { id, savedAt } = body;

    console.log('🗑️ Delete request:', { id, savedAt });

    // Get the current record to get the correct savedAt timestamp
    const { getRowById, updateRow } = await import('@/lib/database');
    const currentRecord = await getRowById(id);

    if (!currentRecord) {
      return NextResponse.json({ ok: false, error: 'Record not found' }, { status: 404 });
    }

    // Update record status to 'deleted' (soft delete)
    const updates = {
      status: 'deleted',
      deletedBy: session.user.email,
      deletedAt: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };

    console.log('🗑️ Soft deleting record:', id, 'with updates:', updates);

    // Use updateRow instead of updateSpecificRow to avoid timestamp issues
    const result = await updateRow(id, updates);

    if (result) {
      console.log('✅ Record soft deleted successfully');
      return NextResponse.json({ ok: true, message: 'Record deleted successfully' });
    } else {
      console.log('❌ Failed to delete record');
      return NextResponse.json({ ok: false, error: 'Failed to delete record' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Delete record error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}