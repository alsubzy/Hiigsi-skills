// src/app/api/academics/years/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllAcademicYears, createAcademicYear } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const years = await getAllAcademicYears();
    return NextResponse.json(years);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newYear = await createAcademicYear(body);
    return NextResponse.json(newYear, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
