import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthPayload = {
  sub: string;
  email: string;
  roleCodes: string[];
  institutionId: string | null;
  teacherId?: string | null;
  studentId?: string | null;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ success: false, message: 'Token requerido.' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    request.auth = payload;
    return next();
  } catch {
    return response.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
}
