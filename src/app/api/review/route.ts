import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateSpecificRow } from "@/lib/database";

export async function POST(req: Request) {
  try {
    console.log('👨‍💼 Review API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is reviewer or admin
    if (!['reviewer', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { id, savedAt, action, message } = body; // action: 'reviewed' or 'rejected'
    
    // Map action to decision for backward compatibility
    const decision = action;
    const note = message;

    console.log('👨‍💼 Review request:', { id, decision, note });

    // Get the current record to get savedAt timestamp
    const { getRowById } = await import('@/lib/database');
    const currentRecord = await getRowById(id);

    if (!currentRecord) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    // Prepare updates based on decision
    const updates: any = {
      savedAt: new Date().toISOString(),
      reviewedBy: session.user.email,
      reviewedAt: new Date().toISOString(),
      reviewerMessage: note || ''
    };

    if (decision === 'reviewed') {
      updates.status = 'reviewed';
    } else if (decision === 'rejected') {
      updates.status = 'rejected';
      updates.rejectedBy = session.user.email;
      updates.rejectedAt = new Date().toISOString();
    } else {
      return NextResponse.json({ success: false, error: 'Invalid decision' }, { status: 400 });
    }

    console.log('👨‍💼 Updating record:', id, 'with updates:', updates);

    const result = await updateSpecificRow(id, currentRecord.savedAt, updates);

    if (result) {
      console.log('✅ Record reviewed successfully');
      return NextResponse.json({ 
        success: true, 
        message: `Record ${decision}d successfully`,
        newStatus: updates.status
      });
    } else {
      console.log('❌ Failed to review record');
      return NextResponse.json({ success: false, error: 'Failed to review record' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Review API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}