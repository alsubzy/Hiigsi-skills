// src/app/api/examinations/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateReportCard, getReportCard } from '@/lib/services/examService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        const { examId, studentId } = await request.json();
        if (!examId || !studentId) {
            return NextResponse.json({ message: 'examId and studentId are required' }, { status: 400 });
        }
        const reportCard = await generateReportCard(examId, studentId);
        return NextResponse.json(reportCard, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const examId = searchParams.get('examId');
        const studentId = searchParams.get('studentId');

        if (!examId || !studentId) {
            return NextResponse.json({ message: 'examId and studentId query parameters are required' }, { status: 400 });
        }
        
        const reportCard = await getReportCard(examId, studentId);
        if (!reportCard) {
            return NextResponse.json({ message: 'Report card not found.' }, { status: 404 });
        }

        return NextResponse.json(reportCard);
    } catch (error) {
        return handleApiError(error);
    }
}
