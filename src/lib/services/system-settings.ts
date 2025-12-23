import prisma from "@/lib/prisma";

// ==========================================
// 🏫 SCHOOL PROFILE CRUD
// ==========================================

export async function getSchoolProfile() {
    return await prisma.schoolProfile.findFirst();
}

export async function updateSchoolProfile(data: {
    schoolName: string;
    logo?: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    principalName: string;
}) {
    const profile = await prisma.schoolProfile.findFirst();
    if (profile) {
        return await prisma.schoolProfile.update({
            where: { id: profile.id },
            data,
        });
    }
    return await prisma.schoolProfile.create({ data });
}

// ==========================================
// 📅 ACADEMIC YEAR CRUD
// ==========================================

export async function getAcademicYears() {
    return await prisma.academicYear.findMany({
        orderBy: { startDate: "desc" },
    });
}

export async function createAcademicYear(data: {
    name: string;
    startDate: Date;
    endDate: Date;
    isCurrent?: boolean;
}) {
    // If setting as current, unset others
    if (data.isCurrent) {
        await prisma.academicYear.updateMany({
            data: { isCurrent: false },
        });
    }
    return await prisma.academicYear.create({ data });
}

export async function updateAcademicYear(
    id: string,
    data: {
        name?: string;
        startDate?: Date;
        endDate?: Date;
        isCurrent?: boolean;
    }
) {
    if (data.isCurrent) {
        await prisma.academicYear.updateMany({
            data: { isCurrent: false },
        });
    }
    return await prisma.academicYear.update({
        where: { id },
        data,
    });
}

export async function deleteAcademicYear(id: string) {
    return await prisma.academicYear.delete({
        where: { id },
    });
}

// ==========================================
// 📊 AUDIT LOG HELPER
// ==========================================

export async function createAuditLog(data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    payload?: any;
}) {
    return await prisma.auditLog.create({
        data,
    });
}
