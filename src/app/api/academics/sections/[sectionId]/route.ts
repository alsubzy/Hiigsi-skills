// src/app/api/academics/sections/[sectionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateSection, deleteSection } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateSection(params.sectionId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    await deleteSection(params.sectionId);
    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
