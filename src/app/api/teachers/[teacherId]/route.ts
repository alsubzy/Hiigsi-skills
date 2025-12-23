// src/app/api/teachers/[teacherId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTeacherById, updateTeacher, deleteTeacher } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    const teacher = await getTeacherById(params.teacherId);
    return NextResponse.json(teacher);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    const body = await request.json();
    const updatedTeacher = await updateTeacher(params.teacherId, body);
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    await deleteTeacher(params.teacherId);
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
