import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Employee } from '@/models/Employee';
import { Attendance } from '@/models/Attendance';
import { CustomerAnalytics } from '@/models/CustomerAnalytics';
import { Alert } from '@/models/Alert';
import Camera from '@/models/Camera';
import bcrypt from 'bcryptjs';

export async function POST() {
  await connectDB();

  // Clear existing data to avoid duplicates on re-seed
  // Uncomment if you want to wipe data clean each time
  // await User.deleteMany({});
  // await Employee.deleteMany({});
  // await Attendance.deleteMany({});
  // await CustomerAnalytics.deleteMany({});
  // await Alert.deleteMany({});
  // await Camera.deleteMany({});

  // 0. Create Cameras (47 RTSP cameras)
  const cameraCount = await Camera.countDocuments();
  if (cameraCount === 0) {
    const zones = [
      'Entrance', 'Saree Section', 'Mens Wear', 'Billing Counter', 'Kids Wear', 
      'Trial Room', 'Ladies Section', 'Footwear', 'Accessories', 'Storage',
      'Staff Area', 'Parking', 'Exit', 'Customer Service', 'Jewelry Counter'
    ];
    
    const cameras = [];
    for (let i = 1; i <= 47; i++) {
      const zone = zones[Math.floor((i - 1) / 3) % zones.length];
      const camNumber = ((i - 1) % 3) + 1;
      cameras.push({
        id: i,
        name: `${zone} Cam ${camNumber.toString().padStart(2, '0')}`,
        zone: zone,
        rtspUrl: `rtsp://65.1.214.31:8554/cam${i}`,
        status: Math.random() > 0.1 ? 'online' : 'offline', // 90% online
        isActive: true
      });
    }
    await Camera.insertMany(cameras);
  }

  // 1. Create Users (Admins/Managers)
  const password = await bcrypt.hash('password123', 10);
  const users = [
    { name: 'Rajesh Kumar', email: 'admin@jeeja.com', password, role: 'owner', showroom: 'Jeeja Fashion - Mumbai' },
    { name: 'Amit Verma', email: 'manager@jeeja.com', password, role: 'store_manager', showroom: 'Jeeja Fashion - Mumbai' },
    { name: 'Sandeep Singh', email: 'security@jeeja.com', password, role: 'security', showroom: 'Jeeja Fashion - Mumbai' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) await User.create(u);
  }

  // 2. Create Employees (Indian Names)
  const employeesData = [
    // Sales Department
    { firstName: 'Aarav', lastName: 'Patel', designation: 'Senior Sales Executive', department: 'Sales', showroom: 'Mumbai' },
    { firstName: 'Diya', lastName: 'Sharma', designation: 'Sales Associate', department: 'Sales', showroom: 'Mumbai' },
    { firstName: 'Vihaan', lastName: 'Reddy', designation: 'Sales Associate', department: 'Sales', showroom: 'Mumbai' },
    { firstName: 'Aditi', lastName: 'Gupta', designation: 'Sales Associate', department: 'Sales', showroom: 'Mumbai' },
    { firstName: 'Rohan', lastName: 'Mehta', designation: 'Floor Manager', department: 'Sales', showroom: 'Mumbai' },
    
    // Billing Department
    { firstName: 'Ishaan', lastName: 'Malhotra', designation: 'Billing Clerk', department: 'Billing', showroom: 'Mumbai' },
    { firstName: 'Kavita', lastName: 'Joshi', designation: 'Head Cashier', department: 'Billing', showroom: 'Mumbai' },
    
    // Management
    { firstName: 'Vikram', lastName: 'Singh', designation: 'Store Supervisor', department: 'Management', showroom: 'Mumbai' },
    { firstName: 'Anjali', lastName: 'Das', designation: 'Assistant Manager', department: 'Management', showroom: 'Mumbai' },
    
    // Security
    { firstName: 'Arjun', lastName: 'Nair', designation: 'Security Head', department: 'Security', showroom: 'Mumbai' },
    { firstName: 'Balwinder', lastName: 'Dhillon', designation: 'Security Guard', department: 'Security', showroom: 'Mumbai' },
    
    // Inventory
    { firstName: 'Meera', lastName: 'Iyer', designation: 'Inventory Manager', department: 'Inventory', showroom: 'Mumbai' },
    { firstName: 'Rahul', lastName: 'Chopra', designation: 'Stock Clerk', department: 'Inventory', showroom: 'Mumbai' },
  ];

  const createdEmployees = [];
  for (const e of employeesData) {
    let emp = await Employee.findOne({ firstName: e.firstName, lastName: e.lastName });
    if (!emp) {
      emp = await Employee.create({
        ...e,
        productivityScore: Math.floor(Math.random() * (100 - 60 + 1) + 60) // Random score 60-100
      });
    }
    createdEmployees.push(emp);
  }

  // 3. Create Attendance (Today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const emp of createdEmployees) {
    const exists = await Attendance.findOne({ employee: emp._id, date: today });
    if (!exists) {
      // Randomize entry times between 9:00 AM and 10:30 AM
      const entryHour = 9 + Math.random(); 
      const entryTime = new Date(today);
      entryTime.setHours(Math.floor(entryHour), Math.floor((entryHour % 1) * 60));

      const isAbsent = Math.random() > 0.9; // 10% chance of absence
      
      if (!isAbsent) {
        await Attendance.create({
          employee: emp._id,
          date: today,
          entryTime: entryTime,
          status: entryHour > 9.5 ? 'late' : 'present', // Late after 9:30
          mobileUsageMinutes: Math.floor(Math.random() * 90), // 0-90 mins
        });
      }
    }
  }

  // 4. Create Analytics (Last 7 Days)
  const analyticsData = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Skip if exists
    const exists = await CustomerAnalytics.findOne({ date: d });
    if (exists) continue;

    // Generate realistic fluctuating data
    const baseFootfall = 800 + Math.floor(Math.random() * 500); // 800-1300
    
    analyticsData.push({
      date: d,
      showroom: 'Mumbai',
      totalFootfall: baseFootfall,
      peakHour: '18:00',
      zones: [
        { name: 'Saree Section', count: Math.floor(baseFootfall * 0.35), avgWaitTime: 5 + Math.random() * 5, avgDwellTime: 20 + Math.random() * 15 },
        { name: 'Mens Wear', count: Math.floor(baseFootfall * 0.25), avgWaitTime: 3 + Math.random() * 3, avgDwellTime: 15 + Math.random() * 10 },
        { name: 'Kids Wear', count: Math.floor(baseFootfall * 0.20), avgWaitTime: 4 + Math.random() * 4, avgDwellTime: 18 + Math.random() * 12 },
        { name: 'Billing Area', count: Math.floor(baseFootfall * 0.40), avgWaitTime: 10 + Math.random() * 10, avgDwellTime: 5 + Math.random() * 5 },
      ]
    });
  }
  
  if (analyticsData.length > 0) {
    await CustomerAnalytics.insertMany(analyticsData);
  }

  // 5. Create Alerts
  const alertsCount = await Alert.countDocuments();
  if (alertsCount === 0) {
    await Alert.create([
      { type: 'crowd', message: 'High crowd density in Saree Section (Mumbai)', severity: 'medium', showroom: 'Mumbai', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { type: 'productivity', message: 'High mobile usage detected: Rohan Mehta', severity: 'low', showroom: 'Mumbai', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
      { type: 'security', message: 'Unattended bag detected near Entrance Gate 2', severity: 'high', showroom: 'Mumbai', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
      { type: 'system', message: 'Camera #14 (Kids Section) offline', severity: 'critical', showroom: 'Mumbai', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { type: 'crowd', message: 'Long queue at Billing Counter 1 (> 10 mins)', severity: 'medium', showroom: 'Mumbai', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
    ]);
  }

  return NextResponse.json({ message: 'Database seeded successfully with Indian mock data' });
}
