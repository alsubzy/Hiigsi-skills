// src/lib/data/examData.ts
import type { Exam, ExamSchedule, Mark, ReportCard } from '@/lib/types';

let exams: Exam[] = [];
let schedules: ExamSchedule[] = [];
let marks: Mark[] = [];
let reportCards: ReportCard[] = [];

// Mock Repository Pattern
export const examData = {
    exams: {
        async create(data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam> {
            const now = new Date();
            const newExam: Exam = { id: `exam-${Date.now()}`, ...data, createdAt: now, updatedAt: now };
            exams.push(newExam);
            return newExam;
        },
        async findById(id: string): Promise<Exam | undefined> {
            return exams.find(e => e.id === id);
        },
        async findAll(): Promise<Exam[]> {
            return [...exams];
        },
        async update(id: string, updates: Partial<Exam>): Promise<Exam | undefined> {
            const index = exams.findIndex(e => e.id === id);
            if (index === -1) return undefined;
            exams[index] = { ...exams[index], ...updates, updatedAt: new Date() };
            return exams[index];
        },
        async remove(id: string): Promise<boolean> {
            const initialLength = exams.length;
            exams = exams.filter(e => e.id !== id);
            return exams.length < initialLength;
        }
    },
    schedules: {
        async create(data: Omit<ExamSchedule, 'id'>): Promise<ExamSchedule> {
            const newSchedule: ExamSchedule = { id: `sched-${Date.now()}`, ...data };
            schedules.push(newSchedule);
            return newSchedule;
        },
        async findByExam(examId: string): Promise<ExamSchedule[]> {
            return schedules.filter(s => s.examId === examId);
        },
        async findByClass(classId: string): Promise<ExamSchedule[]> {
            return schedules.filter(s => s.classId === classId);
        },
        async update(id: string, updates: Partial<ExamSchedule>): Promise<ExamSchedule | undefined> {
            const index = schedules.findIndex(s => s.id === id);
            if (index === -1) return undefined;
            schedules[index] = { ...schedules[index], ...updates };
            return schedules[index];
        },
        async remove(id: string): Promise<boolean> {
             const initialLength = schedules.length;
            schedules = schedules.filter(s => s.id !== id);
            return schedules.length < initialLength;
        }
    },
    marks: {
         async create(data: Omit<Mark, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mark> {
            const now = new Date();
            const newMark: Mark = { id: `mark-${Date.now()}`, ...data, createdAt: now, updatedAt: now };
            marks.push(newMark);
            return newMark;
        },
        async find(examId: string, studentId: string, subjectId: string): Promise<Mark | undefined> {
            return marks.find(m => m.examId === examId && m.studentId === studentId && m.subjectId === subjectId);
        },
         async findByStudent(examId: string, studentId: string): Promise<Mark[]> {
            return marks.filter(m => m.examId === examId && m.studentId === studentId);
        },
        async update(id: string, updates: Partial<Mark>): Promise<Mark | undefined> {
            const index = marks.findIndex(m => m.id === id);
            if (index === -1) return undefined;
            marks[index] = { ...marks[index], ...updates, updatedAt: new Date() };
            return marks[index];
        },
        async remove(id: string): Promise<boolean> {
            const initialLength = marks.length;
            marks = marks.filter(m => m.id !== id);
            return marks.length < initialLength;
        }
    },
    reportCards: {
        async create(data: Omit<ReportCard, 'id' | 'generatedAt'>): Promise<ReportCard> {
            const newReport: ReportCard = { id: `rep-${Date.now()}`, ...data, generatedAt: new Date() };
            reportCards.push(newReport);
            return newReport;
        },
        async findByStudent(examId: string, studentId: string): Promise<ReportCard | undefined> {
            return reportCards.find(r => r.examId === examId && r.studentId === studentId);
        },
         async removeByExam(examId: string): Promise<boolean> {
            const initialLength = reportCards.length;
            reportCards = reportCards.filter(rc => rc.examId !== examId);
            return reportCards.length > initialLength;
        }
    }
};
