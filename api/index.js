import mongoose from 'mongoose';
import { app } from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  // In serverless environments, ensure active connection across cold starts & standby
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await connectDB(process.env.MONGODB_URI);
    } catch (err) {
      console.error('[Vercel Serverless] Failed to connect to MongoDB:', err.message);
    }
  }

  // Delegate request directly to Express application
  return app(req, res);
}

