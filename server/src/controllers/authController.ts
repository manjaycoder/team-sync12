import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'teamsync_jwt_super_secret_key_2026_production_ready';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  const token = generateToken(user._id.toString());

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar,
    status: user.status,
    location: user.location,
    joinedDate: user.joinedDate,
    token, // Also send token for clients preferring Authorization header
  });
};

// @desc    Register a new employee/user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Please provide fullName, email, and password' });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email address' });
      return;
    }

    const user = await User.create({
      name: fullName,
      email: email.toLowerCase(),
      password,
      role: 'Team Member',
      department: 'Engineering',
      avatar: `https://images.unsplash.com/photo-${
        1534528741775 + Math.floor(Math.random() * 100000)
      }?w=150&auto=format&fit=crop&q=80`,
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Login employee
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Explicitly select password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get currently logged in employee
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.status(200).json({
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      avatar: req.user.avatar,
      status: req.user.status,
      location: req.user.location,
      joinedDate: req.user.joinedDate,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error fetching user session' });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ message: 'User logged out successfully' });
};
