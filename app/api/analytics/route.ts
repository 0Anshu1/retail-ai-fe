import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CustomerAnalytics } from '@/models/CustomerAnalytics';

export async function GET() {
  await connectDB();
  // Return last 7 days analytics
  const analytics = await CustomerAnalytics.find().sort({ date: -1 }).limit(7);
  return NextResponse.json(analytics);
}
