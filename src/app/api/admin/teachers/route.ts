import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { createUserWithRole, UserType } from '@/lib/services/userRoleService';

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN' || ur.role.name === 'Admin');
}

/**
 * GET /api/admin/teachers
 * List all teachers with their user information
 */
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!(await isSuperAdmin(currentUser.userId))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can view teachers' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      deletedAt: null,
      roles: {
        some: {
          role: {
            name: 'Teacher'
          }
        }
      }
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { teacher: { employeeId: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get teachers with pagination
    const teachers = await prisma.user.findMany({
      where,
      include: {
        teacher: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: teachers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error listing teachers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/teachers
 * Create a new teacher (creates both User and Teacher records)
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!(await isSuperAdmin(currentUser.userId))) {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admins can create teachers' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      temporaryPassword,
      status = 'ACTIVE',
      employeeId,
      qualification,
      specialization,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, and email are required' },
        { status: 400 }
      );
    }

    const finalPassword = password || temporaryPassword;
    if (!finalPassword) {
      return NextResponse.json(
        { error: 'Password or temporary password is required' },
        { status: 400 }
      );
    }

    // Create user with TEACHER type - this automatically creates Teacher record
    const user = await createUserWithRole({
      firstName,
      lastName,
      email,
      phone,
      password: finalPassword,
      userType: 'TEACHER',
      status: status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
      createdBy: currentUser.userId,
      employeeId,
      qualification,
      specialization,
    });

    const { passwordHash, ...userWithoutPassword } = user!;

    return NextResponse.json({
      success: true,
      message: 'Teacher created successfully',
      teacher: userWithoutPassword,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating teacher:', error);

    if (error.message && error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

