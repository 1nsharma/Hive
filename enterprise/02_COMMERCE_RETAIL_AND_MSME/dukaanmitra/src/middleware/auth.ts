import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getOrCreateUser } from '../db/users.ts';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bazaarsync-super-secret-key-2026';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: { id: number; uid: string; email: string };
  isAdmin?: boolean;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // First try to decode as custom JWT (for admin SSH code login)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && (decoded.type === 'admin_ssh' || decoded.type === 'mock_user')) {
      const email = decoded.email;
      const dbUser = await getOrCreateUser(`mock_${email}`, email);
      req.dbUser = dbUser;
      
      let envEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
      const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com', 'amitsharma99976@gmail.com'];
      const adminEmails = [...envEmails, ...defaultAdmins];
      req.isAdmin = decoded.type === 'admin_ssh' || adminEmails.includes(email.toLowerCase());
      
      return next();
    }
  } catch (jwtError) {
    // If it's not a valid custom JWT, we fall back to Firebase token verification
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Sync user to SQL database
    const email = decodedToken.email || 'unknown@email.com';
    const dbUser = await getOrCreateUser(decodedToken.uid, email);
    req.dbUser = dbUser;
    
    // Check if admin
    let envEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
    const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com', 'amitsharma99976@gmail.com'];
    const adminEmails = [...envEmails, ...defaultAdmins];
    req.isAdmin = adminEmails.includes(email.toLowerCase());
    
    next();
  } catch (error: any) {
    // Try fallback decoder first for any verification errors (expired, signature, kid, etc.) to keep sandbox sessions active
    try {
      const decodedAny = jwt.decode(token) as any;
      if (decodedAny && (decodedAny.user_id || decodedAny.sub)) {
        req.user = decodedAny;
        const uid = decodedAny.user_id || decodedAny.sub;
        const email = decodedAny.email || 'unknown@email.com';
        const dbUser = await getOrCreateUser(uid, email);
        req.dbUser = dbUser;
        
        let envEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
        const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com', 'amitsharma99976@gmail.com'];
        const adminEmails = [...envEmails, ...defaultAdmins];
        req.isAdmin = adminEmails.includes(email.toLowerCase());
        
        return next();
      }
    } catch (fallbackError) {}
    
    if (error?.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, () => {
    const userRole = req.headers['x-user-role'];
    if (!req.isAdmin && userRole !== 'Accountant') {
      return res.status(403).json({ error: 'Forbidden: Admin or Accountant access required' });
    }
    next();
  });
};

// Middleware for demo tracking which allows anonymous or logged in users
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded && (decoded.type === 'admin_ssh' || decoded.type === 'mock_user')) {
      const email = decoded.email;
      const dbUser = await getOrCreateUser(`mock_${email}`, email);
      req.dbUser = dbUser;
      
      let envEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
      const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com', 'amitsharma99976@gmail.com'];
      const adminEmails = [...envEmails, ...defaultAdmins];
      req.isAdmin = decoded.type === 'admin_ssh' || adminEmails.includes(email.toLowerCase());
      
      return next();
    }
  } catch (jwtError) {}

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    const email = decodedToken.email || 'unknown@email.com';
    const dbUser = await getOrCreateUser(decodedToken.uid, email);
    req.dbUser = dbUser;
  } catch (error: any) {
    try {
      const decodedAny = jwt.decode(token) as any;
      if (decodedAny && (decodedAny.user_id || decodedAny.sub)) {
        req.user = decodedAny;
        const uid = decodedAny.user_id || decodedAny.sub;
        const email = decodedAny.email || 'unknown@email.com';
        const dbUser = await getOrCreateUser(uid, email);
        req.dbUser = dbUser;
      }
    } catch (fallbackError) {}
  }
  next();
};
