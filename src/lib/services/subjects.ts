import prisma from "@/lib/prisma";
import { logAudit } from "./audit";

// ==========================================
// 📚 SUBJECT CRUD
// ==========================================

export async function getSubjects(classId?: string) {
    return await prisma.subject.findMany({
        where: classId ? { classId } : {},
        include: {
            class: true,
            teachers: {
                include: { user: true }
            }
        }
    });
}

export async function createSubject(data: { name: string; code: string; classId: string }, userId?: string) {
    const subject = await prisma.subject.create({ data });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "SUBJECT",
        resourceId: subject.id,
        payload: data
    });

    return subject;
}

export async function updateSubject(id: string, data: { name?: string; code?: string; classId?: string }, userId?: string) {
    const subject = await prisma.subject.update({
        where: { id },
        data
    });

    await logAudit({
        userId,
        action: "UPDATE",
        resource: "SUBJECT",
        resourceId: id,
        payload: data
    });

    return subject;
}

export async function deleteSubject(id: string, userId?: string) {
    await prisma.subject.delete({ where: { id } });

    await logAudit({
        userId,
        action: "DELETE",
        resource: "SUBJECT",
        resourceId: id
    });
}

// ==========================================
// 👨‍🏫 TEACHER ASSIGNMENT
// ==========================================

export async function assignTeacherToSubject(subjectId: string, teacherId: string, userId?: string) {
    const subject = await prisma.subject.update({
        where: { id: subjectId },
        data: {
            teachers: {
                connect: { id: teacherId }
            }
        }
    });

    await logAudit({
        userId,
        action: "ASSIGN",
        resource: "SUBJECT_TEACHER",
        resourceId: `${subjectId}-${teacherId}`
    });

    return subject;
}
