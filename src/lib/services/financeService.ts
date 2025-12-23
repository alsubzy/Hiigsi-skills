// src/lib/services/financeService.ts
import { z } from 'zod';
import { financeData } from '@/lib/data/financeData';
import { studentData } from '@/lib/data/studentData';
import { academicData } from '@/lib/data/academicData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { FeeStructure, Invoice, Payment } from '@/lib/types';

// --- Schemas ---

const feeStructureSchema = z.object({
    classId: z.string(),
    academicYear: z.string(),
    tuitionFee: z.number().min(0),
    transportFee: z.number().min(0),
    mealsFee: z.number().min(0),
    accommodationFee: z.number().min(0),
});

const invoiceCreateSchema = z.object({
    studentId: z.string(),
    academicYear: z.string(),
    items: z.array(z.object({
        description: z.string(),
        amount: z.number().positive(),
    })).min(1),
    dueDate: z.coerce.date(),
});

const paymentSchema = z.object({
    invoiceId: z.string(),
    amount: z.number().positive(),
    paymentDate: z.coerce.date(),
    method: z.enum(['Cash', 'Credit Card', 'Bank Transfer', 'Online']),
    transactionId: z.string().optional(),
});


// --- Fee Structure Service ---

export async function createOrUpdateFeeStructure(data: unknown): Promise<FeeStructure> {
    const validation = feeStructureSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid fee structure data', validation.error.flatten());

    const { classId, academicYear } = validation.data;

    const existing = await financeData.feeStructures.findByClass(classId, academicYear);
    if (existing) {
        const updated = await financeData.feeStructures.update(existing.id, validation.data);
        await createLog({ userId: 'admin-id', action: 'update_fee_structure', module: 'Finance', details: `Updated fee structure for class ${classId}` });
        return updated!;
    }

    const newFeeStructure = await financeData.feeStructures.create(validation.data);
    await createLog({ userId: 'admin-id', action: 'create_fee_structure', module: 'Finance', details: `Created fee structure for class ${classId}` });
    return newFeeStructure;
}

export async function getFeeStructure(classId: string, academicYear: string): Promise<FeeStructure | undefined> {
    return financeData.feeStructures.findByClass(classId, academicYear);
}

// --- Invoice Service ---

export async function createInvoice(data: unknown): Promise<Invoice> {
    const validation = invoiceCreateSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid invoice data', validation.error.flatten());

    const { studentId, items } = validation.data;
    const student = await studentData.findById(studentId);
    if (!student) throw new ApiError(404, 'Student not found.');

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    const newInvoice = await financeData.invoices.create({
        ...validation.data,
        classId: student.classId,
        issueDate: new Date(),
        totalAmount,
        amountPaid: 0,
        balance: totalAmount,
        status: 'Unpaid',
    });

    await createLog({ userId: 'admin-id', action: 'create_invoice', module: 'Finance', details: `Created invoice ${newInvoice.id} for student ${student.name}` });
    return newInvoice;
}

export async function getAllInvoices(): Promise<Invoice[]> {
    return financeData.invoices.findAll();
}

export async function getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await financeData.invoices.findById(id);
    if (!invoice) throw new ApiError(404, 'Invoice not found.');
    return invoice;
}

// --- Payment Service ---

export async function recordPayment(data: unknown): Promise<Payment> {
    const validation = paymentSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid payment data', validation.error.flatten());
    
    const { invoiceId, amount } = validation.data;
    const invoice = await financeData.invoices.findById(invoiceId);
    if (!invoice) throw new ApiError(404, 'Invoice not found.');

    if (amount > invoice.balance) {
        throw new ApiError(400, 'Payment amount cannot exceed the outstanding balance.');
    }

    // In a real DB, this would be a transaction
    const newPayment = await financeData.payments.create(validation.data);

    const newAmountPaid = invoice.amountPaid + amount;
    const newBalance = invoice.totalAmount - newAmountPaid;
    const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';

    await financeData.invoices.update(invoiceId, {
        amountPaid: newAmountPaid,
        balance: newBalance,
        status: newStatus,
    });
    
    await createLog({ userId: 'admin-id', action: 'record_payment', module: 'Finance', details: `Recorded payment of ${amount} for invoice ${invoiceId}` });
    
    return newPayment;
}

export async function getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    return financeData.payments.findByInvoice(invoiceId);
}

export async function checkAndUpdateOverdueInvoices(): Promise<void> {
    const today = new Date();
    const allInvoices = await financeData.invoices.findAll();
    for (const invoice of allInvoices) {
        if (invoice.status === 'Unpaid' || invoice.status === 'Partially Paid') {
            if (invoice.dueDate < today) {
                await financeData.invoices.update(invoice.id, { status: 'Overdue' });
            }
        }
    }
}
