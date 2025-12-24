import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function audit() {
    console.log("--- RBAC AUDIT START ---");

    // 1. Check Admin Role
    const adminRole = await prisma.role.findUnique({
        where: { name: "Admin" },
        include: { permissions: { include: { permission: true } } }
    });

    if (!adminRole) {
        console.error("❌ Admin role MISSING in database!");
    } else {
        console.log("✅ Admin role found.");
    }

    // 2. Check Permissions
    const modules = [
        "SCHOOL_PROFILE",
        "ACADEMIC_YEAR",
        "USER_MANAGEMENT",
        "CLASS_LEVEL",
        "SECTION",
        "SUBJECT",
        "STAFF",
        "FINANCE",
        "AUDIT_LOG",
    ];
    const actions = ["CREATE", "READ", "UPDATE", "DELETE"];
    const expectedPermissionsCount = modules.length * actions.length;

    const actualPermissionsCount = await prisma.permission.count();
    console.log(`📊 Permissions: Expected ${expectedPermissionsCount}, Found ${actualPermissionsCount}`);

    if (actualPermissionsCount < expectedPermissionsCount) {
        console.warn("⚠️ Some permissions might be missing.");
    }

    // 3. Check Admin Permissions
    if (adminRole) {
        console.log(`🔐 Admin Permissions Count: ${adminRole.permissions.length}`);
        if (adminRole.permissions.length < expectedPermissionsCount) {
            console.warn("⚠️ Admin role does not have all permissions in DB (Fallback bypass will still work).");
        } else {
            console.log("✅ Admin role has full DB permissions.");
        }
    }

    // 4. Check Clerk Sync (First 5 users)
    const users = await prisma.user.findMany({
        take: 5,
        include: { roles: { include: { role: true } } }
    });

    console.log("\n--- USER SYNC CHECK (Sample) ---");
    users.forEach(u => {
        const roles = u.roles.map(r => r.role.name).join(", ");
        console.log(`User: ${u.email} | ClerkID: ${u.clerkUserId ? "✅" : "❌"} | Roles: [${roles}]`);
    });

    console.log("\n--- RBAC AUDIT END ---");
}

audit()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
