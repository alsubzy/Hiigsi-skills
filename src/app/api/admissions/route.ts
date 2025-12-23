// src/app/api/admissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdmission } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAdmission = await createAdmission(body);
    return NextResponse.json(newAdmission, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
