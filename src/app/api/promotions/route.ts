// src/app/api/promotions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promoteStudents } from '@/lib/services/studentService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await promoteStudents(body);
    return NextResponse.json({ message: 'Students promoted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
