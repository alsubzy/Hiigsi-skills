// src/app/api/reports/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/services/reportService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    // In a real app, you might pass date ranges from searchParams
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
