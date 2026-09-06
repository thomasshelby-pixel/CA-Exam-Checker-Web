import { db } from '../db/database';
import { AuditLog, UserRole } from '../../src/types';

export function logAuditEvent(params: {
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress?: string;
}): AuditLog {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    details: params.details,
    ipAddress: params.ipAddress || '127.0.0.1',
    timestamp: new Date().toISOString(),
  };

  db.addAuditLog(log);
  return log;
}
