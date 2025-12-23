// src/app/api/academics/sections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSectionsByClass, createSection } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    if (!classId) {
        return NextResponse.json({ message: 'classId query parameter is required' }, { status: 400 });
    }
    const sections = await getSectionsByClass(classId);
    return NextResponse.json(sections);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSection = await createSection(body);
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
