// src/app/api/teachers/allocations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { assignSubjectToTeacher } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAllocation = await assignSubjectToTeacher(body);
    return NextResponse.json(newAllocation, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
