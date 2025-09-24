import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateSpecificRow, getRowById } from "@/lib/database";

export async function POST(req: Request) {
  try {
    console.log('📝 Update draft API called');
    
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      indicatorId, 
      status, 
      submitterMessage, 
      value, 
      unit, 
      frequency, 
      period, 
      responsible, 
      disaggregation 
    } = body;

    console.log('📝 Update request:', { indicatorId, status, submitterMessage });

    // Get the current record to get savedAt timestamp
    const currentRecord = await getRowById(indicatorId);

    if (!currentRecord) {
      return NextResponse.json({ ok: false, error: 'Record not found' }, { status: 404 });
    }

    // Prepare updates
    const updates: any = {
      status,
      submitterMessage: submitterMessage || '',
      savedAt: new Date().toISOString()
    };

    // Add field updates if provided
    if (value !== undefined) updates.value = value;
    if (unit !== undefined) updates.unit = unit;
    if (frequency !== undefined) updates.frequency = frequency;
    if (period !== undefined) updates.period = period;
    if (responsible !== undefined) updates.responsible = responsible;
    if (disaggregation !== undefined) updates.disaggregation = disaggregation;

    // Add user tracking based on status change
    if (status === 'submitted') {
      updates.submittedBy = session.user.email;
      updates.submittedAt = new Date().toISOString();
    } else if (status === 'draft') {
      updates.editedBy = session.user.email;
      updates.editedAt = new Date().toISOString();
    }

    console.log('📝 Updating record:', indicatorId, 'with updates:', updates);

    // Update the record
    const result = await updateSpecificRow(indicatorId, currentRecord.savedAt, updates);

    if (result) {
      console.log('✅ Record updated successfully');
      return NextResponse.json({ ok: true, message: 'Record updated successfully' });
    } else {
      console.log('❌ Failed to update record');
      return NextResponse.json({ ok: false, error: 'Failed to update record' }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Update draft error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}