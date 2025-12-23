// src/app/api/finance/invoices/[invoiceId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/services/financeService';
import { handleApiError } from '@/lib/utils/handleApiError';

export async function GET(req: NextRequest, { params }: { params: { invoiceId: string } }) {
    try {
        const invoice = await getInvoiceById(params.invoiceId);
        return NextResponse.json(invoice);
    } catch (error) {
        return handleApiError(error);
    }
}
