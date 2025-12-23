// src/app/api/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { markAttendance } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const { classId, date, attendanceData } = await request.json();
    if (!classId || !date || !attendanceData) {
        return NextResponse.json({ message: 'classId, date, and attendanceData are required.'}, { status: 400 });
    }
    await markAttendance(classId, new Date(date), attendanceData);
    return NextResponse.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
