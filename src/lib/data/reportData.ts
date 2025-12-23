// src/lib/data/reportData.ts
import type { GeneratedReport } from '@/lib/types';
import { studentData } from './studentData';
import { roundToNearestThousand } from 'firebase/firestore';

// In-memory store for generated reports history
let reports: GeneratedReport[] = [
    { id: 'REP-001', name: 'Annual Financial Statement 2023', type: 'Finance', date: new Date('2024-01-15'), status: 'Generated', generatedBy: 'admin-id' },
    { id: 'REP-002', name: 'Q3 Student Attendance Report', type: 'Academic', date: new Date('2023-10-05'), status: 'Generated', generatedBy: 'admin-id' },
    { id: 'REP-003', name: 'Exam Performance Analysis - Mid-Term', type: 'Examination', date: new Date('2023-11-20'), status: 'Generated', generatedBy: 'admin-id' },
    { id: 'REP-004', name: 'Enrollment Statistics 2020-2024', type: 'Administrative', date: new Date('2024-02-10'), status: 'Generated', generatedBy: 'admin-id' },
    { id: 'REP-005', name: 'Q4 Expense Breakdown', type: 'Finance', date: new Date('2024-01-05'), status: 'Archived', generatedBy: 'admin-id' },
];

export const reportData = {
    generatedReports: {
        async find(filters: { page: number; limit: number; type?: string | null; }): Promise<{ reports: GeneratedReport[]; total: number; pages: number; }> {
            const { page, limit, type } = filters;
            let filteredReports = reports;

            if (type && type !== 'all') {
                filteredReports = filteredReports.filter(r => r.type === type);
            }

            const total = filteredReports.length;
            const pages = Math.ceil(total / limit);
            const startIndex = (page - 1) * limit;
            const paginatedReports = filteredReports.slice(startIndex, startIndex + limit);
            
            return { reports: paginatedReports, total, pages };
        },
        async create(data: Omit<GeneratedReport, 'id' | 'date'>): Promise<GeneratedReport> {
            const newReport: GeneratedReport = {
                id: `REP-${Date.now()}`,
                ...data,
                date: new Date(),
            };
            reports.unshift(newReport);
            return newReport;
        },
    },
    analytics: {
        async getSummary() {
            // Mock data generation logic
            const totalStudents = (await studentData.findAll()).length;
            const graduationRate = 96.5; // Mocked
            const totalRevenue = 308000; // Mocked
            const totalExpenses = 221000; // Mocked

            const enrollmentData = [
                { name: '2020', students: 800 },
                { name: '2021', students: 850 },
                { name: '2022', students: 950 },
                { name: '2023', students: 1020 },
                { name: '2024', students: totalStudents + 900 }, // Make it seem dynamic
            ];

            const financialSummaryData = [
                { month: 'Jan', income: 45000, expense: 32000 },
                { month: 'Feb', income: 48000, expense: 35000 },
                { month: 'Mar', income: 52000, expense: 38000 },
                { month: 'Apr', income: 50000, expense: 36000 },
                { month: 'May', income: 55000, expense: 40000 },
                { month: 'Jun', income: 58000, expense: 42000 },
            ];

            return {
                kpis: {
                    totalStudents: { value: totalStudents, change: '+7.8%' },
                    graduationRate: { value: `${graduationRate}%`, change: '+1.2%' },
                    totalRevenue: { value: `$${totalRevenue.toLocaleString()}`, change: '+12%' },
                    totalExpenses: { value: `$${totalExpenses.toLocaleString()}`, change: '+5%' },
                },
                enrollmentData,
                financialSummaryData,
            }
        }
    }
};
