import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN');
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin
    if (!(await isSuperAdmin(session.user.id))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can view roles' },
        { status: 403 }
      );
    }

    // Get all roles with their permissions
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Format the response
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(rp => ({
        id: rp.permission.id,
        action: rp.permission.action,
        subject: rp.permission.subject
      })),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    }));

    return NextResponse.json(formattedRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the current user is a Super Admin
    if (!(await isSuperAdmin(session.user.id))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can create roles' },
        { status: 403 }
      );
    }

    const { name, description, permissions } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 400 }
      );
    }

    // Create the role
    const role = await prisma.role.create({
      data: {
        name,
        description,
      }
    });

    // Add permissions if provided
    if (Array.isArray(permissions) && permissions.length > 0) {
      const permissionRecords = await prisma.permission.findMany({
        where: {
          id: {
            in: permissions
          }
        }
      });

      if (permissionRecords.length > 0) {
        await prisma.rolePermission.createMany({
          data: permissionRecords.map(permission => ({
            roleId: role.id,
            permissionId: permission.id
          }))
        });
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'ROLE_CREATED',
        entityType: 'ROLE',
        entityId: role.id,
        performedById: session.user.id,
        metadata: {
          name: role.name,
          permissionCount: Array.isArray(permissions) ? permissions.length : 0
        }
      }
    });

    return NextResponse.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
