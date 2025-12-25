import prisma from '@/lib/prisma';
import { UserType } from './userRoleService';

/**
 * Comprehensive service for synchronizing User and Teacher records
 * Ensures data consistency across all operations
 */

/**
 * Delete user and all associated records (Teacher, UserRole, etc.)
 * This ensures complete synchronization when a user is deleted
 */
export async function deleteUserWithSync(
  userId: string,
  deletedBy: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Check if user exists
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        teacher: true,
        roles: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete Teacher record if it exists (cascade will handle this, but we log it)
    if (user.teacher) {
      await tx.teacher.delete({
        where: { userId },
      });
    }

    // Delete all UserRole associations
    await tx.userRole.deleteMany({
      where: { userId },
    });

    // Delete all sessions
    await tx.session.deleteMany({
      where: { userId },
    });

    // Soft delete the user (set status to INACTIVE and deletedAt)
    await tx.user.update({
      where: { id: userId },
      data: {
        status: 'INACTIVE',
        isActive: false,
        deletedAt: new Date(),
      },
    });

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: deletedBy,
        action: 'DELETE',
        resource: 'USER',
        resourceId: userId,
        payload: {
          email: user.email,
          hadTeacherRecord: !!user.teacher,
          rolesCount: user.roles.length,
        } as any,
      },
    });
  });
}

/**
 * Update user and synchronize Teacher record
 * Ensures Teacher record is created/updated/deleted based on user type
 */
export async function updateUserWithTeacherSync(
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    userType?: UserType;
    password?: string;
    // Teacher-specific fields
    employeeId?: string;
    qualification?: string;
    specialization?: string;
  },
  updatedBy: string
) {
  return await prisma.$transaction(async (tx) => {
    // Get existing user with relations
    const existingUser = await tx.user.findUnique({
      where: { id: userId },
      include: {
        teacher: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prepare user update data
    const userUpdateData: any = {};
    if (updates.firstName) userUpdateData.firstName = updates.firstName;
    if (updates.lastName) userUpdateData.lastName = updates.lastName;
    if (updates.email) userUpdateData.email = updates.email;
    if (updates.phone !== undefined) userUpdateData.phone = updates.phone;
    if (updates.status) {
      userUpdateData.status = updates.status;
      userUpdateData.isActive = updates.status === 'ACTIVE';
    }
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      userUpdateData.passwordHash = await bcrypt.hash(updates.password, 12);
    }

    // Update user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    // Handle role update if userType changed
    if (updates.userType) {
      const currentRoleName = existingUser.roles[0]?.role?.name;
      const roleNameToUserType: Record<string, UserType> = {
        'Teacher': 'TEACHER',
        'Admin': 'ADMIN',
        'Accountant': 'ACCOUNTANT',
        'Staff': 'STAFF',
      };
      const currentUserType = roleNameToUserType[currentRoleName || ''] as UserType;

      if (currentUserType !== updates.userType) {
        // Get new role ID
        const roleNameMap: Record<UserType, string> = {
          TEACHER: 'Teacher',
          ADMIN: 'Admin',
          ACCOUNTANT: 'Accountant',
          STAFF: 'Staff',
        };
        const newRole = await tx.role.findUnique({
          where: { name: roleNameMap[updates.userType] },
        });

        if (newRole) {
          // Remove old roles
          await tx.userRole.deleteMany({
            where: { userId },
          });

          // Assign new role
          await tx.userRole.create({
            data: {
              userId,
              roleId: newRole.id,
            },
          });
        }
      }
    }

    // Synchronize Teacher record
    // If userType is not provided, check if user is currently a teacher
    const isCurrentlyTeacher = existingUser.roles.some(ur => ur.role.name === 'Teacher');
    const shouldHaveTeacher = updates.userType === 'TEACHER' || 
      (isCurrentlyTeacher && !updates.userType);

    if (shouldHaveTeacher) {
      if (existingUser.teacher) {
        // Update existing Teacher record
        const teacherUpdateData: any = {};
        if (updates.employeeId !== undefined) teacherUpdateData.employeeId = updates.employeeId;
        if (updates.qualification !== undefined) teacherUpdateData.qualification = updates.qualification;
        if (updates.specialization !== undefined) teacherUpdateData.specialization = updates.specialization;

        if (Object.keys(teacherUpdateData).length > 0) {
          await tx.teacher.update({
            where: { userId },
            data: teacherUpdateData,
          });
        }
      } else {
        // Create Teacher record if it doesn't exist
        const employeeId = updates.employeeId || 
          `TCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        await tx.teacher.create({
          data: {
            userId,
            employeeId,
            qualification: updates.qualification || null,
            specialization: updates.specialization || null,
          },
        });
      }
    } else if (existingUser.teacher && updates.userType && updates.userType !== 'TEACHER') {
      // Remove Teacher record if user is no longer a teacher
      await tx.teacher.delete({
        where: { userId },
      });
    }

    // Create audit log
    await tx.auditLog.create({
      data: {
        userId: updatedBy,
        action: 'UPDATE',
        resource: 'USER',
        resourceId: userId,
        payload: {
          updatedFields: Object.keys(updates),
          userType: updates.userType || null,
        } as any,
      },
    });

    // Return updated user with relations
    return await tx.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        teacher: true,
      },
    });
  });
}

/**
 * Verify and fix any synchronization issues between User and Teacher records
 * This can be run as a maintenance task
 */
export async function verifyAndFixSync(userId: string): Promise<{
  fixed: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  let fixed = false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacher: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isTeacher = user.roles.some(ur => ur.role.name === 'Teacher');

  // Check if Teacher record exists when it should
  if (isTeacher && !user.teacher) {
    issues.push('User has Teacher role but no Teacher record');
    // Fix: Create Teacher record
    await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: `TCH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });
    fixed = true;
  }

  // Check if Teacher record exists when it shouldn't
  if (!isTeacher && user.teacher) {
    issues.push('User has Teacher record but no Teacher role');
    // Fix: Delete Teacher record
    await prisma.teacher.delete({
      where: { userId: user.id },
    });
    fixed = true;
  }

  return { fixed, issues };
}

