// src/app/api/users/[userId]/deactivate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deactivateUser } from '@/lib/services/userService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await deactivateUser(params.userId);
    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
