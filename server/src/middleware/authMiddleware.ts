import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no session token provided' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'teamsync_jwt_super_secret_key_2026_production_ready';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User belonging to this token no longer exists' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired or invalid token' });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware.
 * Enforces permissions for Super Admin, Company Owner, Admin, Manager, and Employee.
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userRole = (req.user.role || 'employee').toLowerCase().replace(/\s+/g, '_');
    const allowed = roles.map((r) => r.toLowerCase().replace(/\s+/g, '_'));

    // Super Admin & Company Owner always have full privileges
    if (userRole === 'super_admin' || userRole === 'company_owner' || userRole === 'admin') {
      return next();
    }

    if (!allowed.includes(userRole)) {
      res.status(403).json({
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
      });
      return;
    }

    next();
  };
};
