// src/app/api/staff/[staffId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  updateStaff,
  activateStaff,
  deactivateStaff,
} from '@/lib/services/staffService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function PUT(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  try {
    const body = await request.json();
    const updatedStaff = await updateStaff(params.staffId, body);
    return NextResponse.json(updatedStaff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { staffId: string } }
) {
  const { pathname } = request.nextUrl;
  const action = pathname.split('/').pop();
  const { staffId } = params;

  try {
    if (action === 'activate') {
      const staff = await activateStaff(staffId);
      return NextResponse.json(staff);
    }

    if (action === 'deactivate') {
      const staff = await deactivateStaff(staffId);
      return NextResponse.json(staff);
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
