# User and Teacher Synchronization Enhancements

## Overview

This document describes the comprehensive enhancements made to ensure full synchronization between User and Teacher records, with SUPER_ADMIN having complete control over all user and teacher management operations.

## Key Features

### 1. SUPER_ADMIN Full Permissions

**SUPER_ADMIN Role:**
- Has ALL permissions for all modules (CREATE, READ, UPDATE, DELETE)
- Can create, update, edit, and delete any user or teacher
- Full access to USER_MANAGEMENT module
- Recognized in authentication system as having admin privileges

**Permission Verification:**
- Updated `src/lib/auth.ts` to recognize SUPER_ADMIN role
- SUPER_ADMIN users automatically get all permissions
- All admin routes and operations check for SUPER_ADMIN or Admin role

### 2. Complete Database Synchronization

**Synchronization Service (`src/lib/services/userTeacherSyncService.ts`):**

#### `deleteUserWithSync()`
- Deletes user and ALL associated records atomically
- Removes Teacher record if exists
- Removes all UserRole associations
- Removes all Session records
- Soft deletes user (sets status to INACTIVE, deletedAt timestamp)
- Creates comprehensive audit log
- All operations in a single transaction (atomic)

#### `updateUserWithTeacherSync()`
- Updates user information
- Synchronizes role changes
- Automatically creates/updates/deletes Teacher record based on user type
- Handles password updates
- Updates status and isActive flag
- All operations in a single transaction (atomic)

#### `verifyAndFixSync()`
- Maintenance function to detect and fix synchronization issues
- Checks if Teacher record exists when user has Teacher role
- Checks if Teacher record exists when user doesn't have Teacher role
- Automatically fixes inconsistencies

### 3. Enhanced API Endpoints

#### User Management (`/api/admin/users`)

**POST `/api/admin/users`**
- Creates user with automatic role assignment
- Automatically creates Teacher record if userType is TEACHER
- Uses transaction for atomicity
- Full synchronization with database

**PUT `/api/admin/users/[id]`**
- Updates user information
- Uses `updateUserWithTeacherSync()` for complete synchronization
- Handles role changes
- Synchronizes Teacher record automatically
- All updates are atomic

**DELETE `/api/admin/users/[id]`**
- Uses `deleteUserWithSync()` for complete cleanup
- Removes all associated records
- Soft deletes user
- Comprehensive audit logging

#### Teacher Management (`/api/admin/teachers`)

**GET `/api/admin/teachers`**
- Lists all teachers with pagination
- Includes user and teacher information
- Search functionality
- Only accessible to SUPER_ADMIN

**POST `/api/admin/teachers`**
- Creates new teacher
- Automatically creates User record with Teacher role
- Automatically creates Teacher record
- Full synchronization in single transaction

### 4. Transaction-Based Operations

All critical operations use Prisma transactions to ensure:
- **Atomicity**: All changes succeed or all fail
- **Consistency**: Database remains in valid state
- **Isolation**: Concurrent operations don't interfere
- **Durability**: Changes are permanently saved

## Data Flow

### Creating a Teacher

```
1. SUPER_ADMIN calls POST /api/admin/teachers
2. System validates SUPER_ADMIN permissions
3. Transaction begins:
   a. Create User record
   b. Assign Teacher role
   c. Create Teacher record
   d. Create audit log
4. Transaction commits (all or nothing)
5. Return synchronized data
```

### Updating a User

```
1. SUPER_ADMIN calls PUT /api/admin/users/[id]
2. System validates SUPER_ADMIN permissions
3. updateUserWithTeacherSync() called:
   a. Transaction begins
   b. Update User record
   c. Update role if userType changed
   d. Create/Update/Delete Teacher record as needed
   e. Create audit log
   f. Transaction commits
4. Return synchronized data
```

### Deleting a User

```
1. SUPER_ADMIN calls DELETE /api/admin/users/[id]
2. System validates SUPER_ADMIN permissions
3. deleteUserWithSync() called:
   a. Transaction begins
   b. Delete Teacher record (if exists)
   c. Delete all UserRole associations
   d. Delete all Session records
   e. Soft delete User (status=INACTIVE, deletedAt=now)
   f. Create audit log
   g. Transaction commits
4. Return success
```

## Synchronization Rules

### Teacher Record Management

1. **When User is Created with TEACHER type:**
   - User record created
   - Teacher role assigned
   - Teacher record automatically created
   - Employee ID auto-generated if not provided

2. **When User Role Changes to TEACHER:**
   - Existing role removed
   - Teacher role assigned
   - Teacher record created if it doesn't exist
   - Employee ID auto-generated

3. **When User Role Changes from TEACHER:**
   - Teacher role removed
   - New role assigned
   - Teacher record automatically deleted
   - User record remains

4. **When User is Deleted:**
   - Teacher record deleted (if exists)
   - All UserRole associations deleted
   - All Session records deleted
   - User soft deleted

5. **When Teacher Fields are Updated:**
   - User record can be updated
   - Teacher record updated with new fields
   - Both updates in same transaction

## Error Handling

All operations include comprehensive error handling:

- **Validation Errors**: Return 400 with specific error message
- **Permission Errors**: Return 403 with clear message
- **Not Found Errors**: Return 404
- **Database Errors**: Return 500 with logged error details
- **Transaction Rollback**: Automatic on any error

## Audit Logging

All operations create detailed audit logs:

```typescript
{
  userId: "super_admin_id",
  action: "CREATE" | "UPDATE" | "DELETE",
  resource: "USER" | "TEACHER",
  resourceId: "user_id",
  payload: {
    // Operation-specific data
    email: "user@example.com",
    userType: "TEACHER",
    updatedFields: ["firstName", "lastName"],
    // etc.
  }
}
```

## Testing Synchronization

Use the `verifyAndFixSync()` function to check for inconsistencies:

```typescript
import { verifyAndFixSync } from '@/lib/services/userTeacherSyncService';

const result = await verifyAndFixSync(userId);
if (result.fixed) {
  console.log('Fixed issues:', result.issues);
}
```

## Security Features

1. **Permission Checks**: All endpoints verify SUPER_ADMIN role
2. **JWT Authentication**: All requests require valid JWT token
3. **Input Validation**: All inputs validated before processing
4. **SQL Injection Protection**: Prisma ORM handles all queries
5. **Transaction Safety**: All operations use transactions
6. **Audit Trail**: All operations logged for accountability

## API Usage Examples

### Create Teacher
```typescript
POST /api/admin/teachers
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@school.com",
  "password": "SecurePass123!",
  "employeeId": "TCH-001",
  "qualification": "M.Ed",
  "specialization": "Mathematics"
}
```

### Update User
```typescript
PUT /api/admin/users/[id]
{
  "firstName": "Jane",
  "lastName": "Smith",
  "userType": "TEACHER",
  "qualification": "Ph.D",
  "specialization": "Science"
}
```

### Delete User
```typescript
DELETE /api/admin/users/[id]
// Automatically handles all associated records
```

## Migration Notes

When deploying these changes:

1. **Database Migration**: Run Prisma migrations
   ```bash
   npx prisma migrate dev
   ```

2. **Seed Database**: Ensure SUPER_ADMIN role exists
   ```bash
   npx prisma db seed
   ```

3. **Verify Permissions**: Check that SUPER_ADMIN has all permissions
   ```sql
   SELECT * FROM "Role" WHERE name = 'SUPER_ADMIN';
   SELECT COUNT(*) FROM "RolePermission" WHERE "roleId" = (SELECT id FROM "Role" WHERE name = 'SUPER_ADMIN');
   ```

4. **Test Synchronization**: Run verification on existing data
   ```typescript
   // Check all teachers have proper User records
   // Check all users with Teacher role have Teacher records
   ```

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Verify SUPER_ADMIN permissions** before critical operations
3. **Use the sync service** instead of direct database operations
4. **Check audit logs** regularly for synchronization issues
5. **Run verification** periodically to ensure data consistency
6. **Handle errors gracefully** with proper rollback

## Troubleshooting

### Issue: Teacher record not created
**Solution**: Check if user has Teacher role assigned. Use `verifyAndFixSync()` to fix.

### Issue: Orphaned Teacher record
**Solution**: Run verification function. It will detect and remove orphaned records.

### Issue: Permission denied for SUPER_ADMIN
**Solution**: Verify SUPER_ADMIN role exists and has all permissions assigned.

### Issue: Transaction errors
**Solution**: Check database connection and ensure all foreign key constraints are met.

## Summary

The system now provides:
- ✅ Complete SUPER_ADMIN permissions
- ✅ Full User and Teacher synchronization
- ✅ Atomic transaction-based operations
- ✅ Comprehensive error handling
- ✅ Detailed audit logging
- ✅ Data consistency guarantees
- ✅ Easy maintenance and verification

All operations are now fully synchronized, ensuring data consistency across User and Teacher records at all times.

