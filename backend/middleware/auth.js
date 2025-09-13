// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function requireAuth(req, res, next){
  const auth = req.headers.authorization || req.headers['x-access-token'];
  if (!auth) return res.status(401).json({ message: 'Missing token' });
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });
    req.user = user; // full mongoose doc
    next();
  } catch(err){
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(role){
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden - insufficient role' });
    next();
  };
}
