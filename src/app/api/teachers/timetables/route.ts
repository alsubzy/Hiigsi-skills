// src/app/api/teachers/timetables/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createTeacherTimetableEntry } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEntry = await createTeacherTimetableEntry(body);
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
