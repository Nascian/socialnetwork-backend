import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.substring('Bearer '.length).trim();
  const secret = (process.env.JWT_SECRET || 'dev_secret') as jwt.Secret;
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & { sub?: string };
    if (!decoded || !decoded.sub) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.sub as string;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
