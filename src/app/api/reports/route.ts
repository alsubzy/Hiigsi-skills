// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGeneratedReports, createGeneratedReport } from '@/lib/services/reportService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = searchParams.get('type');
    
    const result = await getGeneratedReports({ page, limit, type });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newReport = await createGeneratedReport(body);
        return NextResponse.json(newReport, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
