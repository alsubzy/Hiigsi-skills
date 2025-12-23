// src/app/api/students/[studentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStudentById, updateStudent, deleteStudent } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const student = await getStudentById(params.studentId);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const body = await request.json();
    const updatedStudent = await updateStudent(params.studentId, body);
    return NextResponse.json(updatedStudent);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    await deleteStudent(params.studentId);
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
