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
        { name: "SUPER_ADMIN", description: "Full system access with user management capabilities" },
        { name: "Admin", description: "Full system access" },
        { name: "Teacher", description: "Academic and student management" },
        { name: "Accountant", description: "Financial management" },
        { name: "Staff", description: "General administrative tasks and staff management" },
    ];

    for (const roleData of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleData.name },
            update: { description: roleData.description },
            create: roleData,
        });

        // Assign Permissions
        let rolePermissions: any[] = [];

        if (role.name === "SUPER_ADMIN" || role.name === "Admin") {
            // SUPER_ADMIN and Admin get all permissions
            rolePermissions = permissions;
        } else if (role.name === "Teacher") {
            // Teacher permissions: Academic modules with full access, student read access
            rolePermissions = permissions.filter((p) =>
                (["ACADEMIC_YEAR", "CLASS_LEVEL", "SECTION", "SUBJECT", "STUDENT"].includes(p.subject) &&
                 ["CREATE", "READ", "UPDATE"].includes(p.action)) ||
                (p.subject === "STUDENT" && p.action === "READ")
            );
        } else if (role.name === "Accountant") {
            // Accountant permissions: Full finance access, read-only student access for billing
            rolePermissions = permissions.filter((p) =>
                (["FINANCE"].includes(p.subject) && ["CREATE", "READ", "UPDATE", "DELETE"].includes(p.action)) ||
                (p.subject === "STUDENT" && p.action === "READ")
            );
        } else if (role.name === "Staff") {
            // Staff permissions: Administrative tasks, staff management, read access to most modules
            rolePermissions = permissions.filter((p) =>
                (["STAFF", "SECTION", "SUBJECT", "STUDENT", "ACADEMIC_YEAR", "CLASS_LEVEL"].includes(p.subject) &&
                 ["CREATE", "READ", "UPDATE"].includes(p.action))
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

    // 3. Create Default Super Admin Account
    console.log("Creating default Super Admin account...");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@hiigsi.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log(`Admin user already exists: ${adminEmail}`);
    } else {
        // Hash password
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const adminUser = await prisma.user.create({
            data: {
                firstName: "Super",
                lastName: "Admin",
                email: adminEmail,
                passwordHash: passwordHash,
                emailVerified: true,
                status: "ACTIVE",
                isActive: true,
            }
        });

        // Assign SUPER_ADMIN role
        const superAdminRole = await prisma.role.findUnique({
            where: { name: "SUPER_ADMIN" }
        });

        if (superAdminRole) {
            await prisma.userRole.create({
                data: {
                    userId: adminUser.id,
                    roleId: superAdminRole.id
                }
            });
            console.log(`✅ Super Admin created successfully: ${adminEmail}`);
        } else {
            console.error("❌ SUPER_ADMIN role not found!");
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
