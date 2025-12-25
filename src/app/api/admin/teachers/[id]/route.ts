import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

// Helper function to check if user has Super Admin role
async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });
  return userRoles.some(ur => ur.role.name === 'SUPER_ADMIN' || ur.role.name === 'Admin');
}

/**
 * GET /api/admin/teachers/[id]
 * Get full teacher profile with all details
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'Forbidden: Only Super Admins can view teacher profiles' },
        { status: 403 }
      );
    }

    const teacherId = params.id;

    // Get teacher with all related information
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      include: {
        teacher: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        activityLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Verify this is a teacher
    const isTeacher = teacher.roles.some(ur => ur.role.name === 'Teacher');
    if (!isTeacher) {
      return NextResponse.json(
        { error: 'User is not a teacher' },
        { status: 400 }
      );
    }

    // Remove sensitive data
    const { passwordHash, ...teacherWithoutPassword } = teacher;
    
    return NextResponse.json({
      success: true,
      teacher: teacherWithoutPassword
    });

  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

