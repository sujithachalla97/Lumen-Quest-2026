// src/controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

export async function register(req, res) {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'name, phone, email and password are required' });
    }

    // uniqueness checks
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or phone already registered' });
    }

    const user = new User({
      name,
      phone,
      email,
      role: role === 'admin' ? 'admin' : 'user',
      status: 'active'
    });

    await user.setPassword(password);
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req, res){
  // existing login implementation (kept as-is)
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) return res.status(400).json({ message: 'emailOrPhone and password required' });

  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
  });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.status !== 'active') return res.status(403).json({ message: 'User inactive' });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return res.json({ token, user: user.toPublicJSON() });
}

// add this export to src/controllers/authController.js
export async function me(req, res) {
  // requireAuth middleware must set req.user (full mongoose doc)
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  return res.json({ user: req.user.toPublicJSON() });
}
