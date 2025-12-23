// src/app/api/roles/[roleId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  updateRole,
  deleteRole,
  assignPermissionToRole,
} from '@/lib/services/roleService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function PUT(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const body = await request.json();
    const updatedRole = await updateRole(params.roleId, body);
    return NextResponse.json(updatedRole);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    await deleteRole(params.roleId);
    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const { permission } = await request.json();
    if (!permission) {
      return NextResponse.json({ message: 'Permission is required' }, { status: 400 });
    }
    const updatedRole = await assignPermissionToRole(params.roleId, permission);
    return NextResponse.json(updatedRole);
  } catch (error) {
    return handleApiError(error);
  }
}
