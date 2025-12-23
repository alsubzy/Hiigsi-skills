// src/app/api/academics/subjects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSubjectsByClass, createSubject } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    if (!classId) {
        return NextResponse.json({ message: 'classId query parameter is required' }, { status: 400 });
    }
    const subjects = await getSubjectsByClass(classId);
    return NextResponse.json(subjects);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSubject = await createSubject(body);
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
