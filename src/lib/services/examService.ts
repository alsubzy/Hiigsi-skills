// src/lib/services/examService.ts
import { z } from 'zod';
import { examData } from '@/lib/data/examData';
import { studentData } from '@/lib/data/studentData';
import { academicData } from '@/lib/data/academicData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { Exam, ExamSchedule, Mark, ReportCard } from '@/lib/types';

// --- Schemas ---
const examSchema = z.object({
    name: z.string().min(3, 'Exam name is required.'),
    academicYearId: z.string(),
    term: z.string(),
    classIds: z.array(z.string()).min(1, 'At least one class must be selected.'),
    subjectIds: z.array(z.string()).min(1, 'At least one subject must be selected.'),
    status: z.enum(['Draft', 'Scheduled', 'Completed', 'Published']).optional(),
});

const scheduleSchema = z.object({
    examId: z.string(),
    subjectId: z.string(),
    classId: z.string(),
    date: z.coerce.date(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    room: z.string(),
});

const markEntrySchema = z.object({
    examId: z.string(),
    studentId: z.string(),
    subjectId: z.string(),
    marksObtained: z.number().min(0),
    maxMarks: z.number().min(1),
});

// --- Exam Service ---

export async function createExam(data: unknown): Promise<Exam> {
    const validation = examSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid exam data', validation.error.flatten());
    
    const newExam = await examData.exams.create({ ...validation.data, status: validation.data.status || 'Draft' });
    await createLog({ userId: 'admin-id', action: 'create_exam', module: 'Exams', details: `Created exam: ${newExam.name}` });
    return newExam;
}

export async function getAllExams(): Promise<Exam[]> {
    return examData.exams.findAll();
}

export async function getExamById(id: string): Promise<Exam> {
    const exam = await examData.exams.findById(id);
    if (!exam) throw new ApiError(404, 'Exam not found.');
    return exam;
}

export async function updateExam(id: string, data: unknown): Promise<Exam> {
    const validation = examSchema.partial().safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid update data', validation.error.flatten());

    const updatedExam = await examData.exams.update(id, validation.data);
    if (!updatedExam) throw new ApiError(404, 'Exam not found.');
    
    await createLog({ userId: 'admin-id', action: 'update_exam', module: 'Exams', details: `Updated exam: ${updatedExam.name}` });
    return updatedExam;
}

export async function deleteExam(id: string): Promise<void> {
    // Also delete related schedules, marks, and report cards
    const schedules = await examData.schedules.findByExam(id);
    for (const schedule of schedules) {
        await examData.schedules.remove(schedule.id);
    }
    await examData.reportCards.removeByExam(id);
    
    const success = await examData.exams.remove(id);
    if (!success) throw new ApiError(404, 'Exam not found.');

    await createLog({ userId: 'admin-id', action: 'delete_exam', module: 'Exams', details: `Deleted exam ID: ${id}` });
}

// --- Schedule Service ---

export async function createExamSchedule(data: unknown): Promise<ExamSchedule> {
    const validation = scheduleSchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid schedule data.', validation.error.flatten());

    // Basic conflict validation
    const existingSchedules = await examData.schedules.findByClass(validation.data.classId);
    const newStartTime = validation.data.date.setHours(parseInt(validation.data.startTime.split(':')[0]), parseInt(validation.data.startTime.split(':')[1]));
    const newEndTime = validation.data.date.setHours(parseInt(validation.data.endTime.split(':')[0]), parseInt(validation.data.endTime.split(':')[1]));

    for (const s of existingSchedules) {
        if (s.date.toDateString() === validation.data.date.toDateString()) {
            const existingStartTime = s.date.setHours(parseInt(s.startTime.split(':')[0]), parseInt(s.startTime.split(':')[1]));
            const existingEndTime = s.date.setHours(parseInt(s.endTime.split(':')[0]), parseInt(s.endTime.split(':')[1]));
            if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
                throw new ApiError(409, 'Schedule conflict detected in the same room or for the same class.');
            }
        }
    }
    
    const newSchedule = await examData.schedules.create(validation.data);
    await createLog({ userId: 'admin-id', action: 'create_exam_schedule', module: 'Exams', details: `Scheduled subject ${newSchedule.subjectId} for exam ${newSchedule.examId}` });
    return newSchedule;
}

export async function getSchedulesByExam(examId: string): Promise<ExamSchedule[]> {
    return examData.schedules.findByExam(examId);
}

// --- Marks Service ---
export async function enterMarks(data: unknown, enteredBy: string): Promise<Mark> {
    const validation = markEntrySchema.safeParse(data);
    if (!validation.success) throw new ApiError(400, 'Invalid mark data.', validation.error.flatten());
    if (validation.data.marksObtained > validation.data.maxMarks) {
        throw new ApiError(400, 'Marks obtained cannot exceed maximum marks.');
    }

    const { examId, studentId, subjectId, marksObtained, maxMarks } = validation.data;
    
    const existingMark = await examData.marks.find(examId, studentId, subjectId);
    if (existingMark) {
        const updatedMark = await examData.marks.update(existingMark.id, { marksObtained, maxMarks, enteredBy });
        await createLog({ userId: enteredBy, action: 'update_marks', module: 'Exams', details: `Updated marks for student ${studentId}` });
        return updatedMark!;
    }

    const newMark = await examData.marks.create({ ...validation.data, enteredBy });
    await createLog({ userId: enteredBy, action: 'enter_marks', module: 'Exams', details: `Entered marks for student ${studentId}` });
    return newMark;
}

// --- Results Service ---
function calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

export async function generateReportCard(examId: string, studentId: string): Promise<ReportCard> {
    const student = await studentData.findById(studentId);
    if (!student) throw new ApiError(404, 'Student not found.');

    const marks = await examData.marks.findByStudent(examId, studentId);
    if (marks.length === 0) throw new ApiError(404, 'No marks found for this student for the specified exam.');
    
    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    
    const subjectResults = await Promise.all(marks.map(async (mark) => {
        totalMarksObtained += mark.marksObtained;
        totalMaxMarks += mark.maxMarks;
        const subject = await academicData.subjects.findById(mark.subjectId);
        const percentage = (mark.marksObtained / mark.maxMarks) * 100;
        return {
            subjectId: mark.subjectId,
            subjectName: subject?.name || 'Unknown',
            marksObtained: mark.marksObtained,
            maxMarks: mark.maxMarks,
            grade: calculateGrade(percentage),
        };
    }));

    const overallPercentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    const overallGrade = calculateGrade(overallPercentage);
    const status = overallGrade === 'F' ? 'Fail' : 'Pass';

    const reportCardData = {
        studentId,
        examId,
        classId: student.classId,
        totalMarks: totalMarksObtained,
        percentage: parseFloat(overallPercentage.toFixed(2)),
        grade: overallGrade,
        status,
        remarks: status === 'Pass' ? 'Promoted to the next class.' : 'Needs improvement.',
        subjectResults,
    };
    
    // In a real scenario, you might update an existing report card
    const reportCard = await examData.reportCards.create(reportCardData);
    await createLog({ userId: 'admin-id', action: 'generate_report_card', module: 'Exams', details: `Generated report card for student ${studentId}` });

    return reportCard;
}

export async function getReportCard(examId: string, studentId: string): Promise<ReportCard | undefined> {
    return examData.reportCards.findByStudent(examId, studentId);
}
