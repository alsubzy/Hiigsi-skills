// src/app/api/examinations/marks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { enterMarks } from '@/lib/services/examService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        // In a real app, you'd get the user ID from the session/token
        const enteredBy = 'teacher-user-id'; 
        const body = await request.json();
        const newMark = await enterMarks(body, enteredBy);
        return NextResponse.json(newMark, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
