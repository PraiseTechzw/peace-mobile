import { Injectable } from '@nestjs/common';
import { SQL, and, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { auditLogs } from '../../../database/schema';
import { AuditLogFilter } from '../types/audit.types';

@Injectable()
export class AuditRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createLog(input: {
    actorUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const [log] = await this.databaseService.db
      .insert(auditLogs)
      .values({
        actorUserId: input.actorUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata ?? {},
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      })
      .returning();
    return log;
  }

  async listLogs(filter: AuditLogFilter) {
    const predicates: SQL[] = [];
    if (filter.actorUserId) predicates.push(eq(auditLogs.actorUserId, filter.actorUserId));
    if (filter.action) predicates.push(eq(auditLogs.action, filter.action));
    if (filter.entityType) predicates.push(eq(auditLogs.entityType, filter.entityType));

    const whereClause = predicates.length > 0 ? and(...predicates) : undefined;
    const query = this.databaseService.db.select().from(auditLogs);
    return whereClause
      ? query
          .where(whereClause)
          .orderBy(desc(auditLogs.createdAt))
          .limit(filter.limit)
          .offset(filter.offset)
      : query.orderBy(desc(auditLogs.createdAt)).limit(filter.limit).offset(filter.offset);
  }
}
