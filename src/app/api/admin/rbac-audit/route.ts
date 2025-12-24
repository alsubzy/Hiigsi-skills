import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Audit Admin Role in DB
        const adminRole = await prisma.role.findUnique({
            where: { name: "Admin" },
            include: {
                permissions: { include: { permission: true } },
                _count: { select: { users: true } }
            }
        });

        // 2. Map Expected Modules
        const modules = [
            "SCHOOL_PROFILE", "ACADEMIC_YEAR", "USER_MANAGEMENT",
            "CLASS_LEVEL", "SECTION", "SUBJECT", "STAFF",
            "FINANCE", "AUDIT_LOG", "STUDENT"
        ];
        const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

        const missedPermissions: string[] = [];
        const allPermissions = await prisma.permission.findMany();

        for (const m of modules) {
            for (const a of actions) {
                const found = allPermissions.find(p => p.subject === m && p.action === a);
                if (!found) missedPermissions.push(`${a}:${m}`);
            }
        }

        // 3. User Identity Check
        const dbUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id },
            include: { roles: { include: { role: true } } }
        });

        const report = {
            timestamp: new Date().toISOString(),
            currentUser: {
                id: dbUser?.id,
                email: dbUser?.email,
                roles: dbUser?.roles.map(r => r.role.name) || [],
                isAdmin: dbUser?.roles.some(r => r.role.name === 'Admin') || false,
            },
            database: {
                adminRoleExists: !!adminRole,
                adminPermissionsCount: adminRole?.permissions.length || 0,
                adminUserCount: adminRole?._count.users || 0,
                totalPermissionsInDB: allPermissions.length,
                missingPermissions: missedPermissions,
            },
            superuserChecks: {
                hasHardcodedBypassInAuthService: true, // Based on src/lib/auth.ts
                hasHardcodedBypassInAuthProvider: true, // Based on src/components/auth-provider.tsx
                clerkMetadataRole: clerkUser.unsafeMetadata?.role || "Not Set",
            }
        };

        return NextResponse.json(report);
    } catch (error: any) {
        console.error("RBAC Audit Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
