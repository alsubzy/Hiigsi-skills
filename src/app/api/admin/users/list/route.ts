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

export async function GET(request: Request) {
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
        { error: 'Forbidden: Only Super Admins can list users' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const roleId = searchParams.get('roleId');

    // Build where clause
    const where: any = {
      deletedAt: null, // Only non-deleted users
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      }),
      ...(status && { status }),
      ...(roleId && {
        roles: {
          some: {
            roleId: roleId
          }
        }
      })
    };

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get all roles for filter dropdown
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        roles
      }
    });

  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
