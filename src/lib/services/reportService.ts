// src/lib/services/reportService.ts
import { z } from 'zod';
import { reportData } from '@/lib/data/reportData';
import { ApiError } from '@/lib/utils/ApiError';
import { createLog } from './logService';
import type { GeneratedReport } from '@/lib/types';

// --- Validation Schemas ---
const reportSchema = z.object({
  name: z.string().min(5, 'Report name is required.'),
  type: z.enum(['Finance', 'Academic', 'Examination', 'Administrative']),
  status: z.enum(['Generated', 'Archived']),
  generatedBy: z.string(),
});

// --- Service Functions ---

/**
 * Retrieves a paginated list of generated reports.
 */
export async function getGeneratedReports(filters: {
  page: number;
  limit: number;
  type?: string | null;
}) {
  return reportData.generatedReports.find(filters);
}

/**
 * Creates a new generated report record.
 * @param data - The data for the new report.
 * @param generatedById - The ID of the user generating the report.
 */
export async function createGeneratedReport(data: unknown): Promise<GeneratedReport> {
  const validation = reportSchema.safeParse(data);
  if (!validation.success) {
    throw new ApiError(400, 'Invalid report data.', validation.error.flatten().fieldErrors);
  }

  const newReport = await reportData.generatedReports.create(validation.data);
  
  await createLog({
    userId: validation.data.generatedBy,
    action: 'create_report',
    module: 'Reports',
    details: `Generated report: ${newReport.name}`,
  });

  return newReport;
}

/**
 * Retrieves the main analytics summary for the dashboard.
 */
export async function getAnalyticsSummary() {
    const summary = await reportData.analytics.getSummary();
    if (!summary) {
        throw new ApiError(500, 'Could not retrieve analytics summary.');
    }
    return summary;
}
