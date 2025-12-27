// src/app/api/academics/subjects/[subjectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateSubject, deleteSubject } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateSubject(params.subjectId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    await deleteSubject(params.subjectId);
    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
