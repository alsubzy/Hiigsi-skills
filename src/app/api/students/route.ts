// src/app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllStudents, createStudent } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const students = await getAllStudents();
    return NextResponse.json(students);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newStudent = await createStudent(body);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
