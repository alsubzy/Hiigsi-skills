// src/lib/services/studentService.ts
import { z } from 'zod';
import { studentData, admissionData, attendanceData, promotionData } from '@/lib/data/studentData';
import { academicData } from '@/lib/data/academicData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { Student, Admission } from '@/lib/types';

// --- Validation Schemas ---
const studentSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format.'),
  gender: z.enum(['Male', 'Female', 'Other']),
  classId: z.string().min(1, 'Class is required.'),
  sectionId: z.string().min(1, 'Section is required.'),
  admissionNumber: z.string().min(1, 'Admission number is required.'),
  status: z.enum(['Active', 'Inactive', 'Graduated']).optional(),
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Admission date must be in YYYY-MM-DD format.'),
});

const admissionSchema = z.object({
    studentName: z.string().min(2, 'Student name is required.'),
    appliedClassId: z.string().min(1, 'Applied class is required.'),
    admissionDate: z.date(),
});

const attendanceSchema = z.array(z.object({
    studentId: z.string(),
    status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
}));

const promotionSchema = z.object({
    studentIds: z.array(z.string()).min(1, 'At least one student must be selected.'),
    fromClassId: z.string(),
    toClassId: z.string(),
    academicYearId: z.string(),
});

// --- Student Service ---
export async function getAllStudents(): Promise<Student[]> {
  return studentData.findAll();
}

export async function getStudentById(id: string): Promise<Student> {
  const student = await studentData.findById(id);
  if (!student) throw new ApiError(404, 'Student not found.');
  return student;
}

export async function createStudent(data: unknown): Promise<Student> {
  const validation = studentSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid student data.', validation.error.flatten().fieldErrors);
  }
  const { admissionNumber } = validation.data;
  const existing = await studentData.findByAdmissionNumber(admissionNumber);
  if (existing) {
    throw new ApiError(409, 'A student with this admission number already exists.');
  }

  const newStudent = await studentData.create({
    ...validation.data,
    studentId: `ST-${Date.now()}`, // Generate a user-facing ID
    avatar: `https://picsum.photos/seed/${validation.data.name}/100`,
    status: 'Active',
  });
  await createLog({ userId: 'admin-id', action: 'create_student', module: 'Students', details: `Created student: ${newStudent.name}` });
  return newStudent;
}

export async function updateStudent(id: string, data: unknown): Promise<Student> {
    const validation = studentSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ApiError(400, 'Invalid update data.', validation.error.flatten().fieldErrors);
    }
    const updatedStudent = await studentData.update(id, validation.data);
    if (!updatedStudent) throw new ApiError(404, 'Student not found.');
    await createLog({ userId: 'admin-id', action: 'update_student', module: 'Students', details: `Updated student: ${updatedStudent.name}` });
    return updatedStudent;
}

export async function deleteStudent(id: string): Promise<void> {
    const success = await studentData.remove(id); // Soft delete
    if (!success) throw new ApiError(404, 'Student not found.');
    await createLog({ userId: 'admin-id', action: 'delete_student', module: 'Students', details: `Soft-deleted student ID: ${id}` });
}

// --- Admission Service ---
export async function createAdmission(data: unknown): Promise<Admission> {
    const validation = admissionSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid admission data.', validation.error.flatten().fieldErrors);
    }
    const newAdmission = await admissionData.create({
        ...validation.data,
        status: 'Pending',
    });
    await createLog({ userId: 'admin-id', action: 'create_admission', module: 'Admissions', details: `New admission for ${newAdmission.studentName}` });
    return newAdmission;
}

export async function approveAdmission(admissionId: string): Promise<Student> {
    const admission = await admissionData.findById(admissionId);
    if (!admission || admission.status !== 'Pending') {
        throw new ApiError(400, 'Admission record not found or not in pending state.');
    }
    
    // Create a student record from admission data
    const student = await createStudent({
        name: admission.studentName,
        email: 'temp.email@example.com', // Placeholder
        phone: '000-000-0000',
        address: 'N/A',
        dob: '2010-01-01',
        gender: 'Other',
        classId: admission.appliedClassId,
        sectionId: 's1', // Placeholder
        admissionNumber: `ADM-${Date.now()}`,
        admissionDate: new Date().toISOString().split('T')[0],
    });
    
    await admissionData.update(admissionId, { status: 'Approved', studentId: student.id });
    await createLog({ userId: 'admin-id', action: 'approve_admission', module: 'Admissions', details: `Approved admission for ${student.name}` });

    return student;
}

// --- Attendance Service ---
export async function markAttendance(classId: string, date: Date, data: unknown): Promise<void> {
    const validation = attendanceSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid attendance data.', validation.error.flatten().fieldErrors);
    }
    
    const recordsToSave = validation.data.map(rec => ({ ...rec, date, markedBy: 'admin-id' }));
    await attendanceData.createOrUpdate(recordsToSave);
    await createLog({ userId: 'admin-id', action: 'mark_attendance', module: 'Attendance', details: `Attendance marked for class ${classId} on ${date.toISOString().split('T')[0]}` });
}

// --- Promotion Service ---
export async function promoteStudents(data: unknown): Promise<void> {
    const validation = promotionSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid promotion data.', validation.error.flatten().fieldErrors);
    }

    const { studentIds, fromClassId, toClassId, academicYearId } = validation.data;

    // Validate classes
    const fromClass = await academicData.classes.findById(fromClassId);
    const toClass = await academicData.classes.findById(toClassId);
    if (!fromClass || !toClass) throw new ApiError(404, 'One or both classes not found.');

    for (const studentId of studentIds) {
        const student = await studentData.findById(studentId);
        if (student && student.classId === fromClassId) {
            await studentData.update(studentId, { classId: toClassId });
            await promotionData.create({
                studentId,
                fromClassId,
                toClassId,
                academicYearId,
                promotionDate: new Date(),
            });
        }
    }
    await createLog({ userId: 'admin-id', action: 'promote_students', module: 'Promotions', details: `Promoted ${studentIds.length} students from ${fromClass.name} to ${toClass.name}` });
}
