import { Injectable } from '@nestjs/common';
import { ListAuditLogsDto } from './dto/list-audit-logs.dto';
import { AuditRepository } from './repositories/audit.repository';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async logEvent(input: {
    actorUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.auditRepository.createLog(input);
  }

  async listLogs(query: ListAuditLogsDto) {
    return this.auditRepository.listLogs({
      actorUserId: query.actorUserId,
      action: query.action,
      entityType: query.entityType,
      limit: query.limit,
      offset: query.offset,
    });
  }
}
