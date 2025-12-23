// src/app/api/academics/classes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllClasses, createClass } from '@/lib/services/academicService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const classes = await getAllClasses();
    return NextResponse.json(classes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newClass = await createClass(body);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
