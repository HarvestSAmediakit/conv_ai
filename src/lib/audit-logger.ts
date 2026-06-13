import { db } from '../db/index.ts';
import * as schema from '../db/schema.ts';
import { v4 as uuidv4 } from 'uuid';

export async function logAction(params: {
  tenantId: string;
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: any;
  req?: any;
}) {
  try {
    const { tenantId, userId, action, resourceType, resourceId, metadata, req } = params;
    
    const id = `log_${uuidv4().substring(0, 8)}`;
    const createdAt = new Date();
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || '0.0.0.0';
    const userAgent = req?.headers?.['user-agent'] || 'unknown';
    
    await db.insert(schema.auditLogs).values({
      id,
      tenantId,
      userId: userId || null,
      action,
      resourceType: resourceType || null,
      resourceId: resourceId || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent,
      createdAt,
    });
  } catch (error) {
    console.error('Audit Logging Failed:', error);
  }
}
