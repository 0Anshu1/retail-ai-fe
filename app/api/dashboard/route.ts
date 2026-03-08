import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Employee } from '@/models/Employee';
import { Attendance } from '@/models/Attendance';
import { CustomerAnalytics } from '@/models/CustomerAnalytics';
import { Alert } from '@/models/Alert';

export async function GET() {
  await connectDB();

  // Fetch summary data
  const totalEmployees = await Employee.countDocuments({ status: 'active' });
  
  // Get today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const presentToday = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } });

  // Get latest analytics (fetch last 7 days for chart)
  const recentAnalytics = await CustomerAnalytics.find().sort({ date: -1 }).limit(7);
  const analytics = recentAnalytics[0];
  
  // Get recent alerts
  const recentAlerts = await Alert.find().sort({ timestamp: -1 }).limit(5);

  return NextResponse.json({
    stats: {
      totalEmployees,
      presentToday,
      totalFootfall: analytics?.totalFootfall || 0,
      activeAlerts: await Alert.countDocuments({ status: 'new' }),
    },
    analytics: analytics || {},
    chartData: recentAnalytics.reverse(),
    alerts: recentAlerts,
  });
}
