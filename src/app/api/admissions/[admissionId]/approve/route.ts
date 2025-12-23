// src/app/api/admissions/[admissionId]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { approveAdmission } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(
  request: NextRequest,
  { params }: { params: { admissionId: string } }
) {
  try {
    const student = await approveAdmission(params.admissionId);
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}
