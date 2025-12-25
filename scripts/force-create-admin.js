
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found in environment');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Neon
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hiigsi.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        // 1. Ensure Admin Role exists
        const roleRes = await client.query('SELECT id FROM "Role" WHERE name = $1', ['Admin']);
        let roleId;

        if (roleRes.rows.length === 0) {
            console.log('Creating Admin role...');
            // Generate a CUID-like ID or UUID. Postgres can generate UUIDs if extension enabled, 
            // but Prisma usually handles CUIDs. We'll use a simple random string for now or UUID if possible.
            // Let's rely on gen_random_uuid() if available, otherwise just use a timestamp based ID.
            // Better to check if pgcrypto or uuid-ossp is enabled, or just generate one here.
            // We'll generate a simple one.
            const newRoleId = 'role_' + Date.now() + Math.random().toString(36).substring(7);

            await client.query(
                'INSERT INTO "Role" (id, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
                [newRoleId, 'Admin', 'Full System Administrator']
            );
            roleId = newRoleId;
        } else {
            roleId = roleRes.rows[0].id;
        }
        console.log('Admin Role ID:', roleId);

        // 2. Check if User exists
        const userRes = await client.query('SELECT id FROM "User" WHERE email = $1', [adminEmail]);
        let userId;

        if (userRes.rows.length > 0) {
            console.log('Admin user already exists. Updating password...');
            userId = userRes.rows[0].id;
            const hashedPassword = await bcrypt.hash(adminPassword, 12);

            await client.query(
                'UPDATE "User" SET "passwordHash" = $1, status = $2, "isActive" = $3 WHERE id = $4',
                [hashedPassword, 'ACTIVE', true, userId]
            );
            console.log('Admin password updated.');
        } else {
            console.log('Creating Admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 12);
            const newUserId = 'user_' + Date.now() + Math.random().toString(36).substring(7);

            await client.query(
                'INSERT INTO "User" (id, "firstName", "lastName", email, "passwordHash", status, "isActive", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
                [newUserId, 'Super', 'Admin', adminEmail, hashedPassword, 'ACTIVE', true]
            );
            userId = newUserId;
            console.log('Admin user created.');
        }

        // 3. Assign Role
        const userRoleRes = await client.query(
            'SELECT id FROM "UserRole" WHERE "userId" = $1 AND "roleId" = $2',
            [userId, roleId]
        );

        if (userRoleRes.rows.length === 0) {
            const newUserRoleId = 'ur_' + Date.now() + Math.random().toString(36).substring(7);
            await client.query(
                'INSERT INTO "UserRole" (id, "userId", "roleId") VALUES ($1, $2, $3)',
                [newUserRoleId, userId, roleId]
            );
            console.log('Admin role assigned to user.');
        } else {
            console.log('User already has Admin role.');
        }

        console.log('SUCCESS: Admin account ready.');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

main();
