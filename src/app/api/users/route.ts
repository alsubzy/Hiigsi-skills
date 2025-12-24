// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createStaff } from '@/lib/services/users';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await createStaff(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
