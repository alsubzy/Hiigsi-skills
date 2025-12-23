// src/app/api/examinations/exams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createExam, getAllExams } from '@/lib/services/examService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newExam = await createExam(body);
        return NextResponse.json(newExam, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const exams = await getAllExams();
        return NextResponse.json(exams);
    } catch (error) {
        return handleApiError(error);
    }
}
