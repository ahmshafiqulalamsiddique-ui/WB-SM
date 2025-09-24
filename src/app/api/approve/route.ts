import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateSpecificRow } from "@/lib/database";

export async function POST(req: Request) {
  try {
    console.log('👑 Approve API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is approver or admin
    if (!['approver', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { id, savedAt, action, message } = body; // action: 'approve' or 'reject'

    console.log('👑 Approve request:', { id, savedAt, action, message });

    // Get the current record to get savedAt timestamp
    const currentRecord = await fetch(`${req.url.replace('/api/approve', '/api/list')}`)
      .then(res => res.json())
      .then(data => data.find((item: any) => item.id === id));

    if (!currentRecord) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    // Prepare updates based on action
    const updates: any = {
      savedAt: new Date().toISOString(),
      approverMessage: message || ''
    };

    if (action === 'approve') {
      updates.status = 'approved';
      updates.approvedBy = session.user.email;
      updates.approvedAt = new Date().toISOString();
    } else if (action === 'reject') {
      updates.status = 'rejected';
      updates.rejectedBy = session.user.email;
      updates.rejectedAt = new Date().toISOString();
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    console.log('👑 Updating record:', id, 'with updates:', updates);

    const result = await updateSpecificRow(id, currentRecord.savedAt, updates);

    if (result) {
      console.log('✅ Record approved/rejected successfully');
      return NextResponse.json({ 
        success: true, 
        message: `Record ${action}d successfully`,
        newStatus: updates.status
      });
    } else {
      console.log('❌ Failed to approve/reject record');
      return NextResponse.json({ success: false, error: 'Failed to process record' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Approve API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}