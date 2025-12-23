// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  assignRoleToUser,
} from '@/lib/services/userService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getUserById(params.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const updatedUser = await updateUser(params.userId, body);
    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await deleteUser(params.userId);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { pathname } = request.nextUrl;
  const action = pathname.split('/').pop();
  const { userId } = params;

  try {
    if (action === 'activate') {
      const user = await activateUser(userId);
      return NextResponse.json(user);
    }

    if (action === 'deactivate') {
      const user = await deactivateUser(userId);
      return NextResponse.json(user);
    }

    if (action === 'assign-role') {
        const { roleId } = await request.json();
        if (!roleId) {
            return NextResponse.json({ message: 'roleId is required' }, { status: 400 });
        }
        const user = await assignRoleToUser(userId, roleId);
        return NextResponse.json(user);
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
