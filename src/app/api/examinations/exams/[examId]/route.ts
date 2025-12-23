// src/app/api/examinations/exams/[examId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getExamById, updateExam, deleteExam } from '@/lib/services/examService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(req: NextRequest, { params }: { params: { examId: string } }) {
    try {
        const exam = await getExamById(params.examId);
        return NextResponse.json(exam);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { examId: string } }) {
    try {
        const body = await req.json();
        const updatedExam = await updateExam(params.examId, body);
        return NextResponse.json(updatedExam);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { examId: string } }) {
    try {
        await deleteExam(params.examId);
        return NextResponse.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}
