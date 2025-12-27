// src/app/api/academics/classes/[classId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateClass, deleteClass } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateClass(params.classId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    await deleteClass(params.classId);
    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
