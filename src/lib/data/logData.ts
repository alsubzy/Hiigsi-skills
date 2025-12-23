// src/lib/data/logData.ts
import { ActivityLog } from '@/lib/types';

let logs: ActivityLog[] = [];

export const logData = {
  async add(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      ...log,
      timestamp: new Date(),
    };
    logs.unshift(newLog); // Add to the beginning for chronological order
    return newLog;
  },

  async find(filters: {
    page: number;
    limit: number;
    userId?: string | null;
    module?: string | null;
  }): Promise<{ logs: ActivityLog[]; total: number; pages: number }> {
    const { page, limit, userId, module } = filters;
    let filteredLogs = logs;

    if (userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === userId);
    }
    if (module) {
      filteredLogs = filteredLogs.filter((log) => log.module === module);
    }

    const total = filteredLogs.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

    return { logs: paginatedLogs, total, pages };
  },
};
