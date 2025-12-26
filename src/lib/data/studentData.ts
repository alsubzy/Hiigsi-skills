// src/lib/data/studentData.ts
import type { Student, Admission, Attendance, Promotion } from '@/lib/types';
import { students as initialStudents } from '../placeholder-data';

let students: Student[] = [...initialStudents];
let admissions: Admission[] = [];
let attendances: Attendance[] = [];
let promotions: Promotion[] = [];

// --- Student Data ---
export const studentData = {
  async findAll(): Promise<Student[]> {
    return students;
  },
  async findById(id: string): Promise<Student | undefined> {
    return students.find(s => s.id === id);
  },
  async findByAdmissionNumber(admissionNumber: string): Promise<Student | undefined> {
    return students.find(s => s.admissionNumber === admissionNumber);
  },
  async create(data: Omit<Student, 'id'>): Promise<Student> {
    const newStudent: Student = { id: `st-${Date.now()}`, ...data };
    students.push(newStudent);
    return newStudent;
  },
  async update(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    students[index] = { ...students[index], ...updates };
    return students[index];
  },
  async remove(id: string): Promise<boolean> {
    // Soft delete by changing status
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return false;
    students[index].status = 'Inactive';
    return true;
  },
};

// --- Admission Data ---
export const admissionData = {
    async findAll(): Promise<Admission[]> {
        return admissions;
    },
    async findById(id: string): Promise<Admission | undefined> {
        return admissions.find(a => a.id === id);
    },
    async create(data: Omit<Admission, 'id'>): Promise<Admission> {
        const newAdmission: Admission = { id: `adm-${Date.now()}`, ...data };
        admissions.push(newAdmission);
        return newAdmission;
    },
    async update(id: string, updates: Partial<Admission>): Promise<Admission | undefined> {
        const index = admissions.findIndex(a => a.id === id);
        if (index === -1) return undefined;
        admissions[index] = { ...admissions[index], ...updates };
        return admissions[index];
    }
};

// --- Attendance Data ---
export const attendanceData = {
    async findByDateAndClass(date: Date, classId: string): Promise<Attendance[]> {
        const dateString = date.toISOString().split('T')[0];
        const studentIdsInClass = students.filter(s => s.classId === classId).map(s => s.id);
        return attendances.filter(att => 
            att.date.toISOString().split('T')[0] === dateString &&
            studentIdsInClass.includes(att.studentId)
        );
    },
    async createOrUpdate(data: Omit<Attendance, 'id'>[]): Promise<Attendance[]> {
        const results: Attendance[] = [];
        for (const record of data) {
            const dateString = record.date.toISOString().split('T')[0];
            const existingIndex = attendances.findIndex(att => 
                att.studentId === record.studentId && 
                att.date.toISOString().split('T')[0] === dateString
            );
            if (existingIndex !== -1) {
                attendances[existingIndex] = { ...attendances[existingIndex], ...record };
                results.push(attendances[existingIndex]);
            } else {
                const newAttendance: Attendance = { id: `att-${Date.now()}-${Math.random()}`, ...record };
                attendances.push(newAttendance);
                results.push(newAttendance);
            }
        }
        return results;
    }
};


// --- Promotion Data ---
export const promotionData = {
    async create(data: Omit<Promotion, 'id'>): Promise<Promotion> {
        const newPromotion: Promotion = { id: `promo-${Date.now()}`, ...data };
        promotions.push(newPromotion);
        return newPromotion;
    },
};
