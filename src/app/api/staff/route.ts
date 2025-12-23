// src/app/api/staff/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createStaff, getAllStaff } from '@/lib/services/staffService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    // Example of how to handle query params for filtering
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const staff = await getAllStaff({ department });
    return NextResponse.json(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newStaff = await createStaff(body);
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
