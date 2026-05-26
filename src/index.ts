import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import prisma from './models/prisma.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { startScheduler } from './utils/scheduler.js';

dotenv.config();

// Bug #18: Validate required environment variables before starting
const requiredEnv = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Bug #7: Restrict CORS to the frontend origin instead of allowing any origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
// Bug #17: Use 'combined' format in production, 'dev' in development
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
// Bug #8: Parse cookies so the refresh token cookie is available on req.cookies
app.use(cookieParser());

// Register all routes
registerRoutes(app);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: 'connected',
    },
  });
});

// Global error handler (must be after routes)
app.use(errorHandler);

// Startup sequence
const startServer = async () => {
  try {
    // Test Database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📋 Health check: http://localhost:${port}/health`);
      // Start scheduled cron jobs (meal reminders + daily motivation)
      startScheduler();
    });

    // Graceful Shutdown for HTTP server
    const gracefulShutdown = () => {
      console.log('\nShutting down server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Prisma disconnected safely.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
