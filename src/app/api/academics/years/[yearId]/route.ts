// src/app/api/academics/years/[yearId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateAcademicYear, deleteAcademicYear } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function PUT(
  request: NextRequest,
  { params }: { params: { yearId: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateAcademicYear(params.yearId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { yearId: string } }
) {
  try {
    await deleteAcademicYear(params.yearId);
    return NextResponse.json({ message: 'Academic Year deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
