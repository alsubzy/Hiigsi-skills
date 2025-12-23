// src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLogs } from '@/lib/services/logService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const userId = searchParams.get('userId');
    const module = searchParams.get('module');

    const result = await getLogs({ page, limit, userId, module });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
