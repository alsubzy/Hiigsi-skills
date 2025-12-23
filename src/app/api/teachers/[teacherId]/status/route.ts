// src/app/api/teachers/[teacherId]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setTeacherStatus } from '@/lib/services/teacherService';
import { handleApiError } from '@/lib/utils/handleApiError';
import { z } from 'zod';

const statusSchema = z.object({
    status: z.enum(['Active', 'Inactive', 'On Leave']),
});

export async function PUT(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    const body = await request.json();
    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid status provided.' }, { status: 400 });
    }

    const updatedTeacher = await setTeacherStatus(params.teacherId, validation.data.status);
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    return handleApiError(error);
  }
}
