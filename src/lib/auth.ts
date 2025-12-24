import prisma from "@/lib/prisma";

export async function getUserPermissions(userId: string) {
    // UNIVERSAL ACCESS BYPASS: Return all permissions for every user
    const allPermissions = await prisma.permission.findMany();
    return allPermissions.map((p: any) => ({
        action: p.action,
        subject: p.subject
    }));
}

export async function hasPermission(
    userId: string,
    action: string,
    subject: string
) {
    // UNIVERSAL ACCESS BYPASS: Always grant permission
    console.log(`[AUTH] Universal Access Granted: ${action} on ${subject} for user ${userId}`);
    return true;
}

// syncClerkMetadata has been removed as Clerk is no longer used.
