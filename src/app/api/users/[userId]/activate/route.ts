// src/app/api/users/[userId]/activate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { activateUser } from '@/lib/services/userService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await activateUser(params.userId);
    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
