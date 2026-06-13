import { eq, and } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

/**
 * Helper to apply tenant filtering to a Drizzle query
 */
export const tenantWhere = (tenantField: any, tenantId: string) => eq(tenantField, tenantId);

/**
 * Tenant guard helper for Express requests
 */
export const getTenantId = (req: any): string | null => {
  return req.user?.tenantId || req.user?.tenant_id || req.query.tenantId || null;
};
