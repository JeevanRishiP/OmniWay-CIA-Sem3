import { app } from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
  // In serverless environments, reuse database connection across warm invocations
  if (!isDbConnected && process.env.MONGODB_URI) {
    try {
      await connectDB(process.env.MONGODB_URI);
      isDbConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] Failed to connect to MongoDB:', err.message);
    }
  }

  // Delegate request directly to Express application
  return app(req, res);
}

