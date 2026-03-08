import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Camera from '@/models/Camera';

// Generate all 47 cameras with RTSP URLs
const generateCameras = () => {
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
  return cameras;
};

export async function GET() {
  try {
    await connectDB();
    
    // Check if cameras exist in DB, if not seed them
    const existingCameras = await Camera.find({});
    
    if (existingCameras.length === 0) {
      const cameras = generateCameras();
      await Camera.insertMany(cameras);
      return NextResponse.json(cameras);
    }
    
    return NextResponse.json(existingCameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Failed to fetch cameras' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const camera = new Camera(body);
    await camera.save();
    return NextResponse.json(camera, { status: 201 });
  } catch (error) {
    console.error('Error creating camera:', error);
    return NextResponse.json({ error: 'Failed to create camera' }, { status: 500 });
  }
}
