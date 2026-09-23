import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db';
import { notFound, errorHandler } from './middleware/errorMiddleware';

// Route imports
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import aiRoutes from './routes/aiRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';

// Models & Seeder for auto-initialization
import { Department } from './models/Department';
import { User } from './models/User';
import { seedInitialData } from './scripts/seed';

// Load environment variables: checks local server/.env and root .env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../server/.env') });
dotenv.config(); // Fallback to current working directory .env

const app: Application = express();
const PORT = process.env.PORT || 5001;

// CORS configuration with credentials support
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5001',
  'http://localhost:5000',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. same-origin single-instance, curl, mobile apps)
      if (!origin) return callback(null, true);
      
      // Allow configured origins or any *.onrender.com subdomain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      
      callback(null, true); // Fallback permissive to prevent deployment lockouts
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers & cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint for Render & Docker monitoring
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Team-Sync Enterprise Single-Instance Engine',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Mount API feature routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// =========================================================================
// Single-Instance Deployment: Serve Static Frontend Client Assets
// =========================================================================
const possibleClientDistPaths = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../dist'),
];

const clientDistPath = possibleClientDistPaths.find(
  (candidate) => fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'index.html'))
);

if (clientDistPath) {
  console.log(`[Single-Instance] Serving compiled frontend bundle from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA fallback for client-side routing (React Router)
  // Non-API requests return index.html so React Router renders the requested page
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('[Single-Instance] Frontend dist build not detected. Running in API-only mode.');
}

// Error handling middleware for unmatched /api routes
app.use(notFound);
app.use(errorHandler);

// Connect DB and launch server
const startServer = async () => {
  await connectDB();

  // Auto-seed check for fresh Render / MongoDB Atlas deployments
  if (process.env.AUTO_SEED === 'true') {
    try {
      const deptCount = await Department.countDocuments();
      const userCount = await User.countDocuments();
      if (deptCount === 0 || userCount === 0) {
        console.log('[Auto-Seed] Empty database detected. Populating demo departments, users, projects, and tasks...');
        await seedInitialData(false);
      }
    } catch (err: any) {
      console.warn('[Auto-Seed] Auto-seed check encountered non-fatal error:', err.message);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`=================================================================`);
    console.log(` 🚀 Team-Sync Full-Stack Engine running on port ${PORT}`);
    console.log(` 🌐 Endpoint: http://localhost:${PORT}`);
    console.log(` 🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(` 📦 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(` 🗂️  Static Frontend Serving: ${clientDistPath ? 'ENABLED' : 'DISABLED'}`);
    console.log(`=================================================================`);
  });

  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`=================================================================`);
      console.error(` ❌ Port ${PORT} is already in use by another running process.`);
      console.error(` 💡 Solution: Close the conflicting terminal or run:`);
      console.error(`    npx kill-port ${PORT}`);
      console.error(`=================================================================`);
    } else {
      console.error('[Server Error]:', error);
    }
    process.exit(1);
  });
};

startServer();

export default app;
