import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function auditSystemRBAC() {
    console.log("==========================================");
    console.log("🔍 ROLES & PERMISSIONS SYSTEM AUDIT");
    console.log("==========================================\n");

    // 1. Check for Admin Role
    const adminRole = await prisma.role.findUnique({
        where: { name: "Admin" },
        include: { _count: { select: { permissions: true, users: true } } }
    });

    if (!adminRole) {
        console.error("❌ ERROR: 'Admin' role is missing from database!");
    } else {
        console.log(`✅ 'Admin' role exists (ID: ${adminRole.id})`);
        console.log(`   - Permissions assigned: ${adminRole._count.permissions}`);
        console.log(`   - Users assigned: ${adminRole._count.users}`);
    }

    // 2. Check for Permissions Coverage
    const allPermissions = await prisma.permission.findMany();
    console.log(`\n📊 Total Permissions in System: ${allPermissions.length}`);

    const modules = [
        "SCHOOL_PROFILE", "ACADEMIC_YEAR", "USER_MANAGEMENT",
        "CLASS_LEVEL", "SECTION", "SUBJECT", "STAFF",
        "AUDIT_LOG", "FINANCE", "STUDENT"
    ];
    const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

    const missingPermissions = [];
    for (const module of modules) {
        for (const action of actions) {
            const exists = allPermissions.some(p => p.action === action && p.subject === module);
            if (!exists) missingPermissions.push(`${action} on ${module}`);
        }
    }

    if (missingPermissions.length > 0) {
        console.warn(`\n⚠️ Missing Permissions (${missingPermissions.length}):`);
        missingPermissions.forEach(p => console.warn(`   - ${p}`));
    } else {
        console.log("✅ All standard module permissions are defined.");
    }

    // 3. Check Admin Completeness
    if (adminRole) {
        const adminPermissionIds = (await prisma.rolePermission.findMany({
            where: { roleId: adminRole.id }
        })).map(rp => rp.permissionId);

        const unassignedToAdmin = allPermissions.filter(p => !adminPermissionIds.includes(p.id));

        if (unassignedToAdmin.length > 0) {
            console.warn(`\n⚠️ Admin role is missing ${unassignedToAdmin.length} permissions:`);
            unassignedToAdmin.forEach(p => console.warn(`   - ${p.action} on ${p.subject}`));
        } else {
            console.log("✅ Admin role has all defined permissions.");
        }
    }

    // 4. Check for Users with the target email (Admin verification)
    const targetEmail = "zapdirzak@gmail.com";
    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { roles: { include: { role: true } } }
    });

    if (user) {
        const userRoles = user.roles.map(r => r.role.name);
        console.log(`\n👤 User Registry Check (${targetEmail}):`);
        console.log(`   - Clerk ID: ${user.clerkUserId || 'N/A'}`);
        console.log(`   - Roles: [${userRoles.join(", ")}]`);

        if (!userRoles.includes("Admin")) {
            console.error(`❌ ERROR: ${targetEmail} does NOT have the 'Admin' role!`);
        } else {
            console.log(`✅ ${targetEmail} is correctly assigned as 'Admin'.`);
        }
    } else {
        console.warn(`\n👤 User ${targetEmail} not found in database.`);
    }

    // 5. Detect Conflicting Roles (Multiple roles which might cause confusion)
    const usersWithMultipleRoles = await prisma.user.findMany({
        where: { roles: { count: { gt: 1 } } },
        include: { roles: { include: { role: true } } }
    });

    if (usersWithMultipleRoles.length > 0) {
        console.log(`\n👥 Users with Multiple Roles (${usersWithMultipleRoles.length}):`);
        usersWithMultipleRoles.forEach(u => {
            console.log(`   - ${u.email}: [${u.roles.map(r => r.role.name).join(", ")}]`);
        });
    }

    console.log("\n==========================================");
    console.log("🏁 AUDIT FINISHED");
    console.log("==========================================");
}

auditSystemRBAC()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
