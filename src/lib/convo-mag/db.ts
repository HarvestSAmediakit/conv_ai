import { getPool } from '../../db/index.ts';
import { PoolClient } from 'pg';

/**
 * Wraps database operations in a transaction block scoped strictly to the specified tenant.
 * Uses local configuration boundaries to safeguard multi-tenant data access paths.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    
    // Bind setting strictly to current transaction context 
    await client.query(
      `SELECT set_config('app.current_tenant_id', $1, true);`,
      [tenantId]
    );
    
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export { getPool };
