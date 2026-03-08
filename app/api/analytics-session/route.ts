import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AnalyticsSession from '@/models/AnalyticsSession';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { cameraId, modelType } = await request.json();
    
    // Generate unique session ID
    const sessionId = `session_${cameraId}_${modelType}_${Date.now()}`;
    
    const session = new AnalyticsSession({
      cameraId,
      modelType,
      sessionId,
      isActive: true,
      startTime: new Date()
    });
    
    await session.save();
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating analytics session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const cameraId = searchParams.get('cameraId');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    if (cameraId) query.cameraId = parseInt(cameraId);
    if (isActive) query.isActive = isActive === 'true';
    
    const sessions = await AnalyticsSession.find(query).sort({ startTime: -1 });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { sessionId, isActive, detections, statistics } = await request.json();
    
    const updateData: any = {};
    if (typeof isActive !== 'undefined') {
      updateData.isActive = isActive;
      if (!isActive) updateData.endTime = new Date();
    }
    if (detections) updateData.$push = { detections: { $each: detections } };
    if (statistics) updateData.statistics = statistics;
    
    const session = await AnalyticsSession.findOneAndUpdate(
      { sessionId },
      updateData,
      { new: true }
    );
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}