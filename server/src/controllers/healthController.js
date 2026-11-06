import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

export async function getHealth(req, res) {
  let dbError = null;
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await connectDB(process.env.MONGODB_URI);
    } catch (err) {
      dbError = err.message;
    }
  }

  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: isDbConnected ? 'connected' : 'disconnected',
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    dbError
  });
}
