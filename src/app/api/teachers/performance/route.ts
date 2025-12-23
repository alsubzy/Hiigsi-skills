// src/app/api/teachers/performance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPerformanceEvaluation } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPerformance = await createPerformanceEvaluation(body);
    return NextResponse.json(newPerformance, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
