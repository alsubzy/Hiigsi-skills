// src/app/api/users/[userId]/assign-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { assignRoleToUser } from '@/lib/services/userService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { roleId } = await request.json();
    if (!roleId) {
      return NextResponse.json({ message: 'roleId is required' }, { status: 400 });
    }
    const user = await assignRoleToUser(params.userId, roleId);
    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
