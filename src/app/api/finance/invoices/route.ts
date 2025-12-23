// src/app/api/finance/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, getAllInvoices } from '@/lib/services/financeService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newInvoice = await createInvoice(body);
        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const invoices = await getAllInvoices();
        return NextResponse.json(invoices);
    } catch (error) {
        return handleApiError(error);
    }
}
