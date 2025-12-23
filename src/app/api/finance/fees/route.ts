// src/app/api/finance/fees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateFeeStructure, getFeeStructure } from '@/lib/services/financeService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');
        const academicYear = searchParams.get('academicYear');

        if (!classId || !academicYear) {
            return NextResponse.json({ message: 'classId and academicYear query parameters are required' }, { status: 400 });
        }
        
        const feeStructure = await getFeeStructure(classId, academicYear);
        if (!feeStructure) {
            return NextResponse.json({ message: 'Fee structure not found' }, { status: 404 });
        }
        return NextResponse.json(feeStructure);
    } catch (error) {
        return handleApiError(error);
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const feeStructure = await createOrUpdateFeeStructure(body);
        return NextResponse.json(feeStructure, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
