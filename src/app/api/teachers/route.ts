// src/app/api/teachers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllTeachers, createTeacher } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const teachers = await getAllTeachers();
    return NextResponse.json(teachers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTeacher = await createTeacher(body);
    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
