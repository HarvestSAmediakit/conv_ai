import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const tenantGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assuming tenant_id is available in user claims, or derived from user ID
  const tenantId = req.user.tenant_id || `tenant_${req.user.uid.substring(0, 8)}`;
  (req as any).tenantId = tenantId;
  next();
};
