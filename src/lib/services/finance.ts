import prisma from "@/lib/prisma";
import { logAudit } from "./audit";

// ==========================================
// 💰 FEE CATEGORY CRUD
// ==========================================

export async function getFeeCategories() {
    return await prisma.feeCategory.findMany({
        include: {
            feeStructures: {
                include: { class: true }
            }
        }
    });
}

export async function createFeeCategory(data: { name: string; description?: string }, userId?: string) {
    const category = await prisma.feeCategory.create({ data });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "FEE_CATEGORY",
        resourceId: category.id,
        payload: data
    });

    return category;
}

// ==========================================
// 💸 FEE STRUCTURE CRUD
// ==========================================

export async function createFeeStructure(data: {
    classId: string;
    categoryId: string;
    amount: number;
    frequency: string;
}, userId?: string) {
    const structure = await prisma.feeStructure.create({
        data: {
            classId: data.classId,
            categoryId: data.categoryId,
            amount: data.amount,
            frequency: data.frequency
        }
    });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "FEE_STRUCTURE",
        resourceId: structure.id,
        payload: data
    });

    return structure;
}

export async function getFeeStructures(classId?: string) {
    return await prisma.feeStructure.findMany({
        where: classId ? { classId } : {},
        include: {
            class: true,
            category: true
        }
    });
}
