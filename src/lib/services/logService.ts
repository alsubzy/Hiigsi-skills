// src/lib/services/logService.ts
import { logData } from '@/lib/data/logData';
import { ActivityLog } from '@/lib/types';

/**
 * Creates a new activity log entry.
 * @param logDetails - The details of the log entry.
 * @returns The created log entry.
 */
export async function createLog(logDetails: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
  // In a real app, you might have validation here
  const newLog = await logData.add(logDetails);
  return newLog;
}

/**
 * Retrieves logs with pagination and filtering.
 * @param filters - The filters and pagination options.
 * @returns A paginated list of logs.
 */
export async function getLogs(filters: {
  page: number;
  limit: number;
  userId?: string | null;
  module?: string | null;
}) {
  const { page = 1, limit = 10, userId, module } = filters;
  const result = await logData.find({ page, limit, userId, module });
  return result;
}
