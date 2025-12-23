// src/app/api/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllRoles, createRole } from '@/lib/services/roleService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
  try {
    const roles = await getAllRoles();
    return NextResponse.json(roles);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRole = await createRole(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
