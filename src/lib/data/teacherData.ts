// src/lib/data/teacherData.ts
import type { Teacher, SubjectAllocation, TeacherTimetable, TeacherPerformance } from '@/lib/types';
import { users } from './placeholder-data';

// Mock data initialized from placeholder users with 'Teacher' role
let teachers: Teacher[] = users
    .filter(u => u.role === 'Teacher')
    .map((u, index) => ({
        id: `TCHR-${u.id}`,
        userId: u.id,
        fullName: u.name,
        email: u.email,
        phone: `555-010${index + 1}`,
        gender: 'Female',
        qualification: 'M.Ed',
        hireDate: new Date(u.createdDate),
        status: u.status === 'Active' ? 'Active' : 'Inactive',
        createdAt: new Date(u.createdDate),
        updatedAt: new Date(u.createdDate),
        deletedAt: null,
    }));

let allocations: SubjectAllocation[] = [];
let timetables: TeacherTimetable[] = [];
let performances: TeacherPerformance[] = [];

export const teacherData = {
    teachers: {
        async findAll(): Promise<Teacher[]> {
            return teachers.filter(t => !t.deletedAt);
        },
        async findById(id: string): Promise<Teacher | undefined> {
            return teachers.find(t => t.id === id && !t.deletedAt);
        },
        async findByEmail(email: string): Promise<Teacher | undefined> {
            return teachers.find(t => t.email === email && !t.deletedAt);
        },
        async create(data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Teacher> {
            const now = new Date();
            const newTeacher: Teacher = {
                id: `TCHR-${Date.now()}`,
                ...data,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
            };
            teachers.push(newTeacher);
            return newTeacher;
        },
        async update(id: string, updates: Partial<Teacher>): Promise<Teacher | undefined> {
            const index = teachers.findIndex(t => t.id === id);
            if (index === -1) return undefined;
            teachers[index] = { ...teachers[index], ...updates, updatedAt: new Date() };
            return teachers[index];
        },
        async remove(id: string): Promise<boolean> {
            const index = teachers.findIndex(t => t.id === id);
            if (index === -1) return false;
            teachers[index].deletedAt = new Date();
            teachers[index].status = 'Inactive';
            return true;
        },
    },
    allocations: {
        async findByTeacher(teacherId: string): Promise<SubjectAllocation[]> {
            return allocations.filter(a => a.teacherId === teacherId);
        },
        async create(data: Omit<SubjectAllocation, 'id'>): Promise<SubjectAllocation> {
            const newAllocation: SubjectAllocation = { id: `ALLOC-${Date.now()}`, ...data };
            allocations.push(newAllocation);
            return newAllocation;
        },
        async remove(id: string): Promise<boolean> {
            const initialLength = allocations.length;
            allocations = allocations.filter(a => a.id !== id);
            return allocations.length < initialLength;
        }
    },
    timetables: {
         async findByTeacher(teacherId: string): Promise<TeacherTimetable[]> {
            return timetables.filter(tt => tt.teacherId === teacherId);
        },
        async create(data: Omit<TeacherTimetable, 'id'>): Promise<TeacherTimetable> {
            const newTimetable: TeacherTimetable = { id: `TT-${Date.now()}`, ...data };
            timetables.push(newTimetable);
            return newTimetable;
        }
    },
    performances: {
        async findByTeacher(teacherId: string): Promise<TeacherPerformance[]> {
            return performances.filter(p => p.teacherId === teacherId);
        },
        async create(data: Omit<TeacherPerformance, 'id'>): Promise<TeacherPerformance> {
            const newPerformance: TeacherPerformance = { id: `PERF-${Date.now()}`, ...data };
            performances.push(newPerformance);
            return newPerformance;
        }
    }
};
