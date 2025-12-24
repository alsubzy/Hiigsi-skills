import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding roles and permissions...");

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
        "STUDENT",
    ];

    const actions = ["CREATE", "READ", "UPDATE", "DELETE"];

    // 1. Create Permissions
    const permissions = [];
    for (const subject of modules) {
        for (const action of actions) {
            const permission = await prisma.permission.upsert({
                where: { action_subject: { action, subject } },
                update: {},
                create: { action, subject },
            });
            permissions.push(permission);
        }
    }

    // 2. Create Roles and Assign Permissions
    const roles = [
        { name: "Admin", description: "Full system access" },
        { name: "Teacher", description: "Academic and student management" },
        { name: "Clerk", description: "General administrative tasks" },
        { name: "Accountant", description: "Financial management" },
    ];

    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleData.name },
            update: { description: roleData.description },
            create: roleData,
        });

        // Assign Permissions
        let rolePermissions: any[] = [];

        if (role.name === "Admin") {
            // Admin gets all permissions
            rolePermissions = permissions;
        } else if (role.name === "Teacher") {
            // Teacher permissions
            rolePermissions = permissions.filter((p) =>
                ["ACADEMIC_YEAR", "CLASS_LEVEL", "SECTION", "SUBJECT"].includes(p.subject) &&
                ["READ"].includes(p.action)
            );
            // Teachers can read everything but only edit specific academic modules (example)
        } else if (role.name === "Accountant") {
            // Accountant permissions
            rolePermissions = permissions.filter((p) =>
                ["FINANCE"].includes(p.subject)
            );
        } else if (role.name === "Clerk") {
            // Clerk permissions
            rolePermissions = permissions.filter((p) =>
                ["STAFF", "SECTION", "SUBJECT"].includes(p.subject)
            );
        }

        // Connect permissions to role
        for (const p of rolePermissions) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: role.id, permissionId: p.id } },
                update: {},
                create: { roleId: role.id, permissionId: p.id },
            });
        }
    }

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
