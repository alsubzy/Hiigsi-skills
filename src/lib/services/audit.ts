import prisma from "@/lib/prisma";

export async function logAudit(data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    payload?: any;
    ipAddress?: string;
}) {
    try {
        return await prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                resource: data.resource,
                resourceId: data.resourceId,
                payload: data.payload ? JSON.stringify(data.payload) : null,
                ipAddress: data.ipAddress,
            },
        });
    } catch (error) {
        console.error("Failed to log audit:", error);
    }
}
