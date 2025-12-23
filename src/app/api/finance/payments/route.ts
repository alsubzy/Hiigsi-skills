// src/app/api/finance/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { recordPayment, getPaymentsByInvoice } from '@/lib/services/financeService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newPayment = await recordPayment(body);
        return NextResponse.json(newPayment, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const invoiceId = searchParams.get('invoiceId');
        if (!invoiceId) {
            return NextResponse.json({ message: 'invoiceId is required' }, { status: 400 });
        }
        const payments = await getPaymentsByInvoice(invoiceId);
        return NextResponse.json(payments);
    } catch (error) {
        return handleApiError(error);
    }
}
