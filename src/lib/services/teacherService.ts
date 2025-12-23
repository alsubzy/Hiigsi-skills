// src/lib/services/teacherService.ts
import { z } from 'zod';
import { teacherData } from '@/lib/data/teacherData';
import { academicData } from '@/lib/data/academicData';
import { userData } from '../data/userData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { Teacher, SubjectAllocation, TeacherTimetable, TeacherPerformance } from '@/lib/types';

// Schemas
const teacherSchema = z.object({
  userId: z.string().min(1, 'User ID is required.'),
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email(),
  phone: z.string().min(10, 'Phone number is required.'),
  gender: z.enum(['Male', 'Female', 'Other']),
  qualification: z.string().min(2, 'Qualification is required.'),
  hireDate: z.coerce.date(),
  status: z.enum(['Active', 'Inactive', 'On Leave']).optional(),
});

const allocationSchema = z.object({
  teacherId: z.string(),
  subjectId: z.string(),
  classId: z.string(),
  academicYear: z.string().min(4, 'Academic year is required.'),
});

const timetableSchema = z.object({
    teacherId: z.string(),
    subjectId: z.string(),
    classId: z.string(),
    dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format.'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format.'),
});

const performanceSchema = z.object({
    teacherId: z.string(),
    evaluatorId: z.string(),
    evaluationDate: z.coerce.date(),
    teachingQualityScore: z.number().min(0).max(10),
    punctualityScore: z.number().min(0).max(10),
    studentFeedbackScore: z.number().min(0).max(10),
    remarks: z.string().optional(),
});


// --- Teacher Service ---

export async function getAllTeachers(): Promise<Teacher[]> {
    return teacherData.teachers.findAll();
}

export async function getTeacherById(id: string): Promise<Teacher> {
    const teacher = await teacherData.teachers.findById(id);
    if (!teacher) throw new ApiError(404, 'Teacher not found.');
    return teacher;
}

export async function createTeacher(data: unknown): Promise<Teacher> {
    const validation = teacherSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid teacher data.', validation.error.flatten().fieldErrors);
    }
    const { userId, email } = validation.data;

    const existingUser = await userData.findById(userId);
    if (!existingUser || existingUser.role !== 'Teacher') {
        throw new ApiError(400, 'A valid user with a "Teacher" role is required.');
    }

    const existingTeacher = await teacherData.teachers.findByEmail(email);
    if (existingTeacher) {
        throw new ApiError(409, 'A teacher with this email already exists.');
    }

    const newTeacher = await teacherData.teachers.create(validation.data);
    await createLog({ userId: 'admin-id', action: 'create_teacher', module: 'Teachers', details: `Created teacher: ${newTeacher.fullName}` });
    return newTeacher;
}

export async function updateTeacher(id: string, data: unknown): Promise<Teacher> {
    const validation = teacherSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid update data.', validation.error.flatten().fieldErrors);
    }
    const updatedTeacher = await teacherData.teachers.update(id, validation.data);
    if (!updatedTeacher) throw new ApiError(404, 'Teacher not found.');
    await createLog({ userId: 'admin-id', action: 'update_teacher', module: 'Teachers', details: `Updated teacher: ${updatedTeacher.fullName}` });
    return updatedTeacher;
}

export async function deleteTeacher(id: string): Promise<void> {
    const success = await teacherData.teachers.remove(id); // Soft delete
    if (!success) throw new ApiError(404, 'Teacher not found.');
    await createLog({ userId: 'admin-id', action: 'delete_teacher', module: 'Teachers', details: `Deleted teacher ID: ${id}` });
}

export async function setTeacherStatus(id: string, status: 'Active' | 'Inactive' | 'On Leave'): Promise<Teacher> {
    const updatedTeacher = await teacherData.teachers.update(id, { status });
    if (!updatedTeacher) throw new ApiError(404, 'Teacher not found.');
    await createLog({ userId: 'admin-id', action: 'set_teacher_status', module: 'Teachers', details: `Set status of ${updatedTeacher.fullName} to ${status}` });
    return updatedTeacher;
}


// --- Subject Allocation Service ---

export async function assignSubjectToTeacher(data: unknown): Promise<SubjectAllocation> {
    const validation = allocationSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid allocation data.', validation.error.flatten().fieldErrors);
    
    const { teacherId, subjectId, classId } = validation.data;
    const teacher = await teacherData.teachers.findById(teacherId);
    if (!teacher) throw new ApiError(404, 'Teacher not found.');

    const subject = await academicData.subjects.findById(subjectId);
    if (!subject) throw new ApiError(404, 'Subject not found.');
    
    // In a real app, you'd check if the subject belongs to the class
    
    const existingAllocations = await teacherData.allocations.findByTeacher(teacherId);
    if (existingAllocations.some(a => a.subjectId === subjectId && a.classId === classId)) {
        throw new ApiError(409, 'This subject is already allocated to this teacher for this class.');
    }
    
    const allocation = await teacherData.allocations.create(validation.data);
    await createLog({ userId: 'admin-id', action: 'assign_subject', module: 'Teachers', details: `Assigned subject ${subject.name} to ${teacher.fullName}` });
    return allocation;
}

// --- Teacher Timetable Service ---

export async function createTeacherTimetableEntry(data: unknown): Promise<TeacherTimetable> {
    const validation = timetableSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid timetable data.', validation.error.flatten().fieldErrors);
    const newEntry = await teacherData.timetables.create(validation.data);
    await createLog({ userId: 'admin-id', action: 'create_teacher_timetable', module: 'Teachers', details: `Created timetable entry for teacher ${newEntry.teacherId}` });
    return newEntry;
}

// --- Performance Evaluation Service ---

export async function createPerformanceEvaluation(data: unknown): Promise<TeacherPerformance> {
    const validation = performanceSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid performance data.', validation.error.flatten().fieldErrors);

    const { teachingQualityScore, punctualityScore, studentFeedbackScore } = validation.data;
    const overallScore = (teachingQualityScore + punctualityScore + studentFeedbackScore) / 3;

    const newPerformance = await teacherData.performances.create({
        ...validation.data,
        overallScore: parseFloat(overallScore.toFixed(2)),
    });

    await createLog({ userId: 'admin-id', action: 'create_teacher_performance', module: 'Teachers', details: `Created performance review for teacher ${newPerformance.teacherId}` });
    return newPerformance;
}
