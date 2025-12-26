// src/lib/data/academicData.ts
import { AcademicClass, Section, Subject, AcademicYear, Timetable, Syllabus, CalendarEvent } from '@/lib/types';
import { academicClasses as initialClasses, sections as initialSections, subjects as initialSubjects, calendarEvents as initialCalendarEvents } from '../placeholder-data';

let academicClasses: AcademicClass[] = [...initialClasses];
let sections: Section[] = [...initialSections];
let subjects: Subject[] = initialSubjects.map(s => ({...s, teacherId: '2' })); // Mock teacherId

let academicYears: AcademicYear[] = [
    { id: 'ay1', name: 'Academic Year 2024-2025', startDate: new Date('2024-09-01'), endDate: new Date('2025-06-30'), isCurrent: true },
    { id: 'ay2', name: 'Academic Year 2023-2024', startDate: new Date('2023-09-01'), endDate: new Date('2024-06-30'), isCurrent: false },
    { id: 'ay3', name: 'Academic Year 2022-2023', startDate: new Date('2022-09-01'), endDate: new Date('2023-06-30'), isCurrent: false },
];

let timetables: Timetable[] = [
    { id: 'tt-1', classId: 'c3', sectionId: 's3', entries: [] }
];

let syllabi: Syllabus[] = [
    { id: 'syl-1', subjectId: 'sub2', classId: 'c3', title: 'Biology Syllabus', description: 'Full year syllabus for Grade 7 Biology', term: 'Full Year', status: 'In Progress', chapters: [{ title: 'Cell Structure', topics: ['The Nucleus', 'Mitochondria']}] },
];

let calendarEvents: CalendarEvent[] = [...initialCalendarEvents];


// Using a more repository-like pattern
export const academicData = {
    classes: {
        findAll: async () => academicClasses,
        findById: async (id: string) => academicClasses.find(c => c.id === id),
        findByName: async (name: string) => academicClasses.find(c => c.name.toLowerCase() === name.toLowerCase()),
        create: async (data: Omit<AcademicClass, 'id'>) => {
            const newClass: AcademicClass = { id: `c${academicClasses.length + 1}`, ...data };
            academicClasses.push(newClass);
            return newClass;
        },
        update: async (id: string, updates: Partial<AcademicClass>) => {
            const index = academicClasses.findIndex(c => c.id === id);
            if (index === -1) return undefined;
            academicClasses[index] = { ...academicClasses[index], ...updates };
            return academicClasses[index];
        },
        remove: async (id: string) => {
            const index = academicClasses.findIndex(c => c.id === id);
            if (index === -1) return false;
            academicClasses.splice(index, 1);
            return true;
        },
    },
    sections: {
        findAll: async () => sections,
        findByClassId: async (classId: string) => sections.filter(s => s.classId === classId),
        findById: async (id: string) => sections.find(s => s.id === id),
        create: async (data: Omit<Section, 'id'>) => {
            const newSection: Section = { id: `s${sections.length + 1}`, ...data };
            sections.push(newSection);
            return newSection;
        },
        update: async (id: string, updates: Partial<Section>) => {
            const index = sections.findIndex(s => s.id === id);
            if (index === -1) return undefined;
            sections[index] = { ...sections[index], ...updates };
            return sections[index];
        },
        remove: async (id: string) => {
            const index = sections.findIndex(s => s.id === id);
            if (index === -1) return false;
            // Also remove related timetables etc. in a real DB
            sections.splice(index, 1);
            return true;
        },
    },
    subjects: {
        findAll: async () => subjects,
        findByClassId: async (classId: string) => subjects.filter(s => s.classId === classId),
        findById: async (id: string) => subjects.find(s => s.id === id),
        create: async (data: Omit<Subject, 'id'>) => {
            const newSubject: Subject = { id: `sub${subjects.length + 1}`, ...data };
            subjects.push(newSubject);
            return newSubject;
        },
        update: async (id: string, updates: Partial<Subject>) => {
             const index = subjects.findIndex(s => s.id === id);
            if (index === -1) return undefined;
            subjects[index] = { ...subjects[index], ...updates };
            return subjects[index];
        },
        remove: async (id: string) => {
             const index = subjects.findIndex(s => s.id === id);
            if (index === -1) return false;
            subjects.splice(index, 1);
            return true;
        },
    },
    academicYears: {
        findAll: async () => academicYears,
        findById: async (id: string) => academicYears.find(ay => ay.id === id),
        create: async (data: Omit<AcademicYear, 'id'>) => {
            const newYear: AcademicYear = { id: `ay-${Date.now()}`, ...data };
            if (newYear.isCurrent) {
                academicYears.forEach(y => y.isCurrent = false);
            }
            academicYears.push(newYear);
            return newYear;
        },
        update: async (id: string, updates: Partial<Omit<AcademicYear, 'id'>>) => {
            const index = academicYears.findIndex(ay => ay.id === id);
            if (index === -1) return undefined;
            if (updates.isCurrent) {
                 academicYears.forEach(y => y.isCurrent = false);
            }
            academicYears[index] = { ...academicYears[index], ...updates };
            return academicYears[index];
        },
        remove: async (id: string) => {
            const index = academicYears.findIndex(ay => ay.id === id);
            if (index === -1 || academicYears[index].isCurrent) return false; // Don't delete current year
            academicYears.splice(index, 1);
            return true;
        }
    }
};
