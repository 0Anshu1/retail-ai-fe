import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Employee } from '@/models/Employee';
import { Attendance } from '@/models/Attendance';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get('department');
  const search = searchParams.get('search');

  let query: any = {};
  if (department) {
    query.department = department;
  }
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } }
    ];
  }

  const employees = await Employee.find(query);
  
  // Enrich with today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enrichedEmployees = await Promise.all(employees.map(async (emp) => {
    const attendance = await Attendance.findOne({ employee: emp._id, date: today });
    return {
      ...emp.toObject(),
      attendance: attendance || null,
    };
  }));

  return NextResponse.json(enrichedEmployees);
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const newEmployee = await Employee.create({
      ...body,
      productivityScore: Math.floor(Math.random() * 40) + 60, // Initial random productivity score
      status: 'active'
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
