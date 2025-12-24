import prisma from "@/lib/prisma";
import { logAudit } from "./audit";

// ==========================================
// 👤 STAFF MANAGEMENT CRUD
// ==========================================

export async function getStaff() {
    return await prisma.user.findMany({
        where: {
            roles: {
                some: {
                    role: { name: { notIn: ["Student", "Parent"] } }
                }
            }
        },
        include: {
            roles: {
                include: { role: true }
            },
            teacher: true
        }
    });
}

export async function getAllUsers() {
    return await prisma.user.findMany({
        include: {
            roles: {
                include: { role: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createStaff(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleIds: string[];
}, userId?: string) {
    const staff = await prisma.user.create({
        data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            roles: {
                create: data.roleIds.map(roleId => ({ roleId }))
            }
        }
    });

    await logAudit({
        userId,
        action: "CREATE",
        resource: "STAFF",
        resourceId: staff.id,
        payload: data
    });

    return staff;
}

export async function updateStaffRoles(staffId: string, roleIds: string[], userId?: string) {
    // Clear old roles
    await prisma.userRole.deleteMany({ where: { userId: staffId } });

    // Add new roles
    const updated = await prisma.user.update({
        where: { id: staffId },
        data: {
            roles: {
                create: roleIds.map(roleId => ({ roleId }))
            }
        }
    });

    await logAudit({
        userId,
        action: "UPDATE_ROLES",
        resource: "STAFF",
        resourceId: staffId,
        payload: { roleIds }
    });

    return updated;
}

// ==========================================
// 🔐 ROLE & PERMISSION MANAGEMENT
// ==========================================

export async function getRolesWithPermissions() {
    return await prisma.role.findMany({
        include: {
            permissions: {
                include: { permission: true }
            }
        }
    });
}
