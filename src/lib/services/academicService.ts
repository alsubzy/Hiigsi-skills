// src/lib/services/academicService.ts
import { z } from 'zod';
import { academicData } from '@/lib/data/academicData';
import { ApiError } from '@/lib/utils/ApiError';
import type { AcademicClass, Section, Subject } from '@/lib/types';
import { createLog } from './logService';

// --- Validation Schemas ---
const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters.'),
  level: z.string().min(3, 'Level is required.'),
  status: z.enum(['Active', 'Inactive']),
});

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required.'),
  classId: z.string().min(1, 'Class ID is required.'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be a positive integer.'),
  status: z.enum(['Active', 'Inactive']),
});

const subjectSchema = z.object({
    name: z.string().min(2, 'Subject name is required.'),
    classId: z.string().min(1, 'Class ID is required.'),
    teacherId: z.string().optional(),
    status: z.enum(['Active', 'Inactive']),
});


// --- Class Service Functions ---

export async function getAllClasses(): Promise<AcademicClass[]> {
  return academicData.classes.findAll();
}

export async function createClass(data: unknown): Promise<AcademicClass> {
  const validation = classSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid class data.', validation.error.flatten().fieldErrors);
  }
  const { name, level, status } = validation.data;
  
  const existing = await academicData.classes.findByName(name);
  if (existing) {
    throw new ApiError(409, 'A class with this name already exists.');
  }

  const newClass = await academicData.classes.create({ name, level, status });
  await createLog({ userId: 'admin-id', action: 'create_class', module: 'Academics', details: `Created class: ${name}` });
  return newClass;
}

export async function updateClass(id: string, data: unknown): Promise<AcademicClass> {
    const validation = classSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ApiError(400, 'Invalid class update data.', validation.error.flatten().fieldErrors);
    }
    const updatedClass = await academicData.classes.update(id, validation.data);
    if (!updatedClass) {
      throw new ApiError(404, 'Class not found.');
    }
    await createLog({ userId: 'admin-id', action: 'update_class', module: 'Academics', details: `Updated class: ${updatedClass.name}` });
    return updatedClass;
}

export async function deleteClass(id: string): Promise<void> {
    const success = await academicData.classes.remove(id);
    if (!success) {
        throw new ApiError(404, 'Class not found.');
    }
     await createLog({ userId: 'admin-id', action: 'delete_class', module: 'Academics', details: `Deleted class ID: ${id}` });
}


// --- Section Service Functions ---

export async function getSectionsByClass(classId: string): Promise<Section[]> {
    return academicData.sections.findByClassId(classId);
}

export async function createSection(data: unknown): Promise<Section> {
    const validation = sectionSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid section data.', validation.error.flatten().fieldErrors);
    }
    const { name, classId, capacity, status } = validation.data;

    // Ensure class exists
    const parentClass = await academicData.classes.findById(classId);
    if (!parentClass) {
        throw new ApiError(404, 'The specified class does not exist.');
    }

    const newSection = await academicData.sections.create({ name, classId, capacity, status });
    await createLog({ userId: 'admin-id', action: 'create_section', module: 'Academics', details: `Created section ${name} for class ${parentClass.name}` });
    return newSection;
}

export async function updateSection(id: string, data: unknown): Promise<Section> {
    const validation = sectionSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid section update data.', validation.error.flatten().fieldErrors);
    }
    const updatedSection = await academicData.sections.update(id, validation.data);
    if (!updatedSection) {
      throw new ApiError(404, 'Section not found.');
    }
    await createLog({ userId: 'admin-id', action: 'update_section', module: 'Academics', details: `Updated section: ${updatedSection.name}` });
    return updatedSection;
}

export async function deleteSection(id: string): Promise<void> {
    const success = await academicData.sections.remove(id);
    if (!success) {
        throw new ApiError(404, 'Section not found.');
    }
    await createLog({ userId: 'admin-id', action: 'delete_section', module: 'Academics', details: `Deleted section ID: ${id}` });
}


// --- Subject Service Functions ---

export async function getSubjectsByClass(classId: string): Promise<Subject[]> {
    return academicData.subjects.findByClassId(classId);
}

export async function createSubject(data: unknown): Promise<Subject> {
    const validation = subjectSchema.safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid subject data.', validation.error.flatten().fieldErrors);
    }
     const { name, classId, teacherId, status } = validation.data;
    
    // Ensure class exists
    const parentClass = await academicData.classes.findById(classId);
    if (!parentClass) {
        throw new ApiError(404, 'The specified class does not exist.');
    }

    const newSubject = await academicData.subjects.create({ name, classId, teacherId, status });
    await createLog({ userId: 'admin-id', action: 'create_subject', module: 'Academics', details: `Created subject ${name} for class ${parentClass.name}` });
    return newSubject;
}

export async function updateSubject(id: string, data: unknown): Promise<Subject> {
    const validation = subjectSchema.partial().safeParse(data);
    if (!validation.success) {
        throw new ApiError(400, 'Invalid subject update data.', validation.error.flatten().fieldErrors);
    }
    const updatedSubject = await academicData.subjects.update(id, validation.data);
    if (!updatedSubject) {
      throw new ApiError(404, 'Subject not found.');
    }
    await createLog({ userId: 'admin-id', action: 'update_subject', module: 'Academics', details: `Updated subject: ${updatedSubject.name}` });
    return updatedSubject;
}

export async function deleteSubject(id: string): Promise<void> {
    const success = await academicData.subjects.remove(id);
    if (!success) {
        throw new ApiError(404, 'Subject not found.');
    }
    await createLog({ userId: 'admin-id', action: 'delete_subject', module: 'Academics', details: `Deleted subject ID: ${id}` });
}

// Implement other services for Calendar, Timetable, Syllabus here...
