import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { auditLogs } from '../../../database/schema';

export type AuditLog = InferSelectModel<typeof auditLogs>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;

export interface AuditLogFilter {
  actorUserId?: string;
  action?: string;
  entityType?: string;
  limit: number;
  offset: number;
}
