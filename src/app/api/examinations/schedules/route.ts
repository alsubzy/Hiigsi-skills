// src/app/api/examinations/schedules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createExamSchedule, getSchedulesByExam } from '@/lib/services/examService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newSchedule = await createExamSchedule(body);
        return NextResponse.json(newSchedule, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const examId = searchParams.get('examId');
        if (!examId) {
            return NextResponse.json({ message: 'examId is required' }, { status: 400 });
        }
        const schedules = await getSchedulesByExam(examId);
        return NextResponse.json(schedules);
    } catch (error) {
        return handleApiError(error);
    }
}
