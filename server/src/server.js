import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB, disconnectDB } from './config/db.js';
import placeRoutes from './routes/placeRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", CLIENT_ORIGIN]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration with whitelist
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. same-origin, curl, tests, mobile)
      // and allow any Vercel preview or production deployments (*.vercel.app)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General Rate Limiting for all API endpoints
app.use('/api', generalRateLimiter);

// API Routes
app.use('/api/places', placeRoutes);
app.use('/places', placeRoutes);
app.use('/api/health', healthRoutes);
app.use('/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'OmniWay API',
    version: '1.0.0',
    description: 'OmniWay - Modern crowdsourced accessibility directory with time-audited verification',
    docs: '/api/places',
    health: '/api/health'
  });
});

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized RFC 7807 Error Handler
app.use(errorHandler);

// Server startup function
let server = null;

export async function startServer(port = PORT, uri = process.env.MONGODB_URI) {
  try {
    await connectDB(uri);

    // Auto-seed sample venues if database is empty in development mode
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      const { Place } = await import('./models/Place.js');
      const count = await Place.countDocuments();
      if (count === 0) {
        console.log('[Server] Database is currently empty. Seeding initial venues with freshness tiers...');
        const { seedDatabase } = await import('./seed.js');
        await seedDatabase(null, false);
      }
    }

    server = app.listen(port, () => {
      console.log(`[Server] OmniWay API running at http://localhost:${port}`);
      console.log(`[Server] Mode: ${process.env.NODE_ENV || 'development'}`);
    });
    return server;
  } catch (err) {
    console.error(`[Server] Startup failure: ${err.message}`);
    process.exit(1);
  }
}

// Graceful shutdown helper
export async function stopServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log('[Server] HTTP server closed.');
  }
  await disconnectDB();
}

// Handle termination signals
process.on('SIGTERM', async () => {
  console.log('[Server] SIGTERM received. Initiating graceful shutdown...');
  await stopServer();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[Server] SIGINT received. Initiating graceful shutdown...');
  await stopServer();
  process.exit(0);
});

import { fileURLToPath } from 'url';

// Auto-start when executed directly
if (process.env.NODE_ENV !== 'test' && process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer();
}

