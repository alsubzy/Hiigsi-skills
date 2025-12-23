// src/lib/data/financeData.ts
import type { FeeStructure, Invoice, Payment } from '@/lib/types';

let feeStructures: FeeStructure[] = [];
let invoices: Invoice[] = [];
let payments: Payment[] = [];

export const financeData = {
    feeStructures: {
        async create(data: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeeStructure> {
            const now = new Date();
            const newFeeStructure: FeeStructure = {
                id: `fs-${Date.now()}`,
                ...data,
                createdAt: now,
                updatedAt: now,
            };
            feeStructures.push(newFeeStructure);
            return newFeeStructure;
        },
        async findByClass(classId: string, academicYear: string): Promise<FeeStructure | undefined> {
            return feeStructures.find(fs => fs.classId === classId && fs.academicYear === academicYear);
        },
        async update(id: string, updates: Partial<FeeStructure>): Promise<FeeStructure | undefined> {
            const index = feeStructures.findIndex(fs => fs.id === id);
            if (index === -1) return undefined;
            feeStructures[index] = { ...feeStructures[index], ...updates, updatedAt: new Date() };
            return feeStructures[index];
        },
    },
    invoices: {
        async create(data: Omit<Invoice, 'id'>): Promise<Invoice> {
            const newInvoice: Invoice = { id: `inv-${Date.now()}`, ...data };
            invoices.push(newInvoice);
            return newInvoice;
        },
        async findById(id: string): Promise<Invoice | undefined> {
            return invoices.find(inv => inv.id === id);
        },
        async findByStudent(studentId: string): Promise<Invoice[]> {
            return invoices.filter(inv => inv.studentId === studentId);
        },
        async findAll(): Promise<Invoice[]> {
            return [...invoices];
        },
        async update(id: string, updates: Partial<Invoice>): Promise<Invoice | undefined> {
            const index = invoices.findIndex(inv => inv.id === id);
            if (index === -1) return undefined;
            invoices[index] = { ...invoices[index], ...updates };
            return invoices[index];
        },
         async remove(id: string): Promise<boolean> {
            const initialLength = invoices.length;
            invoices = invoices.filter(inv => inv.id !== id);
            return invoices.length < initialLength;
        }
    },
    payments: {
        async create(data: Omit<Payment, 'id'>): Promise<Payment> {
            const newPayment: Payment = { id: `pay-${Date.now()}`, ...data };
            payments.push(newPayment);
            return newPayment;
        },
        async findByInvoice(invoiceId: string): Promise<Payment[]> {
            return payments.filter(p => p.invoiceId === invoiceId);
        },
        async findAll(): Promise<Payment[]> {
            return [...payments];
        }
    }
};
