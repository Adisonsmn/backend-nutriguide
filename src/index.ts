import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import prisma from './models/prisma.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

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
