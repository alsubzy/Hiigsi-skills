import prisma from "@/lib/prisma";
import { logAudit } from "./audit";

// ==========================================
// 🏫 CLASS CRUD
// ==========================================

export async function getClasses() {
    return await prisma.class.findMany({
        include: {
            _count: {
                select: { sections: true, subjects: true }
            }
        },
        orderBy: { level: 'asc' }
    });
}

export async function createClass(data: { name: string; level?: number }, userId?: string) {
    const newClass = await prisma.class.create({ data });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "CLASS",
        resourceId: newClass.id,
        payload: data
    });

    return newClass;
}

export async function updateClass(id: string, data: { name?: string; level?: number }, userId?: string) {
    const updatedClass = await prisma.class.update({
        where: { id },
        data
    });

    await logAudit({
        userId,
        action: "UPDATE",
        resource: "CLASS",
        resourceId: id,
        payload: data
    });

    return updatedClass;
}

export async function deleteClass(id: string, userId?: string) {
    const deletedClass = await prisma.class.delete({ where: { id } });

    await logAudit({
        userId,
        action: "DELETE",
        resource: "CLASS",
        resourceId: id
    });

    return deletedClass;
}

// ==========================================
// 🏢 SECTION CRUD
// ==========================================

export async function getSections(classId?: string) {
    return await prisma.section.findMany({
        where: classId ? { classId } : {},
        include: {
            class: true,
            classTeachers: {
                include: { teacher: { include: { user: true } } }
            }
        }
    });
}

export async function createSection(data: { name: string; classId: string }, userId?: string) {
    const section = await prisma.section.create({ data });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "SECTION",
        resourceId: section.id,
        payload: data
    });

    return section;
}

export async function updateSection(id: string, data: { name?: string; classId?: string }, userId?: string) {
    const section = await prisma.section.update({
        where: { id },
        data
    });

    await logAudit({
        userId,
        action: "UPDATE",
        resource: "SECTION",
        resourceId: id,
        payload: data
    });

    return section;
}

export async function deleteSection(id: string, userId?: string) {
    await prisma.section.delete({ where: { id } });

    await logAudit({
        userId,
        action: "DELETE",
        resource: "SECTION",
        resourceId: id
    });
}
